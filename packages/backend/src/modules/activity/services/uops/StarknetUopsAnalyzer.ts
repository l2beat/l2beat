import { assert, type Block, type Transaction } from '@l2beat/shared-pure'
import isArray from 'lodash/isArray'
import sum from 'lodash/sum'
import type { UopsAnalyzer } from './types'

export class StarknetUopsAnalyzer implements UopsAnalyzer {
  calculateUops(block: Block) {
    const uops = block.transactions.reduce(
      (acc, tx) => acc + this.getOperationsCount(tx, block.number),
      0,
    )

    return uops
  }

  getOperationsCount(tx: Transaction, blockNumber: number): number {
    assert(
      tx.data === undefined || isArray(tx.data),
      `Starknet tx should have calldata as array: ${tx.hash}`,
    )
    // Starknet has different execute signatures over time:
    //	- up to block 2999 it's a single-call only, calldata is pointing directly to a contract so we count it as 1
    //	- since block 3000 up to 299 999 it's a multi-call with signature  __execute__(call_array_len, call_array, calldata_len, calldata, nonce)
    //		so the first element can be interpreted as number of operations
    //	- since block 300 000 it's a different signature __execute__(calls) but still first argument reflects overall number of operations
    if (blockNumber < 3000 || tx.type !== 'INVOKE' || !tx.data) {
      return 1
    }

    const calls = decodeExecuteCalldata(tx.data.map(BigInt))
    if (!calls) {
      // Cairo 0 accounts (call_array layout) predate outside execution and
      // paymaster forwarders, so their call count is all there is to count.
      return Number(tx.data[0])
    }
    return sum(calls.map(countUserOperations))
  }
}

// Like the EVM analyzer with ERC-4337 and Safe, a call that only carries other
// calls signed by a user is replaced by those calls, recursively.
function countUserOperations(call: Call): number {
  const wrapped = unwrapCalls(call)
  return wrapped ? sum(wrapped.map(countUserOperations)) : 1
}

function unwrapCalls(call: Call): Call[] | undefined {
  const callsOffset = OUTSIDE_EXECUTION_CALLS_OFFSET.get(call.selector)
  if (callsOffset !== undefined) {
    return decodeOutsideExecution(call.calldata, callsOffset)
  }
  if (AVNU_FORWARDERS.has(call.to)) {
    return FORWARDER_METHODS.get(call.selector)?.(call.calldata)
  }
  return undefined
}

interface Call {
  to: bigint
  selector: bigint
  calldata: bigint[]
}

// SNIP-9: execute_from_outside*(OutsideExecution{caller, nonce, execute_after,
// execute_before, calls}, signature). v3 makes the nonce a (channel, nonce)
// pair, which moves `calls` one felt further.
const OUTSIDE_EXECUTION_CALLS_OFFSET = new Map<bigint, number>([
  // execute_from_outside
  [0x7ec457cd7ed1630225a8328f826a29a327b19486f6b2882b4176545ebdbe3dn, 4],
  // execute_from_outside_v2
  [0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57dn, 4],
  // execute_from_outside_v3
  [0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3n, 5],
])

// AVNU paymaster forwarders. They are matched by address, not selector,
// because `execute` is too common a name to mean "forward" elsewhere.
const AVNU_FORWARDERS = new Set<bigint>([
  0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584fn,
  0x1a2dd5e7bb06e9eb249a51df0f0b1ee470671d8d0f3edf6b48a3941569ae30an,
])

// gas_token_address, gas_amount: u256
const GAS_FEE_FELTS = 3

const FORWARDER_METHODS = new Map<
  bigint,
  (calldata: bigint[]) => Call[] | undefined
>([
  // execute(account_address, entrypoint, calldata, gas_token_address, gas_amount: u256)
  [
    0x240060cdb34fcc260f41eac7474ee1d7c80b7e3607daff9ac67c7ea2ebb1c44n,
    (calldata) => {
      const forwarded = readSpan(calldata, 2)
      if (!forwarded || forwarded.end + GAS_FEE_FELTS !== calldata.length)
        return undefined
      return [
        { to: calldata[0], selector: calldata[1], calldata: forwarded.items },
      ]
    },
  ],
  // execute_sponsored(account_address, entrypoint, calldata, sponsor_metadata)
  [
    0x3d82f059acd7c22528fe93d2cd7c941d47411bf7c5525efe7f71eedebd62647n,
    (calldata) => {
      const forwarded = readSpan(calldata, 2)
      const metadata = forwarded && readSpan(calldata, forwarded.end)
      if (!forwarded || metadata?.end !== calldata.length) return undefined
      return [
        { to: calldata[0], selector: calldata[1], calldata: forwarded.items },
      ]
    },
  ],
  // execute_private(calls, gas_token_address, gas_amount: u256)
  [
    0x3d12429a99cf929b6c8fb32754218a978555693fe4cd3ce030ff1106b0fe1een,
    (calldata) => {
      const calls = readCalls(calldata, 0)
      if (!calls || calls.end + GAS_FEE_FELTS !== calldata.length)
        return undefined
      return calls.items
    },
  ],
  // execute_private_sponsored(calls, gas_token_address, gas_amount: u256, sponsor_metadata)
  [
    0x3bd4b5033e788e9cc450fefa99ea20e3bed0fa358c8b280c0488f0c4647472en,
    (calldata) => {
      const calls = readCalls(calldata, 0)
      const metadata = calls && readSpan(calldata, calls.end + GAS_FEE_FELTS)
      if (!calls || metadata?.end !== calldata.length) return undefined
      return calls.items
    },
  ],
])

// Cairo 1 accounts: __execute__(calls: Array<Call>)
function decodeExecuteCalldata(felts: bigint[]): Call[] | undefined {
  const calls = readCalls(felts, 0)
  return calls?.end === felts.length ? calls.items : undefined
}

// A contract can expose an execute_from_outside* selector with its own layout,
// so anything that is not exactly an OutsideExecution and a signature counts as
// one opaque call.
function decodeOutsideExecution(
  calldata: bigint[],
  callsOffset: number,
): Call[] | undefined {
  const calls = readCalls(calldata, callsOffset)
  const signature = calls && readSpan(calldata, calls.end)
  return signature?.end === calldata.length ? calls?.items : undefined
}

// Span<Call>: length, then (to, selector, calldata: Span<felt252>) per call
function readCalls(
  felts: bigint[],
  start: number,
): { items: Call[]; end: number } | undefined {
  const count = felts[start]
  const minFeltsPerCall = 3n
  if (count === undefined || count * minFeltsPerCall > felts.length - start) {
    return undefined
  }

  const items: Call[] = []
  let position = start + 1
  for (let i = 0; i < count; i++) {
    const calldata = readSpan(felts, position + 2)
    if (!calldata) return undefined
    items.push({
      to: felts[position],
      selector: felts[position + 1],
      calldata: calldata.items,
    })
    position = calldata.end
  }
  return { items, end: position }
}

function readSpan(
  felts: bigint[],
  start: number,
): { items: bigint[]; end: number } | undefined {
  const length = felts[start]
  if (length === undefined || length > felts.length - start - 1) {
    return undefined
  }
  const end = start + 1 + Number(length)
  return { items: felts.slice(start + 1, end), end }
}
