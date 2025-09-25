import { type ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber, utils } from 'ethers'
import type { ParamType } from 'ethers/lib/utils'
import type { ContractValue } from '../../output/types'
import type {
  DebugTransactionCall,
  DebugTransactionCallResponse,
} from '../../provider/DebugTransactionTrace'
import type { IProvider } from '../../provider/IProvider'
import { getSighash } from '../getSighash'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { getFunctionFragment } from '../utils/getFunctionFragment'

export type EventTraceHandlerDefinition = v.infer<
  typeof EventTraceHandlerDefinition
>

export const EventTraceHandlerDefinition = v.object({
  type: v.literal('eventTrace'),
  event: v.string(),
  function: v.string(),
})

// TODO: I guess we need better names for this handler
export class EventTraceHandler implements Handler {
  readonly dependencies: string[] = []
  readonly functionAbi: string
  readonly eventAbi: string

  constructor(
    readonly field: string,
    private readonly definition: EventTraceHandlerDefinition,
    private readonly abi: string[],
  ) {
    const functionAbi = getFunctionFragment(
      this.definition.function,
      this.abi,
      (x) => x.name === this.definition.function,
    ).format(utils.FormatTypes.full)
    const eventAbi = getEventFragment(this.definition.event, this.abi).format(
      utils.FormatTypes.full,
    )

    this.functionAbi = functionAbi
    this.eventAbi = eventAbi
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const transactionHashes = await this.getTransactions(provider, address)
    const traces = await this.getTraces(provider, transactionHashes)
    const calldata = traces.flatMap((trace) => this.traverseTrace(trace))

    const values = calldata.map((cd) =>
      decodeWithNames([this.functionAbi], this.definition.function, cd),
    )

    return {
      field: this.field,
      value: values,
    }
  }

  private async getTransactions(
    provider: IProvider,
    address: ChainSpecificAddress,
  ) {
    const logs = await provider.getEvents(address, this.eventAbi, [])

    return logs.map((log) => Hash256(log.log.transactionHash))
  }

  private getTraces(provider: IProvider, transactions: Hash256[]) {
    return Promise.all(
      transactions.map((transaction) => provider.getDebugTrace(transaction)),
    )
  }

  private traverseTrace(trace: DebugTransactionCallResponse) {
    const calldata: string[] = []

    for (const call of trace.calls ?? []) {
      for (const callData of this.walk(call)) {
        calldata.push(callData)
      }
    }

    return calldata
  }

  private *walk(call: DebugTransactionCall): IterableIterator<string> {
    const sigHash = getSighash(this.functionAbi)

    if (call.input.startsWith(sigHash)) {
      yield call.input
    }

    for (const nested of call.calls ?? []) {
      yield* this.walk(nested)
    }
  }
}

function materializeNamed(value: unknown, param: ParamType): ContractValue {
  if (param.baseType === 'tuple' && typeof value === 'object') {
    const obj: Record<string, ContractValue> = {}

    for (const [idx, comp] of param.components.entries()) {
      obj[comp.name ?? idx] = materializeNamed(
        (value as Record<string, unknown>)[idx],
        comp,
      )
    }

    return obj
  }

  if (param.baseType === 'array' && Array.isArray(value)) {
    return value.map((v) => materializeNamed(v, param.arrayChildren))
  }

  if (param.baseType.includes('int') && BigNumber.isBigNumber(value)) {
    return value.toNumber()
  }

  return value as ContractValue
}

function decodeWithNames(abi: string[], fn: string, data: string) {
  const iface = new utils.Interface(abi)
  const fragment = iface.getFunction(fn)
  const decodedData = iface.decodeFunctionData(fragment, data)
  const named: Record<string, ContractValue> = {}
  for (const [key, inp] of fragment.inputs.entries()) {
    named[inp.name ?? key] = materializeNamed(decodedData[key], inp)
  }
  return named
}
