import { assert } from '@l2beat/shared-pure'
import { BaseTypeCaster } from './BaseTypeCaster'
import { ChainPrefix } from './ChainPrefix'
import { FormatSeconds } from './FormatSeconds'
import { GreaterThan } from './GreaterThan'
import { Mapping } from './Mapping'
import { Undecimal } from './Undecimal'

export const TypeConverters = {
  FormatSeconds,
  Undecimal,
  Mapping,
  ChainPrefix,
  GreaterThan,
}

export function isCustomTypeCaster(name: string): boolean {
  return name[0] === name[0]?.toUpperCase()
}

export function getCustomTypeCaster(name: string): BaseTypeCaster {
  assert(name in TypeConverters, `Type ${name} is not supported`)
  return TypeConverters[name as keyof typeof TypeConverters]
}
