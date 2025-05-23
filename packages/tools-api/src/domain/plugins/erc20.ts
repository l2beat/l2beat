import { toFunctionSelector } from 'viem'
import type { Address, Chain, TokenConfig } from '../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'
import type { NestedCall } from './types'

const selectors = {
  transfer: toFunctionSelector('function transfer(address, uint256)'),
  transferFrom: toFunctionSelector(
    'function transferFrom(address, address, uint256)',
  ),
  approve: toFunctionSelector('function approve(address, uint256)'),
  increaseAllowance: toFunctionSelector(
    'function increaseAllowance(address, uint256)',
  ),
  decreaseAllowance: toFunctionSelector(
    'function decreaseAllowance(address, uint256)',
  ),
  burn1: toFunctionSelector('function burn(uint256)'),
  burn2: toFunctionSelector('function burn(address, uint256)'),
  burnFrom: toFunctionSelector('function burnFrom(address, uint256)'),
  mint1: toFunctionSelector('function mint(uint256)'),
  mint2: toFunctionSelector('function mint(address, uint256)'),
  mintFrom: toFunctionSelector('function mintFrom(address, uint256)'),
}

export function erc20Plugin(
  call: DecodedCall,
  chain: Chain,
  to: Address | undefined,
  tokens: TokenConfig,
): NestedCall[] | false {
  if (
    call.selector === selectors.transfer ||
    call.selector === selectors.approve ||
    call.selector === selectors.increaseAllowance ||
    call.selector === selectors.decreaseAllowance ||
    call.selector === selectors.burn2 ||
    call.selector === selectors.burnFrom ||
    call.selector === selectors.mint2 ||
    call.selector === selectors.mintFrom
  ) {
    tokenAmount(call.arguments[1], to, chain, tokens)
    return []
  }
  if (call.selector === selectors.transferFrom) {
    tokenAmount(call.arguments[2], to, chain, tokens)
    return []
  }
  if (call.selector === selectors.burn1 || call.selector === selectors.mint1) {
    tokenAmount(call.arguments[0], to, chain, tokens)
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
