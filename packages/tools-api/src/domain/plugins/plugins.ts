import type { DecodedCall, Value } from '../DecodedResult'
import { erc20Plugin } from './erc20'
import type { NestedCall, Plugin } from './types'

export const plugins: Plugin[] = [erc20Plugin, defaultPlugin]

function defaultPlugin(call: DecodedCall): NestedCall[] {
  return call.arguments.flatMap(getNestedBytes)
}

function getNestedBytes(value: Value): NestedCall[] {
  const nested: NestedCall[] = []
  if (value.decoded?.type === 'array') {
    for (const v of value.decoded.values) {
      nested.push(...getNestedBytes(v))
    }
  }
  if (value.decoded?.type === 'call') {
    for (const v of value.decoded.arguments) {
      nested.push(...getNestedBytes(v))
    }
  }
  if (value.decoded?.type === 'bytes' && value.decoded.dynamic) {
    nested.push({ data: value })
  }
  return nested
}
