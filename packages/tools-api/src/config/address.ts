import type { Address, Chain } from './types'

export function addressSwitchChain(address: Address, chain: Chain): Address {
  const [_, noprefix] = decodeAddress(address)
  return `${chain.shortName}:${noprefix}`
}

export function decodeAddress(address: Address): [string, `0x${string}`] {
  const [shortChainName, noprefix] = address.split(':') as [
    string,
    `0x${string}`,
  ]
  return [shortChainName, noprefix]
}

export function getShortChainName(address: Address): string {
  const [shortChainName] = decodeAddress(address)
  return shortChainName
}
