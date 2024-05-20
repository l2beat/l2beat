import { Logger } from '@l2beat/backend-tools'
import { Project } from '../../model/Project'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import {
  cacheAsyncFunction,
  EthereumAddress,
  UnixTime,
  VerifiersApiResponse,
  VerifierStatus,
} from '@l2beat/shared-pure'
import { BlockscoutClient } from '../../peripherals/blockscout/BlockscoutClient'
import { layer2s, zkCatalogProjects } from '@l2beat/config'
import { assert } from 'console'

export interface L2CostsControllerDeps {
  blockscoutClient: BlockscoutClient
  projects: Project[]
  logger?: Logger
}

export class VerifiersController {
  private readonly taskQueue: TaskQueue<void>
  private readonly logger: Logger
  getCachedVerifierStatuses: () => Promise<VerifiersApiResponse>

  constructor(private readonly $: L2CostsControllerDeps) {
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

    const response: VerifierStatus[] = []

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
          console.warn(
            `Failed to get internal transactions for ${address}`,
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

  private getVerifierAddresses(): EthereumAddress[] {
    const verifierAddress: EthereumAddress[] = [
      EthereumAddress('0xdd9C826196cf3510B040A8784D85aE36674c7Ed2'),
      EthereumAddress('0x0775e11309d75aA6b0967917fB0213C5673eDf81'),
      EthereumAddress('0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60'),
      EthereumAddress('0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF'),
      EthereumAddress('0x585DfaD7bF4099E011D185E266907A8ab60DAD2D'),
      EthereumAddress('0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247'),
      EthereumAddress('0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1'),
      EthereumAddress('0x2293cd12e8564e8219d314b075867c2f66ac6941'),
      EthereumAddress('0x6150343E0F43A17519c0327c41eDd9eBE88D01ef'),
    ]

    // layer2s.forEach((l2) => {
    //   if (l2.stateValidation?.proofVerification) {
    //     const adresses = l2.stateValidation.proofVerification.verifiers.map(
    //       (v) => v.contractAddress,
    //     )
    //     verifierAddress.push(...adresses)
    //   }
    // })

    // zkCatalogProjects.forEach((l2) => {
    //   const adresses = l2.proofVerification.verifiers.map(
    //     (v) => v.contractAddress,
    //   )
    //   verifierAddress.push(...adresses)
    // })

    return verifierAddress
  }
}
