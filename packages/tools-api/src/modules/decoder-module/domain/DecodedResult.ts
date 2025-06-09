import type { Address } from '../../../config/types'

export interface DecodedResult {
  transaction?: {
    hash: string
    explorerLink: string
  }
  data: Value
  to?: DecodedAddress
  chainId?: number
}

export interface Value {
  name: string
  abi: string
  encoded: `0x${string}`
  decoded: DecodedValue | undefined
}

export type DecodedValue =
  | DecodedNumber
  | DecodedAmount
  | DecodedBoolean
  | DecodedBytes
  | DecodedHash
  | DecodedString
  | DecodedAddress
  | DecodedCall
  | DecodedArray

export interface DecodedNumber {
  type: 'number'
  hint?: 'e6' | 'e8' | 'e18' | 'date' | 'seconds'
  value: string
}

export interface DecodedAmount {
  type: 'amount'
  value: string
  decimals: number
  currency: string
  currencyLink?: string
}

export interface DecodedBoolean {
  type: 'boolean'
  value: boolean
}

export interface DecodedBytes {
  type: 'bytes'
  dynamic: boolean
  value: `0x${string}`
  extra?: `0x${string}`
}

export interface DecodedHash {
  type: 'hash'
  value: string
  minusOne?: boolean
}

export interface DecodedString {
  type: 'string'
  value: string
  extra?: `0x${string}`
}

export interface DecodedAddress {
  type: 'address'
  value: Address
  explorerLink: string
  name?: string
  discovered?: boolean
}

export interface DecodedCall {
  type: 'call'
  selector: `0x${string}`
  abi: string
  interface?: string
  arguments: Value[]
  extra?: `0x${string}`
}

export interface DecodedArray {
  type: 'array'
  values: Value[]
  extra?: `0x${string}`
}
