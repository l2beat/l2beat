import { type ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import type { DebugTransactionCall } from '../../provider/DebugTransactionTrace'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ArbitrumActorsHandlerDefinition = v.infer<
  typeof ArbitrumActorsHandlerDefinition
>
export const ArbitrumActorsHandlerDefinition = v.strictObject({
  type: v.literal('arbitrumActors'),
  actorType: v.union([v.literal('validator'), v.literal('batchPoster')]),
})

export class ArbitrumActorsHandler implements Handler {
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
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    // Find transactions in which setValidator/setIsBatchPoster was called
    const logs = await this.getRelevantLogs(provider, address)
    const txHashes = logs.map((log) => Hash256(log.transactionHash))

    // Extract setValidator/setIsBatchPoster call parameters
    // from transaction traces and process them
    const isActor: Record<string, boolean> = {}
    for (const txHash of txHashes) {
      const trace = await provider.getDebugTrace(txHash)
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

  private getRelevantLogs(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<providers.Log[]> {
    const topic0 = this.interface.getEventTopic(this.ownerFunctionCalledEvent)
    // eventParam is 6 for validators and 1 for batch posters
    const eventParam = this.definition.actorType === 'validator' ? 6 : 1
    const topic1 = utils.defaultAbiCoder.encode(['uint256'], [eventParam])
    return provider.getLogs(address, [topic0, topic1])
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
