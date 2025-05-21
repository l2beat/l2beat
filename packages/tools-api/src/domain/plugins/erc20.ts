import type { Address, Chain, TokenConfig } from '../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'
import type { NestedCall } from './types'

export function erc20Plugin(
  call: DecodedCall,
  to: Address | undefined,
  chain: Chain,
  tokens: TokenConfig,
): NestedCall[] | false {
  if (call.selector === '0xa9059cbb') {
    // transfer
    tokenAmount(call.arguments[1], to, chain, tokens)
    return []
  }
  if (call.selector === '0x23b872dd') {
    // transferFrom
    tokenAmount(call.arguments[2], to, chain, tokens)
    return []
  }
  if (call.selector === '0x095ea7b3') {
    // approve
    tokenAmount(call.arguments[1], to, chain, tokens)
    return []
  }
  return false
}

export function tokenAmount(
  value: Value | undefined,
  address: Address | undefined,
  chain: Chain,
  tokens: TokenConfig,
) {
  const token = address && tokens[address]
  const decimals = token?.decimals ?? 18 // We use 18 as the most common default
  const currency = token?.name ?? '???'

  if (value?.decoded?.type === 'number') {
    value.decoded = {
      type: 'amount',
      value: value.decoded.value,
      decimals,
      currency,
      currencyLink:
        address && `${chain.explorerUrl}/address/${address.split(':')[1]}`,
    }
  }
}
