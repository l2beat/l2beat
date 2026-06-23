import { assert } from '@l2beat/shared-pure'
import type { BaseTypeCaster } from './BaseTypeCaster'
import { Bytes32ToString } from './Bytes32ToString'
import { BytesToString } from './BytesToString'
import { CCIPCurseSubject } from './CCIPCurseSubject'
import { ChainPrefix } from './ChainPrefix'
import { FormatSeconds } from './FormatSeconds'
import { GreaterThan } from './GreaterThan'
import { Mapping } from './Mapping'
import { Ocr3OffchainConfig } from './Ocr3OffchainConfig'
import { SliceAddress } from './SliceAddress'
import { SliceBytes32 } from './SliceBytes32'
import { TimeSince } from './TimeSince'
import { Undecimal } from './Undecimal'

export const TypeConverters = {
  Bytes32ToString,
  BytesToString,
  CCIPCurseSubject,
  FormatSeconds,
  Undecimal,
  Mapping,
  ChainPrefix,
  GreaterThan,
  TimeSince,
  SliceAddress,
  SliceBytes32,
  Ocr3OffchainConfig,
}

export function isCustomTypeCaster(name: string): boolean {
  return name[0] === name[0]?.toUpperCase()
}

export function getCustomTypeCaster(name: string): BaseTypeCaster {
  assert(name in TypeConverters, `Type ${name} is not supported`)
  return TypeConverters[name as keyof typeof TypeConverters]
}
