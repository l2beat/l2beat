import { assert } from '@l2beat/shared-pure'
import type { BaseTypeCaster } from './BaseTypeCaster.js'
import { Bytes32ToString } from './Bytes32ToString.js'
import { ChainPrefix } from './ChainPrefix.js'
import { FormatSeconds } from './FormatSeconds.js'
import { GreaterThan } from './GreaterThan.js'
import { Mapping } from './Mapping.js'
import { TimeSince } from './TimeSince.js'
import { Undecimal } from './Undecimal.js'

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
