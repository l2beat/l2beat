import { Logger } from '@l2beat/backend-tools'
import {
  ChainConfig,
  Layer2,
  OnchainVerifier,
  ZkCatalogProject,
  chains,
  layer2s,
  zkCatalogProjects,
} from '@l2beat/config'
import { BackendProject } from '@l2beat/config'
import { BlockscoutV2Client } from '@l2beat/shared'
import {
  assert,
  ChainId,
  UnixTime,
  VerifierStatus,
  VerifiersApiResponse,
  cacheAsyncFunction,
} from '@l2beat/shared-pure'
import { Peripherals } from '../../peripherals/Peripherals'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { VerifierStatusRepository } from './repositories/VerifierStatusRepository'

export interface VerifiersControllerDeps {
  peripherals: Peripherals
  projects: BackendProject[]
  logger: Logger
}

export class VerifiersController {
  private readonly taskQueue: TaskQueue<void>
  private readonly logger: Logger
  getCachedVerifierStatuses: () => Promise<VerifiersApiResponse>
  private readonly verifierStatusRepository: VerifierStatusRepository

  constructor(private readonly $: VerifiersControllerDeps) {
    this.logger = $.logger ? $.logger.for(this) : Logger.SILENT
    this.verifierStatusRepository = $.peripherals.getRepository(
      VerifierStatusRepository,
    )

    const cached = cacheAsyncFunction(() => this.getVerifierStatuses())
    this.getCachedVerifierStatuses = cached.call
    this.taskQueue = new TaskQueue(
      cached.refetch,
      this.logger.for('taskQueue'),
      { metricsId: VerifiersController.name },
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Caching: initial caching scheduled')

    const hour = 60 * 60 * 1000
    setInterval(() => {
      this.taskQueue.addIfEmpty()
      this.logger.info('Caching: refetch scheduled')
    }, hour)
  }

  async getVerifierStatuses(): Promise<VerifiersApiResponse> {
    const verifiers = this.getVerifiers()
    assert(verifiers.length > 0, 'No verifier addresses found')

    const fetchOperations = verifiers.map(async (verifier) => {
      try {
        const blockscoutClient = this.getBlockscoutClient(verifier.chainId)
        const txs = await blockscoutClient.getInternalTransactions(
          verifier.contractAddress,
        )
        txs.sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber())
        const lastUsed = txs[0].timestamp

        this.verifierStatusRepository.addOrUpdate({
          address: verifier.contractAddress.toString(),
          chainId: verifier.chainId,
          lastUsed,
          lastUpdated: UnixTime.now(),
        })

        return {
          address: verifier.contractAddress.toString(),
          timestamp: lastUsed,
        }
      } catch (error) {
        return this.handleError(verifier, error)
      }
    })

    return await Promise.all(fetchOperations)
  }

  getVerifiers(
    l2s: Layer2[] = layer2s,
    zks: ZkCatalogProject[] = zkCatalogProjects,
  ): OnchainVerifier[] {
    const verifiers: OnchainVerifier[] = []

    l2s.forEach((l2) => {
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

    zks.forEach((zk) => {
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

  getBlockscoutClient(
    chainId: ChainId,
    allChains: ChainConfig[] = chains,
  ): BlockscoutV2Client {
    const chain = allChains.find((c) => c.chainId === chainId.valueOf())

    if (!chain?.blockscoutV2ApiUrl) {
      throw new Error(
        `Blockscout API URL is not configured for chain ${chainId}`,
      )
    }

    return this.$.peripherals.getClient(BlockscoutV2Client, {
      url: chain.blockscoutV2ApiUrl,
    })
  }

  async handleError(
    verifier: OnchainVerifier,
    error: unknown,
  ): Promise<VerifierStatus> {
    this.logger.warn(
      `Failed to get internal transactions for verifier contract`,
      {
        error,
        address: verifier.contractAddress.toString(),
        chain: verifier.chainId.toString(),
      },
    )

    const savedStatus = await this.verifierStatusRepository.findVerifierStatus(
      verifier.contractAddress.toString(),
      verifier.chainId,
    )

    if (!savedStatus) {
      return {
        address: verifier.contractAddress.toString(),
        timestamp: null,
      }
    }

    const secondsInDay = 60 * 60 * 24
    const lastUpdatedDaysAgo = Math.floor(
      (UnixTime.now().toNumber() - savedStatus.lastUpdated.toNumber()) /
        secondsInDay,
    )

    if (lastUpdatedDaysAgo > 1) {
      this.logger.warn(
        `Found saved status for verifier contract, but it is outdated`,
        {
          address: verifier.contractAddress.toString(),
          chain: verifier.chainId.toString(),
          lastUpdated: savedStatus.lastUpdated,
        },
      )

      return {
        address: verifier.contractAddress.toString(),
        timestamp: null,
      }
    }

    return {
      address: verifier.contractAddress.toString(),
      timestamp: savedStatus.lastUsed,
    }
  }
}
