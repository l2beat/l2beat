import type { Logger } from '@l2beat/backend-tools'

import type { ChainConfig, OnchainVerifier } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { BlockscoutV2Client, HttpClient } from '@l2beat/shared'
import { assert, type ChainId, UnixTime } from '@l2beat/shared-pure'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export type VerifiersStatusRefresherDeps = {
  db: Database
  clock: Clock
  logger: Logger
  verifiers: OnchainVerifier[]
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
    assert(this.$.verifiers.length > 0, 'No verifier addresses found')

    const toRefresh = this.$.verifiers.map(async (verifier) => {
      try {
        const blockscoutClient = this.getBlockscoutClient(verifier.chainId)
        const transactions = await blockscoutClient.getInternalTransactions(
          verifier.contractAddress,
        )

        transactions.sort((a, b) => b.timestamp - a.timestamp)

        const lastUsed = transactions[0].timestamp

        await this.$.db.verifierStatus.upsert({
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

  getBlockscoutClient(chainId: ChainId): BlockscoutV2Client {
    const chain = this.$.chains.find((c) => c.chainId === chainId.valueOf())
    const blockscoutV2 = chain?.apis.find((x) => x.type === 'blockscoutV2')
    if (!blockscoutV2) {
      throw new Error(
        `Blockscout API URL is not configured for chain ${chainId}`,
      )
    }
    return new BlockscoutV2Client(
      new HttpClient(),
      blockscoutV2.url,
      this.logger,
    )
  }
}
