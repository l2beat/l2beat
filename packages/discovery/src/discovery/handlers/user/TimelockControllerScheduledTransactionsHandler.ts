import { ChainSpecificAddress, unique } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber, utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { ProxyDetector } from '../../proxies/ProxyDetector'
import { get$Implementations } from '../../utils/extractors'
import { getSighash } from '../getSighash'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type TimelockControllerScheduledTransactionsHandlerDefinition = v.infer<
  typeof TimelockControllerScheduledTransactionsHandlerDefinition
>
export const TimelockControllerScheduledTransactionsHandlerDefinition =
  v.strictObject({
    type: v.literal('timelockControllerScheduledTransactions'),
  })

// OpenZeppelin TimelockController (v4 and v5 emit the same events)
const abi = new utils.Interface([
  'event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)',
  'event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)',
  'event Cancelled(bytes32 indexed id)',
  'function getTimestamp(bytes32 id) view returns (uint256)',
])

interface ScheduledCall {
  index: number
  target: string
  value: string
  data: string
}

interface ScheduledOperation {
  id: string
  predecessor: string
  delay: string
  scheduledAtBlock: number
  calls: ScheduledCall[]
}

/**
 * Lists the operations of an OpenZeppelin TimelockController that are
 * scheduled and neither executed nor cancelled, with every call decoded
 * against the target's verified ABI and the time at which the operation
 * becomes executable.
 *
 * Executed and cancelled operations are dropped on purpose: the field is
 * meant to show what can still happen to the project, and an ever-growing
 * history would hide that behind noise. Executed operations are visible in
 * the diff history anyway.
 */
export class TimelockControllerScheduledTransactionsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(readonly field: string) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const pending = await this.getPendingOperations(provider, address)
    const value: ContractValue[] = []
    for (const operation of pending) {
      value.push(await this.describeOperation(provider, address, operation))
    }
    return { field: this.field, value, ignoreRelative: true }
  }

  async getPendingOperations(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ScheduledOperation[]> {
    const logs = await provider.getLogs(address, [
      [
        abi.getEventTopic('CallScheduled'),
        abi.getEventTopic('CallExecuted'),
        abi.getEventTopic('Cancelled'),
      ],
    ])

    // Logs arrive in chain order, so replaying them gives the live set. The
    // same id can be scheduled again after a cancel, hence delete-then-set.
    const operations = new Map<string, ScheduledOperation>()
    for (const log of logs) {
      const parsed = abi.parseLog(log)
      const id = parsed.args.id as string
      if (parsed.name === 'CallScheduled') {
        const call: ScheduledCall = {
          index: BigNumber.from(parsed.args.index).toNumber(),
          target: parsed.args.target as string,
          value: BigNumber.from(parsed.args.value).toString(),
          data: parsed.args.data as string,
        }
        const existing = operations.get(id)
        if (existing !== undefined && call.index !== 0) {
          existing.calls.push(call)
        } else {
          // index 0 starts an operation (a batch emits one event per call)
          operations.set(id, {
            id,
            predecessor: parsed.args.predecessor as string,
            delay: BigNumber.from(parsed.args.delay).toString(),
            scheduledAtBlock: log.blockNumber,
            calls: [call],
          })
        }
      } else {
        operations.delete(id)
      }
    }
    return [...operations.values()]
  }

  async describeOperation(
    provider: IProvider,
    address: ChainSpecificAddress,
    operation: ScheduledOperation,
  ): Promise<ContractValue> {
    const readyAt = await this.getReadyAt(provider, address, operation.id)
    const calls: ContractValue[] = []
    for (const call of operation.calls) {
      calls.push(await this.describeCall(provider, call))
    }
    return {
      id: operation.id,
      scheduledAtBlock: operation.scheduledAtBlock,
      delay: operation.delay,
      readyAt,
      ready: readyAt !== undefined && readyAt <= provider.timestamp,
      predecessor: operation.predecessor,
      calls,
    }
  }

  async getReadyAt(
    provider: IProvider,
    address: ChainSpecificAddress,
    id: string,
  ): Promise<number | undefined> {
    const result = await provider.callMethod<unknown>(
      address,
      abi.getFunction('getTimestamp'),
      [id],
    )
    const raw = Array.isArray(result) ? result[0] : result
    if (raw === undefined || raw === null) {
      return undefined
    }
    const timestamp = BigNumber.from(raw)
    // 0 means unset and 1 means done in TimelockController; neither should
    // appear for an operation that is still pending, but stay defensive.
    return timestamp.gt(1) ? timestamp.toNumber() : undefined
  }

  async describeCall(
    provider: IProvider,
    call: ScheduledCall,
  ): Promise<ContractValue> {
    const base: Record<string, ContractValue> = {
      target: call.target,
      value: call.value,
    }
    if (call.data === '0x') {
      return { ...base, function: '', inputs: {} }
    }
    try {
      const decoded = await this.decodeCalldata(provider, call)
      return { ...base, ...decoded }
    } catch {
      // Unverified target, failed source fetch or a selector that is not in
      // the ABI (e.g. an implementation added after scheduling) must not
      // fail the whole field. Keep the raw calldata so the entry stays
      // visible and the degradation shows up in the diff.
      return {
        ...base,
        function: call.data.slice(0, 10),
        inputs: { calldata: call.data },
        decodingFailed: true,
      }
    }
  }

  async decodeCalldata(
    provider: IProvider,
    call: ScheduledCall,
  ): Promise<{ function: string; inputs: Record<string, ContractValue> }> {
    const target = ChainSpecificAddress.fromLong(provider.chain, call.target)
    // The target's own ABI first; proxies only when that does not know the
    // selector, which spares the proxy detection round trips in the common case.
    const direct = tryParse((await provider.getSource(target)).abi, call.data)
    if (direct !== undefined) {
      return direct
    }
    const detected = await new ProxyDetector().detectProxy(provider, target)
    const implementations =
      detected !== undefined ? get$Implementations(detected.values) : []
    const sources = await Promise.all(
      implementations.map((a) => provider.getSource(a)),
    )
    const viaImplementation = tryParse(
      sources.flatMap((s) => s.abi),
      call.data,
    )
    if (viaImplementation !== undefined) {
      return viaImplementation
    }
    throw new Error('Selector not found in target or implementation ABI')
  }
}

function tryParse(
  entries: string[],
  calldata: string,
): { function: string; inputs: Record<string, ContractValue> } | undefined {
  const functions = unique(
    entries.filter((f) => f.startsWith('function')),
    (f) => getSighash(f),
  )
  if (functions.length === 0) {
    return undefined
  }
  const iface = new utils.Interface(functions)
  let tx: utils.TransactionDescription
  try {
    tx = iface.parseTransaction({ data: calldata })
  } catch {
    return undefined
  }
  const inputs: Record<string, ContractValue> = {}
  tx.functionFragment.inputs.forEach((input, i) => {
    const key = input.name === '' ? `arg${i}` : input.name
    inputs[key] = toContractValue(tx.args[i])
  })
  return { function: tx.functionFragment.name, inputs }
}
