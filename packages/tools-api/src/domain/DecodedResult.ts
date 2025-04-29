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
  encoded: string
  decoded: DecodedValue | undefined
}

export type DecodedValue =
  | DecodedNumber
  | DecodedAmount
  | DecodedBoolean
  | DecodedBytes
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
  currencyLink: string
}

export interface DecodedBoolean {
  type: 'boolean'
  value: boolean
}

export interface DecodedBytes {
  type: 'bytes'
  value: string
}

export interface DecodedString {
  type: 'string'
  value: string
}

export interface DecodedAddress {
  type: 'address'
  value: string
  explorerLink: string
  name?: string
  discovered?: boolean
}

export interface DecodedCall {
  type: 'call'
  selector: string
  abi: string
  interface?: string
  arguments: Value[]
}

export interface DecodedArray {
  type: 'array'
  values: Value[]
}
