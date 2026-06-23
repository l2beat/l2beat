import { assert } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

// Decodes the libOCR OCR3 `OffchainConfig` protobuf (as stored in CCIPHome /
// OCR contracts) into a named object. Field numbers/names/types are taken from
// libocr offchainreporting3_offchain_config.pb.go. The `reportingPluginConfig`
// bytes hold the plugin-specific config (JSON for CCIP) and are parsed when they
// are valid JSON. Returns the original hex string if the input is not decodable.

type FieldKind =
  | 'uint' // varint -> number (or decimal string if > 2^53)
  | 'packedUint' // packed repeated varint -> number[]
  | 'bytesHex' // length-delimited bytes -> 0x-hex
  | 'string' // length-delimited bytes -> utf8 string
  | 'json' // length-delimited bytes -> parsed JSON (utf8 fallback)
  | 'message' // length-delimited bytes -> nested message

interface FieldSpec {
  name: string
  kind: FieldKind
  repeated?: boolean
  message?: Record<number, FieldSpec>
}

const SHARED_SECRET_ENCRYPTIONS: Record<number, FieldSpec> = {
  1: { name: 'diffieHellmanPoint', kind: 'bytesHex' },
  2: { name: 'sharedSecretHash', kind: 'bytesHex' },
  3: { name: 'encryptions', kind: 'bytesHex', repeated: true },
}

const OFFCHAIN_CONFIG: Record<number, FieldSpec> = {
  25: { name: 'deltaProgressNanoseconds', kind: 'uint' },
  26: { name: 'deltaResendNanoseconds', kind: 'uint' },
  40: { name: 'deltaInitialNanoseconds', kind: 'uint' },
  27: { name: 'deltaRoundNanoseconds', kind: 'uint' },
  28: { name: 'deltaGraceNanoseconds', kind: 'uint' },
  41: { name: 'deltaCertifiedCommitRequestNanoseconds', kind: 'uint' },
  29: { name: 'deltaStageNanoseconds', kind: 'uint' },
  30: { name: 'rMax', kind: 'uint' },
  31: { name: 's', kind: 'packedUint' },
  32: { name: 'offchainPublicKeys', kind: 'bytesHex', repeated: true },
  33: { name: 'peerIds', kind: 'string', repeated: true },
  34: { name: 'reportingPluginConfig', kind: 'json' },
  42: { name: 'maxDurationInitializationNanoseconds', kind: 'uint' },
  35: { name: 'maxDurationQueryNanoseconds', kind: 'uint' },
  36: { name: 'maxDurationObservationNanoseconds', kind: 'uint' },
  37: {
    name: 'maxDurationShouldAcceptAttestedReportNanoseconds',
    kind: 'uint',
  },
  38: {
    name: 'maxDurationShouldTransmitAcceptedReportNanoseconds',
    kind: 'uint',
  },
  39: {
    name: 'sharedSecretEncryptions',
    kind: 'message',
    message: SHARED_SECRET_ENCRYPTIONS,
  },
}

function readVarint(b: Uint8Array, i: number): [bigint, number] {
  let shift = 0n
  let result = 0n
  while (true) {
    assert(i < b.length, 'protobuf: varint overrun')
    const byte = b[i] as number
    result |= BigInt(byte & 0x7f) << shift
    i++
    if ((byte & 0x80) === 0) break
    shift += 7n
  }
  return [result, i]
}

function uintToValue(v: bigint): ContractValue {
  return v <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(v) : v.toString()
}

function toHex(b: Uint8Array): string {
  let hex = '0x'
  for (const byte of b) hex += byte.toString(16).padStart(2, '0')
  return hex
}

function decodeMessage(
  b: Uint8Array,
  spec: Record<number, FieldSpec>,
): { [key: string]: ContractValue | undefined } {
  const out: { [key: string]: ContractValue | undefined } = {}
  const push = (fs: FieldSpec, value: ContractValue) => {
    if (fs.repeated) {
      const arr = (out[fs.name] as ContractValue[] | undefined) ?? []
      arr.push(value)
      out[fs.name] = arr
    } else {
      out[fs.name] = value
    }
  }

  let i = 0
  while (i < b.length) {
    const [tag, afterTag] = readVarint(b, i)
    i = afterTag
    const fieldNumber = Number(tag >> 3n)
    const wireType = Number(tag & 7n)
    const fs = spec[fieldNumber]

    if (wireType === 0) {
      const [value, next] = readVarint(b, i)
      i = next
      if (fs?.kind === 'uint') push(fs, uintToValue(value))
    } else if (wireType === 2) {
      const [len, dataStart] = readVarint(b, i)
      const dataEnd = dataStart + Number(len)
      assert(dataEnd <= b.length, 'protobuf: length-delimited overrun')
      const seg = b.subarray(dataStart, dataEnd)
      i = dataEnd
      if (fs) {
        if (fs.kind === 'bytesHex') push(fs, toHex(seg))
        else if (fs.kind === 'string')
          push(fs, Buffer.from(seg).toString('utf8'))
        else if (fs.kind === 'message' && fs.message)
          push(fs, decodeMessage(seg, fs.message))
        else if (fs.kind === 'packedUint') {
          const values: ContractValue[] = []
          let k = 0
          while (k < seg.length) {
            const [v, next] = readVarint(seg, k)
            k = next
            values.push(uintToValue(v))
          }
          out[fs.name] = values
        } else if (fs.kind === 'json') {
          const text = Buffer.from(seg).toString('utf8')
          try {
            push(fs, JSON.parse(text))
          } catch {
            push(fs, text)
          }
        }
      }
    } else if (wireType === 1) {
      i += 8 // 64-bit, unused here
    } else if (wireType === 5) {
      i += 4 // 32-bit, unused here
    } else {
      assert(false, `protobuf: unsupported wire type ${wireType}`)
    }
  }
  return out
}

// `ContractValue` has no `null`, and the embedded plugin-config JSON can contain
// nulls (e.g. `tokenDataObservers: null` on lanes without CCTP). Strip them:
// drop null/undefined object keys and array elements recursively.
function sanitize(value: unknown): ContractValue | undefined {
  if (value === null || value === undefined) return undefined
  if (Array.isArray(value)) {
    return value
      .map(sanitize)
      .filter((v): v is ContractValue => v !== undefined)
  }
  if (typeof value === 'object') {
    const out: { [key: string]: ContractValue } = {}
    for (const [key, v] of Object.entries(value)) {
      const sanitized = sanitize(v)
      if (sanitized !== undefined) out[key] = sanitized
    }
    return out
  }
  return value as ContractValue
}

export const Ocr3OffchainConfig: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' && incomingValue.startsWith('0x'),
      'Value must be a hex string',
    )
    try {
      const bytes = Uint8Array.from(Buffer.from(incomingValue.slice(2), 'hex'))
      return sanitize(decodeMessage(bytes, OFFCHAIN_CONFIG)) ?? incomingValue
    } catch {
      return incomingValue
    }
  },
}
