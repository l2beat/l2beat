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
  logger?: Logger
}

// TODO to be removed when we will have proper project config in place
export const testAddresses: EthereumAddress[] = [
  // zkSync Era
  EthereumAddress('0xdd9C826196cf3510B040A8784D85aE36674c7Ed2'),
  // Polygon zkEVM
  EthereumAddress('0x0775e11309d75aA6b0967917fB0213C5673eDf81'),
  // Starknet
  EthereumAddress('0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60'),
  // Scroll
  EthereumAddress('0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF'),
  EthereumAddress('0x585DfaD7bF4099E011D185E266907A8ab60DAD2D'),
  EthereumAddress('0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247'),
  EthereumAddress('0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1'),
  EthereumAddress('0x2293cd12e8564e8219d314b075867c2f66ac6941'),
  // Loopring
  EthereumAddress('0x6150343E0F43A17519c0327c41eDd9eBE88D01ef'),
]

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

    return await Promise.all(
      addresses.map(async (address) => {
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
      }),
    )
  }

  getVerifierAddresses(
    l2s: Layer2[] = layer2s,
    zks: ZkCatalogProject[] = zkCatalogProjects,
  ): EthereumAddress[] {
    const verifierAddress: EthereumAddress[] = [...testAddresses]

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
