/**
 * Minimal Substrate storage primitives: twox ("xxhash64") storage-key hashing
 * and SCALE compact decoding. Storage keys are built as
 * twox128(pallet) ++ twox128(item) ++ hasher(encoded map key) and values come
 * back SCALE-encoded, which is why plain JSON-RPC alone is not enough.
 */

const P1 = 0x9e3779b185ebca87n
const P2 = 0xc2b2ae3d27d4eb4fn
const P3 = 0x165667b19e3779f9n
const P4 = 0x85ebca77c2b2ae63n
const P5 = 0x27d4eb2f165667c5n
const MASK = (1n << 64n) - 1n

function rotl(value: bigint, bits: bigint): bigint {
  return ((value << bits) | (value >> (64n - bits))) & MASK
}

function round(acc: bigint, input: bigint): bigint {
  return (rotl((acc + input * P2) & MASK, 31n) * P1) & MASK
}

function mergeRound(acc: bigint, value: bigint): bigint {
  return ((acc ^ round(0n, value)) * P1 + P4) & MASK
}

function readU64(data: Uint8Array, offset: number): bigint {
  let value = 0n
  for (let i = 7; i >= 0; i--) {
    value = (value << 8n) | BigInt(data[offset + i])
  }
  return value
}

function readU32(data: Uint8Array, offset: number): bigint {
  let value = 0n
  for (let i = 3; i >= 0; i--) {
    value = (value << 8n) | BigInt(data[offset + i])
  }
  return value
}

export function xxhash64(data: Uint8Array, seed: bigint): bigint {
  const len = data.length
  let h: bigint
  let i = 0

  if (len >= 32) {
    let v1 = (seed + P1 + P2) & MASK
    let v2 = (seed + P2) & MASK
    let v3 = seed & MASK
    let v4 = (seed - P1) & MASK
    for (; i + 32 <= len; i += 32) {
      v1 = round(v1, readU64(data, i))
      v2 = round(v2, readU64(data, i + 8))
      v3 = round(v3, readU64(data, i + 16))
      v4 = round(v4, readU64(data, i + 24))
    }
    h = (rotl(v1, 1n) + rotl(v2, 7n) + rotl(v3, 12n) + rotl(v4, 18n)) & MASK
    h = mergeRound(h, v1)
    h = mergeRound(h, v2)
    h = mergeRound(h, v3)
    h = mergeRound(h, v4)
  } else {
    h = (seed + P5) & MASK
  }

  h = (h + BigInt(len)) & MASK
  for (; i + 8 <= len; i += 8) {
    h = (rotl(h ^ round(0n, readU64(data, i)), 27n) * P1 + P4) & MASK
  }
  if (i + 4 <= len) {
    h = (rotl(h ^ ((readU32(data, i) * P1) & MASK), 23n) * P2 + P3) & MASK
    i += 4
  }
  for (; i < len; i++) {
    h = (rotl(h ^ ((BigInt(data[i]) * P5) & MASK), 11n) * P1) & MASK
  }

  h ^= h >> 33n
  h = (h * P2) & MASK
  h ^= h >> 29n
  h = (h * P3) & MASK
  h ^= h >> 32n
  return h
}

function u64ToLeBytes(value: bigint): Uint8Array {
  const bytes = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    bytes[i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
  return bytes
}

/** Substrate's Twox128 hasher: two seeded xxhash64 runs, little-endian. */
export function twox128(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(16)
  result.set(u64ToLeBytes(xxhash64(data, 0n)), 0)
  result.set(u64ToLeBytes(xxhash64(data, 1n)), 8)
  return result
}

/** Substrate's Twox64Concat hasher: xxhash64 of the key followed by the key. */
export function twox64Concat(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(8 + data.length)
  result.set(u64ToLeBytes(xxhash64(data, 0n)), 0)
  result.set(data, 8)
  return result
}

/**
 * Decodes a SCALE compact-encoded integer.
 * Returns the value and the offset just past it.
 */
export function decodeCompact(
  data: Uint8Array,
  offset: number,
): { value: bigint; offset: number } {
  const first = data[offset]
  const mode = first & 0b11
  if (mode === 0b00) {
    return { value: BigInt(first >> 2), offset: offset + 1 }
  }
  if (mode === 0b01) {
    const raw = first | (data[offset + 1] << 8)
    return { value: BigInt(raw >> 2), offset: offset + 2 }
  }
  if (mode === 0b10) {
    const raw = readU32(data, offset)
    return { value: raw >> 2n, offset: offset + 4 }
  }
  const byteLength = (first >> 2) + 4
  let value = 0n
  for (let i = byteLength - 1; i >= 0; i--) {
    value = (value << 8n) | BigInt(data[offset + 1 + i])
  }
  return { value, offset: offset + 1 + byteLength }
}

export function decodeU32Le(data: Uint8Array, offset: number): number {
  return Number(readU32(data, offset))
}

export function encodeU32Le(value: number): Uint8Array {
  const bytes = new Uint8Array(4)
  for (let i = 0; i < 4; i++) {
    bytes[i] = (value >>> (i * 8)) & 0xff
  }
  return bytes
}

export function hexToBytes(hex: string): Uint8Array {
  const stripped = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes = new Uint8Array(stripped.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(stripped.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export function bytesToHex(bytes: Uint8Array): string {
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`
}
