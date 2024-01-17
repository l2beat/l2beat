import { providers, utils } from 'ethers'
import * as z from 'zod'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { Hash256 } from '../../../utils/Hash256'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Trace } from '../../provider/TransactionTrace'
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
      const traces = await provider.getTransactionTrace(txHash)
      traces.forEach((trace) =>
        this.definition.actorType === 'validator'
          ? this.processSetValidatorTrace(trace, isActor)
          : this.processSetIsBatchPosterTrace(trace, isActor),
      )
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

  processSetValidatorTrace(
    trace: Trace,
    isValidator: Record<string, boolean>,
  ): void {
    if (trace.type !== 'call') return
    if (trace.action.callType !== 'delegatecall') return

    const input = trace.action.input
    if (!input.startsWith(this.setValidatorSighash)) return

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

  processSetIsBatchPosterTrace(
    trace: Trace,
    isBatchPoster: Record<string, boolean>,
  ): void {
    if (trace.type !== 'call') return
    if (trace.action.callType !== 'delegatecall') return

    const input = trace.action.input
    if (!input.startsWith(this.setIsBatchPosterSighash)) return

    const decodedInput = this.interface.decodeFunctionData(
      this.setIsBatchPosterFn,
      input,
    )
    const address = decodedInput[0] as string
    const flag = decodedInput[1] as boolean

    isBatchPoster[address] = flag
  }
}
