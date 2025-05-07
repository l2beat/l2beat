const INT_COMPLEMENT = 2n ** 255n

export interface AbiValue {
  name: string
  abi: string
  encoded: `0x${string}`
  decoded: AbiDecoded
}

export type AbiDecoded =
  | AbiNumber
  | AbiAddress
  | AbiBool
  | AbiBytes
  | AbiString
  | AbiArray

export interface AbiNumber {
  type: 'number'
  value: string
}

export interface AbiAddress {
  type: 'address'
  value: `0x${string}`
}

export interface AbiBool {
  type: 'bool'
  value: boolean
}

export interface AbiBytes {
  type: 'bytes'
  value: `0x${string}`
}

export interface AbiString {
  type: 'string'
  value: string
}

export interface AbiArray {
  type: 'array'
  value: AbiValue[]
}

export function decodeType(type: string, encoded: `0x${string}`): AbiValue {
  return decodeParsed(parseType(type), encoded)
}

function decodeParsed(type: ParsedType, encoded: `0x${string}`): AbiValue {
  const common = { name: '', abi: type.type, encoded }
  if (type.tupleElements) {
    let offset = 0
    const staticData: `0x${string}`[] = []
    const dynamicOffsets: (bigint | undefined)[] = []
    for (const element of type.tupleElements) {
      const end = offset + element.size
      // TODO: validate offset size
      const bytes: `0x${string}` = `0x${encoded.slice(2 + offset * 64, 2 + end * 64)}`
      staticData.push(bytes)
      offset = end
      if (element.dynamic) {
        // TODO: validate offset size
        const dynamicOffset = BigInt(bytes)
        dynamicOffsets.push(dynamicOffset)
      } else {
        dynamicOffsets.push(undefined)
      }
    }
    dynamicOffsets.push(BigInt((encoded.length - 2) / 2))
    const array = type.tupleElements.map((e, i) => {
      // biome-ignore lint/style/noNonNullAssertion: It's there
      return decodeParsed(e, staticData[i]!)
    })
    return { ...common, decoded: { type: 'array', value: array } }
  }
  if (type.arrayElement) {
    const element = type.arrayElement
    if (encoded.length < 66) {
      throw new Error(`Invalid encoding, array too short`)
    }
    const length = Number(encoded.slice(0, 66))
    let offset = 1
    const staticData: `0x${string}`[] = []
    const dynamicOffsets: (bigint | undefined)[] = []
    for (let i = 0; i < length; i++) {
      const end = offset + element.size
      // TODO: validate offset size
      const bytes: `0x${string}` = `0x${encoded.slice(2 + offset * 64, 2 + end * 64)}`
      staticData.push(bytes)
      offset = end
      if (element.dynamic) {
        // TODO: validate offset size
        const dynamicOffset = BigInt(bytes)
        dynamicOffsets.push(dynamicOffset)
      } else {
        dynamicOffsets.push(undefined)
      }
    }
    dynamicOffsets.push(BigInt((encoded.length - 2) / 2))
    const array = staticData.map((bytes) => decodeParsed(element, bytes))
    return { ...common, decoded: { type: 'array', value: array } }
  }
  if (type.type === 'bytes') {
    const bytes = decodeBytes(type.type, encoded)
    return { ...common, decoded: { type: 'bytes', value: bytes } }
  }
  if (type.type === 'string') {
    const bytes = decodeBytes(type.type, encoded)
    return { ...common, decoded: { type: 'string', value: hexToString(bytes) } }
  }
  if (type.type.startsWith('uint')) {
    const uint = decodeUint(type.type, encoded)
    return { ...common, decoded: { type: 'number', value: uint.toString() } }
  }
  if (type.type.startsWith('ufixed')) {
    const uint = decodeUint('uint256', encoded)
    return { ...common, decoded: { type: 'number', value: uint.toString() } }
  }
  if (type.type.startsWith('int')) {
    const int = decodeInt(type.type, encoded)
    return { ...common, decoded: { type: 'number', value: int.toString() } }
  }
  if (type.type.startsWith('fixed')) {
    const int = decodeInt('int256', encoded)
    return { ...common, decoded: { type: 'number', value: int.toString() } }
  }
  if (type.type === 'address') {
    const padding = encoded.slice(0, -40)
    if (padding !== '0x000000000000000000000000') {
      throw new Error('Invalid encoding, address too large')
    }
    const address: `0x${string}` = `0x${encoded.slice(-40)}`
    return { ...common, decoded: { type: 'address', value: address } }
  }
  if (type.type === 'bool') {
    const uint = decodeUint('uint256', encoded)
    if (uint !== 0n && uint !== 1n) {
      throw new Error('Invalid encoding, boolean too large')
    }
    const bool = uint === 1n
    return { ...common, decoded: { type: 'bool', value: bool } }
  }
  if (type.type.startsWith('bytes')) {
    const size = parseInt(type.type.slice('bytes'.length))
    const suffix = encoded.slice(2 + size * 2)
    if (!/^0*$/.test(suffix)) {
      throw new Error(`Invalid encoding, ${type.type} too large`)
    }
    const bytes = encoded.slice(0, 2 + size * 2) as `0x${string}`
    return { ...common, decoded: { type: 'bytes', value: bytes } }
  }
  throw new Error('Invalid type')
}

