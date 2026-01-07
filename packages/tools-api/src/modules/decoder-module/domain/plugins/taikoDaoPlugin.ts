import { toFunctionSelector } from 'viem'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall } from '../DecodedResult'
import { toResultValue } from '../decode'
import { type AbiValue, decodeType } from '../encoding'
import type { NestedCall } from './types'

const selectors = {
  execute: toFunctionSelector('function execute(bytes _actions)'),
}

export function taikoDaoPlugin(
  call: DecodedCall,
  chain: Chain,
  _to: Address | undefined,
  _tokens: TokenConfig,
): NestedCall[] | false {
  if (call.selector !== selectors.execute) {
    return false
  }

  const actions = call.arguments[0]
  if (actions?.decoded?.type !== 'bytes') {
    return false
  }

  let decoded: AbiValue
  try {
    decoded = decodeType(
      '((address target, uint256 value, bytes data)[])',
      actions.decoded.value,
    )
  } catch {
    return false
  }

  const result = toResultValue(decoded, chain)
  const outer = result.decoded
  if (outer?.type !== 'array') {
    return false
  }

  const inner = outer.values[0]
  if (inner?.decoded?.type !== 'array') {
    return false
  }

  const actionsArray = inner.decoded

  const calls: NestedCall[] = []
  for (const action of actionsArray.values) {
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

  actions.decoded = actionsArray
  actions.abi = inner.abi ?? result.abi

  return calls
}
