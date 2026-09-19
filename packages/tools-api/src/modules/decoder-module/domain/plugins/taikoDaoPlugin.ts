import { toFunctionSelector } from 'viem'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall } from '../DecodedResult'
import { decodeTaikoActions } from './taikoActions'
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

  const result = decodeTaikoActions(actions.decoded.value, chain)
  if (!result) {
    return false
  }

  actions.decoded = result.decoded
  actions.abi = result.abi

  return result.calls
}
