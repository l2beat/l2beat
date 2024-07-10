import { assert, Logger } from '@l2beat/backend-tools'

import {
  ChainConfig,
  Layer2,
  OnchainVerifier,
  ZkCatalogProject,
} from '@l2beat/config'
import { Database } from '@l2beat/database'
import { BlockscoutV2Client } from '@l2beat/shared'
import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { Peripherals } from '../../peripherals/Peripherals'

export type VerifiersStatusRefresherDeps = {
  database: Database
  peripherals: Peripherals
  clock: Clock
  logger: Logger
  layer2s: Layer2[]
  zkCatalogProjects: ZkCatalogProject[]
  chains: ChainConfig[]
}

export class VerifiersStatusRefresher {
  private readonly logger: Logger
  private readonly refreshQueue: TaskQueue<void>
  constructor(private readonly $: VerifiersStatusRefresherDeps) {
    this.logger = $.logger.for(this)
    this.refreshQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Refresh started')
        await this.refresh()
        this.logger.info('Refresh finished')
      },
      this.logger.for('refreshQueue'),
      { metricsId: 'VerifiersStatusRefresher' },
    )
  }

  start() {
    this.logger.info('Started')
    this.$.clock.onNewDay(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  async refresh() {
    const verifiers = this.getVerifiers()
    assert(verifiers.length > 0, 'No verifier addresses found')

    const toRefresh = verifiers.map(async (verifier) => {
      try {
        const blockscoutClient = this.getBlockscoutClient(verifier.chainId)
        const transactions = await blockscoutClient.getInternalTransactions(
          verifier.contractAddress,
        )

        transactions.sort(
          (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber(),
        )

        const lastUsed = transactions[0].timestamp

        await this.$.database.verifierStatus.addOrUpdate({
          address: verifier.contractAddress.toString(),
          chainId: verifier.chainId,
          lastUsed,
          lastUpdated: UnixTime.now(),
        })
      } catch (error) {
        this.logger.warn('Could not refresh verifier status', {
          verifier: verifier.name,
          error: error,
        })
      }
    })

    await Promise.all(toRefresh)
  }

  getVerifiers(): OnchainVerifier[] {
    const verifiers: OnchainVerifier[] = []

    this.$.layer2s.forEach((l2) => {
      if (l2.stateValidation?.proofVerification) {
        this.logger.debug(
          `Found l2 project with verifiers: ${l2.display.name}`,
          {
            verifiers: l2.stateValidation.proofVerification.verifiers.map(
              (v) => ({
                address: v.contractAddress.toString(),
                chain: v.chainId.toString(),
              }),
            ),
          },
        )
        verifiers.push(...l2.stateValidation.proofVerification.verifiers)
      }
    })

    this.$.zkCatalogProjects.forEach((zk) => {
      this.logger.debug(`Found zk project with verifiers: ${zk.display.name}`, {
        verifiers: zk.proofVerification.verifiers.map((v) => ({
          address: v.contractAddress.toString(),
          chain: v.chainId.toString(),
        })),
      })
      verifiers.push(...zk.proofVerification.verifiers)
    })

    return verifiers
  }

  getBlockscoutClient(chainId: ChainId): BlockscoutV2Client {
    const chain = this.$.chains.find((c) => c.chainId === chainId.valueOf())

    if (!chain?.blockscoutV2ApiUrl) {
      throw new Error(
        `Blockscout API URL is not configured for chain ${chainId}`,
      )
    }

    return this.$.peripherals.getClient(BlockscoutV2Client, {
      url: chain.blockscoutV2ApiUrl,
    })
  }
}
