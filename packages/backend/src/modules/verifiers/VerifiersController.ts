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
import { BlockscoutV2Client } from '@l2beat/shared'
import {
  assert,
  ChainId,
  VerifiersApiResponse,
  cacheAsyncFunction,
} from '@l2beat/shared-pure'
import { Project } from '../../model/Project'
import { Peripherals } from '../../peripherals/Peripherals'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export interface VerifiersControllerDeps {
  peripherals: Peripherals
  projects: Project[]
  logger: Logger
}

export class VerifiersController {
  private readonly taskQueue: TaskQueue<void>
  private readonly logger: Logger
  getCachedVerifierStatuses: () => Promise<VerifiersApiResponse>

  constructor(private readonly $: VerifiersControllerDeps) {
    this.logger = $.logger ? $.logger.for(this) : Logger.SILENT

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
        return {
          address: verifier.contractAddress.toString(),
          timestamp: txs[0].timestamp,
        }
      } catch (error) {
        this.logger.warn(
          `Failed to get internal transactions for verifier contract`,
          {
            error,
            address: verifier.contractAddress.toString(),
            chain: verifier.chainId.toString(),
          },
        )

        return {
          address: verifier.contractAddress.toString(),
          timestamp: null,
        }
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
            verifiers: verifiers.map((v) => ({
              address: v.contractAddress.toString(),
              chain: v.chainId.toString(),
            })),
          },
        )
        verifiers.push(...l2.stateValidation?.proofVerification.verifiers)
      }
    })

    zks.forEach((zk) => {
      this.logger.debug(`Found zk project with verifiers: ${zk.display.name}`, {
        verifiers: verifiers.map((v) => ({
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
}
