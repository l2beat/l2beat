import { assert, ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type BigNumber, utils } from 'ethers'
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

export interface EventTraceHandlerDefinition {
  type: 'eventTrace'
  /** Event name by which we gather the transaction hashes */
  event: string
  /** Function call params you want to decode */
  function: string
  /** The address of the contract that emits the event */
  eventSource?: string
}

export const EventTraceHandlerDefinition = v.object({
  type: v.literal('eventTrace'),
  event: v.string(),
  function: v.string(),
  eventSource: v.string().optional(),
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

    assert(
      functionAbi,
      'Function abi not found for ' + this.definition.function,
    )
    assert(eventAbi, 'Event abi not found for ' + this.definition.event)

    this.functionAbi = functionAbi
    this.eventAbi = eventAbi
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const transactionHashes = await this.getTransactions(
      provider,
      this.definition.eventSource
        ? ChainSpecificAddress(this.definition.eventSource)
        : address,
    )
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

function materializeNamed(value: unknown, param: ParamType): unknown {
  if (param.baseType === 'tuple') {
    const obj: Record<string, unknown> = {}

    for (const [i, comp] of param.components.entries()) {
      const r = value as Record<string, unknown>
      obj[comp.name ?? i] = materializeNamed(r[i], comp)
    }

    return obj
  }

  if (param.baseType === 'array') {
    const r = value as unknown[]
    return r.map((v) => materializeNamed(v, param.arrayChildren))
  }

  if (param.baseType.includes('int')) {
    const r = value as BigNumber
    return r.toNumber()
  }

  return value
}

function decodeWithNames(abi: string[], fn: string, data: string) {
  const iface = new utils.Interface(abi)
  const frag = iface.getFunction(fn)
  const decoded = iface.decodeFunctionData(frag, data)
  const named: Record<string, unknown> = {}
  for (const [i, inp] of frag.inputs.entries()) {
    named[inp.name ?? i] = materializeNamed(decoded[i], inp)
  }
  return named as ContractValue
}
