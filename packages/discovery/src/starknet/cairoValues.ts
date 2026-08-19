// Decoder from Starknet serde felt arrays to ContractValues, driven by the
// Cairo type paths found in a Sierra ABI. Decoding is best-effort: anything we
// cannot faithfully interpret raises CairoDecodeError and the caller falls
// back to exposing the raw felts.

import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../discovery/output/types'
import type { SierraAbi } from './sierraAbi'

export class CairoDecodeError extends Error {}

export class FeltReader {
  private position = 0

  constructor(private readonly felts: string[]) {}

  read(): bigint {
    const felt = this.felts[this.position]
    if (felt === undefined) {
      throw new CairoDecodeError('Out of felts')
    }
    this.position += 1
    return BigInt(felt)
  }

  remaining(): number {
    return this.felts.length - this.position
  }
}

export function decodeFunctionResult(
  felts: string[],
  outputs: { type: string }[],
  abi: SierraAbi,
): ContractValue {
  try {
    const reader = new FeltReader(felts)
    const values = outputs.map((o) => decodeCairoType(reader, o.type, abi))
    if (reader.remaining() > 0) {
      throw new CairoDecodeError('Trailing felts after decoding')
    }
    const single = values.length === 1 ? values[0] : values
    if (single === undefined) {
      throw new CairoDecodeError('Empty result')
    }
    return single
  } catch (error) {
    if (error instanceof CairoDecodeError) {
      return { $rawFelts: felts }
    }
    throw error
  }
}

export function decodeCairoType(
  reader: FeltReader,
  type: string,
  abi: SierraAbi,
): ContractValue {
  const bare = type.startsWith('@') ? type.slice(1) : type

  switch (bare) {
    case 'core::felt252':
    case 'core::bytes_31::bytes31':
    case 'felt': // Cairo 0 (legacy) ABIs
      return feltToDisplay(reader.read())
    case 'core::starknet::contract_address::ContractAddress':
      return ChainSpecificAddress.from('strk', toHex(reader.read())).toString()
    case 'core::starknet::class_hash::ClassHash':
      return toPaddedHex(reader.read(), 64)
    case 'core::starknet::eth_address::EthAddress':
      // A checksummed eth: address, so the UI links it to Etherscan. The
      // starknet engine never crawls non-strk relatives.
      return ChainSpecificAddress.from(
        'eth',
        EthereumAddress(toPaddedHex(reader.read(), 40)),
      ).toString()
    case 'core::integer::u8':
    case 'core::integer::u16':
    case 'core::integer::u32':
    case 'core::integer::u64':
    case 'core::integer::u128':
    case 'core::integer::usize':
      return toNumberOrString(reader.read())
    case 'core::integer::u256': {
      const low = reader.read()
      const high = reader.read()
      return toNumberOrString(low + (high << 128n))
    }
    case 'core::bool':
      return reader.read() !== 0n
    case 'core::byte_array::ByteArray':
      return decodeByteArray(reader)
    case '()':
      return {}
  }

  if (bare.startsWith('(') && bare.endsWith(')')) {
    return splitTypeList(bare.slice(1, -1)).map((t) =>
      decodeCairoType(reader, t, abi),
    )
  }

  const generic = parseGenericType(bare)
  if (generic) {
    const { base, args } = generic
    if (base === 'core::array::Array' || base === 'core::array::Span') {
      const length = reader.read()
      const result: ContractValue[] = []
      for (let i = 0n; i < length; i++) {
        result.push(decodeCairoType(reader, mustFirst(args), abi))
      }
      return result
    }
    if (base === 'core::option::Option') {
      const variant = reader.read()
      if (variant === 0n) {
        return decodeCairoType(reader, mustFirst(args), abi)
      }
      return 'None'
    }
    if (base === 'core::zeroable::NonZero') {
      return decodeCairoType(reader, mustFirst(args), abi)
    }
    if (base === 'core::result::Result') {
      const variant = reader.read()
      const inner = decodeCairoType(
        reader,
        variant === 0n ? mustFirst(args) : mustSecond(args),
        abi,
      )
      return { [variant === 0n ? 'Ok' : 'Err']: inner }
    }
  }

  const struct = abi.structs.get(bare)
  if (struct) {
    const result: Record<string, ContractValue> = {}
    for (const member of struct) {
      result[member.name] = decodeCairoType(reader, member.type, abi)
    }
    return result
  }

  const variants = abi.enums.get(bare)
  if (variants) {
    const index = Number(reader.read())
    const variant = variants[index]
    if (!variant) {
      throw new CairoDecodeError(
        `Enum ${bare}: variant index ${index} out of range`,
      )
    }
    if (variant.type === '()') {
      return variant.name
    }
    return { [variant.name]: decodeCairoType(reader, variant.type, abi) }
  }

  throw new CairoDecodeError(`Unknown Cairo type: ${type}`)
}

// ByteArray = { data: Array<bytes31>, pending_word: felt252, pending_word_len: u32 }
function decodeByteArray(reader: FeltReader): string {
  const chunks: Buffer[] = []
  const dataLength = reader.read()
  for (let i = 0n; i < dataLength; i++) {
    chunks.push(feltToBytes(reader.read(), 31))
  }
  const pendingWord = reader.read()
  const pendingLength = Number(reader.read())
  if (pendingLength > 0) {
    chunks.push(feltToBytes(pendingWord, pendingLength))
  }
  return Buffer.concat(chunks).toString('utf8')
}

function feltToBytes(felt: bigint, length: number): Buffer {
  return Buffer.from(felt.toString(16).padStart(length * 2, '0'), 'hex')
}

function toHex(value: bigint): string {
  return `0x${value.toString(16)}`
}

/**
 * felt252 values are often Cairo short strings (e.g. version tags like '2.0').
 * When every byte is printable ASCII the string is shown; hashes and keys
 * practically never consist of printable bytes only, so collisions are rare.
 */
function feltToDisplay(value: bigint): string {
  if (value > 0n) {
    let hex = value.toString(16)
    if (hex.length % 2 === 1) {
      hex = `0${hex}`
    }
    const bytes = Buffer.from(hex, 'hex')
    const printable = [...bytes].every((b) => b >= 0x20 && b <= 0x7e)
    if (bytes.length >= 2 && printable) {
      return `'${bytes.toString('utf8')}'`
    }
  }
  return toHex(value)
}

function toPaddedHex(value: bigint, hexChars: number): string {
  return `0x${value.toString(16).padStart(hexChars, '0')}`
}

function toNumberOrString(value: bigint): number | string {
  if (value <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(value)
  }
  return value.toString(10)
}

export function parseGenericType(
  type: string,
): { base: string; args: string[] } | undefined {
  const open = type.indexOf('::<')
  if (open === -1 || !type.endsWith('>')) {
    return undefined
  }
  const base = type.slice(0, open)
  const args = splitTypeList(type.slice(open + 3, -1))
  return { base, args }
}

/** Splits 'a, (b, c), d::<e, f>' into top-level components */
function splitTypeList(list: string): string[] {
  const result: string[] = []
  let depth = 0
  let current = ''
  for (const char of list) {
    if (char === '<' || char === '(') depth++
    if (char === '>' || char === ')') depth--
    if (char === ',' && depth === 0) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim() !== '') {
    result.push(current.trim())
  }
  return result
}

function mustFirst(args: string[]): string {
  const first = args[0]
  if (first === undefined) {
    throw new CairoDecodeError('Missing generic argument')
  }
  return first
}

function mustSecond(args: string[]): string {
  const second = args[1]
  if (second === undefined) {
    throw new CairoDecodeError('Missing second generic argument')
  }
  return second
}
