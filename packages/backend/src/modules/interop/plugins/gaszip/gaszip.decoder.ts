/**
 * Gas.zip deposit calldata decoder
 *
 * Encoding reference:
 * - 0x01: Self deposit (no destination bytes) + chain IDs (2 bytes each)
 * - 0x02: EVM address (20 bytes) + chain IDs
 * - 0x03: Base58-type address bytes (commonly Solana 32 bytes) + chain IDs
 * - 0x04: MOVE/FUEL address (32 bytes) + chain IDs
 * - 0x05: XRP address bytes (Ripple base58 alphabet) + chain IDs
 * - 0x06: Initia bech32 ('init') bytes + chain IDs
 *
 * Chain IDs are encoded as 2-byte big-endian shorts at the end.
 */

import { Address32 } from '../types'

export type GasZipDepositType =
  | 'SELF'
  | 'EVM'
  | 'BASE58'
  | 'MOVE'
  | 'XRP'
  | 'INITIA'
  | 'UNKNOWN'

export interface GasZipDecodedDeposit {
  type: GasZipDepositType
  prefix: number
  destinationAddress?: Address32 // For EVM addresses (0x02)
  destinationChainIds: number[] // Gas.zip chain IDs
}

function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex
  if (h.length % 2 !== 0) throw new Error('Invalid hex length')
  const out = new Uint8Array(h.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(h.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

function bytesToHex(bytes: Uint8Array): `0x${string}` {
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`
}

function readU16BE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1]
}

function getFixedAddressLength(prefix: number): number | null {
  if (prefix === 0x01) return 0 // Self-deposit, no address
  if (prefix === 0x02) return 20 // EVM address
  if (prefix === 0x04) return 32 // MOVE/FUEL
  if (prefix === 0x06) return 20 // Initia bech32
  return null // Variable length (0x03, 0x05)
}

function getDepositType(prefix: number): GasZipDepositType {
  switch (prefix) {
    case 0x01:
      return 'SELF'
    case 0x02:
      return 'EVM'
    case 0x03:
      return 'BASE58'
    case 0x04:
      return 'MOVE'
    case 0x05:
      return 'XRP'
    case 0x06:
      return 'INITIA'
    default:
      return 'UNKNOWN'
  }
}

function splitAddressAndChains(
  prefix: number,
  body: Uint8Array,
): { addressBytes: Uint8Array; chainIds: number[] } {
  const fixedLen = getFixedAddressLength(prefix)

  // Fixed-length address types
  if (fixedLen !== null) {
    if (body.length < fixedLen) {
      throw new Error('Calldata too short for expected address length')
    }
    const addressBytes = body.slice(0, fixedLen)
    const tail = body.slice(fixedLen)
    if (tail.length % 2 !== 0) {
      throw new Error('Chain IDs tail must be a multiple of 2 bytes')
    }
    const chainIds: number[] = []
    for (let i = 0; i < tail.length; i += 2) {
      chainIds.push(readU16BE(tail, i))
    }
    return { addressBytes, chainIds }
  }

  // Special case for 0x03 (Base58): if 32 bytes (Solana-like) + 2-byte * n
  if (prefix === 0x03 && body.length >= 32 && (body.length - 32) % 2 === 0) {
    const addressBytes = body.slice(0, 32)
    const tail = body.slice(32)
    const chainIds: number[] = []
    for (let i = 0; i < tail.length; i += 2) {
      chainIds.push(readU16BE(tail, i))
    }
    return { addressBytes, chainIds }
  }

  // Variable-length (0x03 non-32, 0x05): parse from tail greedily
  let end = body.length
  const chainIdsRev: number[] = []
  while (end - 2 >= 1) {
    const val = readU16BE(body, end - 2)
    // Accept any 1..65535, stop greedily if already have chains
    if (chainIdsRev.length > 0 && val === 0) break
    chainIdsRev.push(val)
    end -= 2
  }
  const addressBytes = body.slice(0, end)
  chainIdsRev.reverse()
  return { addressBytes, chainIds: chainIdsRev }
}

export function decodeGasZipDeposit(input: string): GasZipDecodedDeposit {
  if (!input.startsWith('0x')) {
    input = `0x${input}`
  }

  const data = hexToBytes(input)
  if (data.length < 1) {
    throw new Error('Empty calldata')
  }

  const prefix = data[0]
  const body = data.slice(1)
  const type = getDepositType(prefix)

  const { addressBytes, chainIds } = splitAddressAndChains(prefix, body)

  const result: GasZipDecodedDeposit = {
    type,
    prefix,
    destinationChainIds: chainIds,
  }

  if (prefix === 0x02 && addressBytes.length === 20) {
    result.destinationAddress = Address32.from(bytesToHex(addressBytes))
  }

  return result
}
