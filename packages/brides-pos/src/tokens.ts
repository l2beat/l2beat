import tokens from './tokenList.json'
import type { Address } from './types'

export interface Token {
  address: Address
  name: string
  decimals: number
}

const tokenMap = new Map<string, Token>(
  tokens.map((t) => [t.address, t as Token]),
)

export function getToken(address: Address) {
  return (
    tokenMap.get(address) ?? {
      address,
      name: address,
      decimals: 0,
    }
  )
}
