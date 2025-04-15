import type { Address } from '../logic/types'
import tokens from './tokenList.json'

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
      name: '??? ' + address.split(':')[1].slice(0, 10),
      decimals: 0,
    }
  )
}
