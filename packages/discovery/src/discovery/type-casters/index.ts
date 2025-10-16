import { assert } from '@l2beat/shared-pure'
import type { BaseTypeCaster } from './BaseTypeCaster'
import { Bytes32ToString } from './Bytes32ToString'
import { ChainPrefix } from './ChainPrefix'
import { FormatSeconds } from './FormatSeconds'
import { GreaterThan } from './GreaterThan'
import { Mapping } from './Mapping'
import { TimeSince } from './TimeSince'
import { Undecimal } from './Undecimal'

export const TypeConverters = {
  Bytes32ToString,
  FormatSeconds,
  Undecimal,
  Mapping,
  ChainPrefix,
  GreaterThan,
  TimeSince,
}

export function isCustomTypeCaster(name: string): boolean {
  return name[0] === name[0]?.toUpperCase()
}

export function getCustomTypeCaster(name: string): BaseTypeCaster {
  assert(name in TypeConverters, `Type ${name} is not supported`)
  return TypeConverters[name as keyof typeof TypeConverters]
}
