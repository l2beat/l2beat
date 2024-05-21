import { Logger } from '@l2beat/backend-tools'
import {
  Layer2,
  ZkCatalogProject,
  layer2s,
  zkCatalogProjects,
} from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  VerifiersApiResponse,
  cacheAsyncFunction,
} from '@l2beat/shared-pure'
import { Project } from '../../model/Project'
import { BlockscoutClient } from '../../peripherals/blockscout/BlockscoutClient'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export interface VerifiersControllerDeps {
  blockscoutClient: BlockscoutClient
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
    const addresses = this.getVerifierAddresses()
    assert(addresses.length > 0, 'No verifier addresses found')

    const fetchOperations = addresses.map(async (address) => {
      try {
        const txs =
          await this.$.blockscoutClient.getInternalTransactions(address)
        txs.sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber())
        return {
          address: address.toString(),
          timestamp: txs[0].timestamp,
        }
      } catch (error) {
        this.logger.warn(
          `Failed to get internal transactions for verifier contract ${address}`,
          error,
        )
        return {
          address: address.toString(),
          timestamp: null,
        }
      }
    })

    return await Promise.all(fetchOperations)
  }

  getVerifierAddresses(
    l2s: Layer2[] = layer2s,
    zks: ZkCatalogProject[] = zkCatalogProjects,
  ): EthereumAddress[] {
    const verifierAddress: EthereumAddress[] = []

    l2s.forEach((l2) => {
      if (l2.stateValidation?.proofVerification) {
        const adresses = l2.stateValidation.proofVerification.verifiers.map(
          (v) => v.contractAddress,
        )
        this.logger.debug(`Found L2 project with verifiers: ${l2.id}`, {
          adresses,
        })
        verifierAddress.push(...adresses)
      }
    })

    zks.forEach((zk) => {
      const adresses = zk.proofVerification.verifiers.map(
        (v) => v.contractAddress,
      )
      this.logger.debug(`Found L2 project with verifiers: ${zk.display.name}`, {
        adresses,
      })
      verifierAddress.push(...adresses)
    })

    // return unique addresses
    return [...new Set(verifierAddress)]
  }
}
