import { type DecodedValue, sliceBytes } from './decode'

export interface PackedField {
  name: string
  type: string
}

export interface PackedSchema {
  name: string
  fields: readonly PackedField[]
}

export function decodePacked(
  schema: PackedSchema,
  encoded: `0x${string}`,
  chainId?: number,
): DecodedValue {
  if (!/^0x[\da-f]*$/i.test(encoded)) {
    throw new Error(`Invalid ${schema.name} encoding`)
  }

  const fields = schema.fields.map((field) => ({
    ...field,
    size: packedTypeSize(field.type),
  }))
  const expectedLength = fields.reduce((sum, field) => sum + field.size, 0)
  const actualLength = (encoded.length - 2) / 2

  if (!Number.isInteger(actualLength) || actualLength !== expectedLength) {
    throw new Error(
      `Invalid ${schema.name} length: expected ${expectedLength}, got ${actualLength}`,
    )
  }

  let offset = 0
  const members = fields.map((field) => {
    const bytes = sliceBytes(encoded, offset, offset + field.size)
    offset += field.size
    return decodePackedField(field.name, field.type, bytes, chainId)
  })

  const decoded: DecodedValue = {
    type: 'tuple',
    value: '',
    bytes: encoded,
    members,
  }
  if (chainId !== undefined) decoded.chainId = chainId
  return decoded
}

function decodePackedField(
  name: string,
  type: string,
  bytes: `0x${string}`,
  chainId?: number,
): DecodedValue {
  const common: Pick<DecodedValue, 'name' | 'bytes' | 'chainId'> = {
    name,
    bytes,
  }
  if (chainId !== undefined) common.chainId = chainId

  if (type === 'address') {
    return { ...common, type: 'address', value: bytes }
  }

  if (type === 'bool') {
    const value = BigInt(bytes)
    if (value !== 0n && value !== 1n) {
      throw new Error('Invalid packed bool')
    }
    return { ...common, type: 'bool', value: value === 1n ? 'true' : 'false' }
  }

  if (/^bytes\d+$/.test(type)) {
    return { ...common, type: 'bytes', value: bytes }
  }

  const integer = /^(u?)int(\d*)$/.exec(type)
  if (integer) {
    const signed = integer[1] === ''
    const bits = integer[2] === '' ? 256 : Number(integer[2])
    let value = BigInt(bytes)
    if (signed && value >= 2n ** BigInt(bits - 1)) {
      value -= 2n ** BigInt(bits)
    }
    return { ...common, type: 'number', value: value.toString() }
  }

  throw new Error(`Unsupported packed type: ${type}`)
}

function packedTypeSize(type: string): number {
  if (type === 'address') return 20
  if (type === 'bool') return 1

  const bytes = /^bytes(\d+)$/.exec(type)
  if (bytes) {
    const size = Number(bytes[1])
    if (size >= 1 && size <= 32) return size
    throw new Error(`Invalid packed type: ${type}`)
  }

  const integer = /^(?:u?int)(\d*)$/.exec(type)
  if (integer) {
    const bits = integer[1] === '' ? 256 : Number(integer[1])
    if (bits >= 8 && bits <= 256 && bits % 8 === 0) return bits / 8
    throw new Error(`Invalid packed type: ${type}`)
  }

  throw new Error(`Unsupported packed type: ${type}`)
}