function decodeUint(type: string, encoded: `0x${string}`) {
  const size = BigInt(type.slice('uint'.length))
  const max = 2n ** size - 1n
  const uint = BigInt(encoded)
  if (uint > max) {
    throw new Error(`Invalid encoding, ${type} too large`)
  }
  return uint
}

function decodeInt(type: string, encoded: `0x${string}`) {
  const size = BigInt(type.slice('int'.length))
  const max = 2n ** (size - 1n) - 1n
  const min = -max - 1n
  const uint = BigInt(encoded)
  const int = uint > INT_COMPLEMENT ? uint - INT_COMPLEMENT * 2n : uint
  if (int > max || int < min) {
    throw new Error(`Invalid encoding, ${type} too large`)
  }
  return int
}

function decodeBytes(type: string, encoded: `0x${string}`): `0x${string}` {
  if (encoded.length < 66) {
    throw new Error(`Invalid encoding, ${type} too short`)
  }
  const length = BigInt(encoded.slice(0, 66))
  const end = 66 + Number(length) * 2
  const data = encoded.slice(66, end)
  if (data.length !== Number(length) * 2) {
    throw new Error(`Invalid encoding, ${type} too short`)
  }
  const padding = encoded.slice(end)
  if (!/^0*$/.test(padding) || padding.length > 64) {
    throw new Error(`Invalid encoding, ${type} too long`)
  }
  return `0x${data}`
}

function hexToString(bytes: `0x${string}`) {
  const length = (bytes.length - 2) / 2
  const buffer = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    const byte = parseInt(bytes.slice(2 + i * 2, 2 + (i + 1) * 2), 16)
    buffer[i] = byte
  }
  return new TextDecoder().decode(buffer)
}

export interface ParsedType {
  type: string
  size: number
  dynamic: boolean
  tupleElements?: ParsedType[]
  arrayElement?: ParsedType
}

export function parseType(type: string): ParsedType {
  if (type.startsWith('(')) {
    const elements: string[] = []
    let from = 1
    let depth = 0
    for (let i = 1; i < type.length - 1; i++) {
      if (type[i] === '(') {
        depth++
      } else if (type[i] === ')') {
        depth--
      } else if (type[i] === ',' && depth === 0) {
        elements.push(type.slice(from, i))
        from = i + 1
      }
    }
    elements.push(type.slice(from, type.length - 1))
    const tupleElements = elements.map((x) => parseType(x.trim()))
    const typeName = `(${tupleElements.map((x) => x.type).join(', ')})`
    const dynamic = tupleElements.some((x) => x.dynamic)
    const size = dynamic
      ? 1
      : tupleElements.reduce((size, e) => size + e.size, 0)
    return { type: typeName, size, dynamic, tupleElements }
  }
  if (type.endsWith(']')) {
    const openBracket = type.lastIndexOf('[')
    const elementType = parseType(type.slice(0, openBracket))
    const countString = type.slice(openBracket + 1, -1)
    if (countString.length === 0) {
      return {
        type: `${elementType.type}[]`,
        size: 1,
        dynamic: true,
        arrayElement: elementType,
      }
    }
    const length = Number(countString)
    return {
      type: `${elementType.type}[${length}]`,
      size: elementType.dynamic ? 1 : elementType.size * length,
      dynamic: elementType.dynamic,
      tupleElements: new Array(length).fill(elementType),
    }
  }
  if (type === 'uint') {
    type = 'uint256'
  } else if (type === 'int') {
    type = 'int256'
  }
  return {
    type: type,
    size: 1,
    dynamic: type === 'bytes' || type === 'string',
  }
}
