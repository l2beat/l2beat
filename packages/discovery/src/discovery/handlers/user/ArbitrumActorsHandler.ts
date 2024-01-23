import { providers, utils } from 'ethers'
import * as z from 'zod'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { Hash256 } from '../../../utils/Hash256'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DebugTransactionCall } from '../../provider/DebugTransactionTrace'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'

export type ArbitrumActorsHandlerDefinition = z.infer<
  typeof ArbitrumActorsHandlerDefinition
>
export const ArbitrumActorsHandlerDefinition = z.strictObject({
  type: z.literal('arbitrumActors'),
  actorType: z.union([z.literal('validator'), z.literal('batchPoster')]),
})

export class ArbitrumActorsHandler implements ClassicHandler {
  readonly dependencies: string[] = []
  readonly setValidatorFn = 'setValidator(address[] _validator, bool[] _val)'
  readonly setIsBatchPosterFn =
    'setIsBatchPoster(address addr, bool isBatchPoster_)'
  readonly ownerFunctionCalledEvent = 'OwnerFunctionCalled(uint256 indexed id)'
  readonly interface = new utils.Interface([
    `function ${this.setValidatorFn}`,
    `function ${this.setIsBatchPosterFn}`,
    `event ${this.ownerFunctionCalledEvent}`,
  ])
  readonly setValidatorSighash = this.interface.getSighash(this.setValidatorFn)
  readonly setIsBatchPosterSighash = this.interface.getSighash(
    this.setIsBatchPosterFn,
  )

  constructor(
    readonly field: string,
    readonly definition: ArbitrumActorsHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      this.definition.actorType === 'validator'
        ? 'Fetching Arbitrum Validators'
        : 'Fetching Arbitrum Batch Posters',
    ])

    // Find transactions in which setValidator/setIsBatchPoster was called
    const logs = await this.getRelevantLogs(provider, address, blockNumber)
    const txHashes = logs.map((log) => Hash256(log.transactionHash))

    // Extract setValidator/setIsBatchPoster call parameters
    // from transaction traces and process them
    const isActor: Record<string, boolean> = {}
    for (const txHash of txHashes) {
      const trace = await provider.getDebugTransactionTrace(txHash)
      this.definition.actorType === 'validator'
        ? this.processSetValidatorCalls(trace.calls, isActor)
        : this.processSetIsBatchPosterCalls(trace.calls, isActor)
    }

    const activeActors = Object.keys(isActor).filter((key) => isActor[key])
    activeActors.sort()

    return {
      field: this.field,
      value: activeActors,
    }
  }

  private async getRelevantLogs(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<providers.Log[]> {
    const topic0 = this.interface.getEventTopic(this.ownerFunctionCalledEvent)
    // eventParam is 6 for validators and 1 for batch posters
    const eventParam = this.definition.actorType === 'validator' ? 6 : 1
    const topic1 = utils.defaultAbiCoder.encode(['uint256'], [eventParam])
    const logs = await provider.getLogs(
      address,
      [topic0, topic1],
      0,
      blockNumber,
    )
    return logs
  }

  processSetValidatorCalls(
    calls: DebugTransactionCall[] | undefined,
    isValidator: Record<string, boolean>,
  ): void {
    for (const trace of calls ?? []) {
      const input = trace.input
      if (
        trace.type === 'DELEGATECALL' &&
        input.startsWith(this.setValidatorSighash)
      ) {
        const decodedInput = this.interface.decodeFunctionData(
          this.setValidatorFn,
          input,
        )
        const addresses = decodedInput[0] as string[]
        const flags = decodedInput[1] as boolean[]

        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i]
          const flag = flags[i]
          if (address === undefined || flag === undefined) {
            throw new Error(`Invalid input to ${this.setValidatorFn}`)
          }
          isValidator[address] = flag
        }
      }

      this.processSetValidatorCalls(trace.calls, isValidator)
    }
  }

  processSetIsBatchPosterCalls(
    calls: DebugTransactionCall[] | undefined,
    isBatchPoster: Record<string, boolean>,
  ): void {
    for (const trace of calls ?? []) {
      const input = trace.input
      if (
        trace.type === 'DELEGATECALL' &&
        input.startsWith(this.setIsBatchPosterSighash)
      ) {
        const decodedInput = this.interface.decodeFunctionData(
          this.setIsBatchPosterFn,
          input,
        )
        const address = decodedInput[0] as string
        const flag = decodedInput[1] as boolean

        isBatchPoster[address] = flag
      }
      this.processSetIsBatchPosterCalls(trace.calls, isBatchPoster)
    }
  }
}
