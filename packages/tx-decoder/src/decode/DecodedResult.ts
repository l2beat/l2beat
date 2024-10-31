export type DecodedResult = DecodedFunction | DecodedParameters | DecodedError

export interface DecodedFunction {
  type: 'function'
  name: string
  selector: `0x${string}`
  values: Value[]
}

export interface DecodedParameters {
  type: 'parameters'
  abi: string
  values: Value[]
}

export interface DecodedError {
  type: 'error'
  error: string
}

export interface Value {
  stack: string[]
  type: string
  value: string | boolean | bigint | Value[]
}
