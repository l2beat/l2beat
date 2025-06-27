import { toFunctionSelector } from 'viem'
import { addressSwitchChain } from '../../../../config/address'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall } from '../DecodedResult'
import type { NestedCall } from './types'

const selectors = {
  sendTxToL1: toFunctionSelector(
    'function sendTxToL1(address to, bytes calldata)',
  ),
}

export function sendTxToL1Plugin(
  call: DecodedCall,
  _chain: Chain,
  _to: Address | undefined,
  _tokens: TokenConfig,
  chains: Chain[],
): NestedCall[] | false {
  if (call.selector !== selectors.sendTxToL1) {
    return false
  }

  const to = call.arguments[0]
  const calldata = call.arguments[1]
  if (to?.decoded?.type !== 'address' || calldata?.decoded?.type !== 'bytes') {
    return false
  }

  const calls: NestedCall[] = []

  // TODO(radomski): Since we don't support L3s for now we can assume that all
  // calls made to L1 are to Ethereum.
  const chain = chains.find((x) => x.shortName === 'eth')
  if (!chain) {
    return false
  }

  const l1Address = addressSwitchChain(to.decoded.value, chain)
  to.decoded.value = l1Address
  calls.push({
    to: l1Address,
    data: calldata,
  })

  return calls
}
