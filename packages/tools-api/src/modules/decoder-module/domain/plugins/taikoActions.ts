import type { Chain } from '../../../../config/types'
import type { DecodedArray, Value } from '../DecodedResult'
import { toResultValue } from '../decode'
import { type AbiValue, decodeType } from '../encoding'
import type { NestedCall } from './types'

export const TAIKO_ACTIONS_ABI = '(address target, uint256 value, bytes data)[]'

export interface TaikoActions {
  abi: string
  decoded: DecodedArray
  calls: NestedCall[]
}

/**
 * Decodes `abi.encode(Action[])` as used by the Taiko DAO controllers
 * (`Controller._executeActions`), where
 * `struct Action { address target; uint256 value; bytes data; }`.
 */
export function decodeTaikoActions(
  encoded: `0x${string}`,
  chain: Chain,
): TaikoActions | undefined {
  let decoded: AbiValue
  try {
    decoded = decodeType(`(${TAIKO_ACTIONS_ABI})`, encoded)
  } catch {
    return undefined
  }

  const result = toResultValue(decoded, chain)
  const outer = result.decoded
  if (outer?.type !== 'array') {
    return undefined
  }

  const inner = outer.values[0]
  if (inner?.decoded?.type !== 'array') {
    return undefined
  }

  const calls: NestedCall[] = []
  for (const action of inner.decoded.values) {
    if (action.decoded?.type !== 'array') {
      continue
    }
    const target = action.decoded.values[0]
    const value = action.decoded.values[1]
    const data = action.decoded.values[2]

    if (value?.decoded?.type === 'number') {
      value.decoded = {
        type: 'amount',
        value: value.decoded.value,
        decimals: chain.nativeCurrency.decimals,
        currency: chain.nativeCurrency.symbol,
      }
    }

    if (
      target?.decoded?.type !== 'address' ||
      data?.decoded?.type !== 'bytes'
    ) {
      continue
    }

    calls.push({ to: target.decoded.value, data })
  }

  return { abi: inner.abi ?? result.abi, decoded: inner.decoded, calls }
}

export function toActionsValue(
  name: string,
  encoded: `0x${string}`,
  actions: TaikoActions,
): Value {
  return { name, abi: actions.abi, encoded, decoded: actions.decoded }
}
