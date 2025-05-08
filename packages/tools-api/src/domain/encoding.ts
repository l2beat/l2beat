const INT_COMPLEMENT = 2n ** 255n

export interface AbiValue {
  name: string
  abi: string
  encoded: `0x${string}`
  decoded: AbiDecoded
}

export type AbiDecoded =
  | { type: 'number'; value: string }
  | { type: 'address'; value: `0x${string}` }
  | { type: 'bool'; value: boolean }
  | { type: 'bytes'; value: `0x${string}`; extra: `0x${string}` }
  | { type: 'string'; value: string; extra: `0x${string}` }
  | { type: 'array'; value: AbiValue[] }

export function decodeType(type: string, encoded: `0x${string}`): AbiValue {
  return decodeParsed(parseType(type), encoded)
}

function decodeParsed(type: ParsedType, encoded: `0x${string}`): AbiValue {
  const common = { name: '', abi: type.type, encoded }
  if (type.tupleElements) {
    let offset = 0
    const staticData: `0x${string}`[] = []
    const dynamicOffsets: (number | undefined)[] = []
    for (const element of type.tupleElements) {
      const end = offset + element.size
      const bytes = sliceBytes(encoded, offset * 32, (offset + 1) * 32)
      staticData.push(bytes)
      offset = end
      dynamicOffsets.push(element.dynamic ? parseInt(bytes) : undefined)
    }
    const array = type.tupleElements.map((e, i) => {
      // biome-ignore lint/style/noNonNullAssertion: It's there
      return decodeParsed(e, staticData[i]!)
    })
    return { ...common, decoded: { type: 'array', value: array } }
  }
  if (type.arrayElement) {
    const element = type.arrayElement
    const length = parseInt(sliceBytes(encoded, 0, 32))
    let offset = 1
    const staticData: `0x${string}`[] = []
    const dynamicOffsets: (number | undefined)[] = []
    for (let i = 0; i < length; i++) {
      const end = offset + element.size
      const bytes = sliceBytes(encoded, offset * 32, (offset + 1) * 32)
      staticData.push(bytes)
      offset = end
      dynamicOffsets.push(element.dynamic ? parseInt(bytes) : undefined)
    }
    const array = staticData.map((bytes) => decodeParsed(element, bytes))
    return { ...common, decoded: { type: 'array', value: array } }
  }
  if (type.type === 'bytes') {
    const { bytes, extra } = decodeBytes(type.type, encoded)
    return { ...common, decoded: { type: 'bytes', value: bytes, extra } }
  }
  if (type.type === 'string') {
    const { bytes, extra } = decodeBytes(type.type, encoded)
    const value = hexToString(bytes)
    return { ...common, decoded: { type: 'string', value, extra } }
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
    const padding = sliceBytes(encoded, 0, 12)
    if (!isZeroed(padding)) {
      throw new Error('Invalid encoding')
    }
    const address = sliceBytes(encoded, 12)
    return { ...common, decoded: { type: 'address', value: address } }
  }
  if (type.type === 'bool') {
    const uint = decodeUint('uint256', encoded)
    if (uint !== 0n && uint !== 1n) {
      throw new Error('Invalid encoding')
    }
    return { ...common, decoded: { type: 'bool', value: uint === 1n } }
  }
  if (type.type.startsWith('bytes')) {
    const size = parseInt(type.type.slice('bytes'.length))
    const suffix = sliceBytes(encoded, size)
    if (!isZeroed(suffix)) {
      throw new Error('Invalid encoding')
    }
    const bytes = sliceBytes(encoded, 0, size)
    return { ...common, decoded: { type: 'bytes', value: bytes, extra: '0x' } }
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

function decodeBytes(type: string, encoded: `0x${string}`) {
  if (encoded.length < 66) {
    throw new Error(`Invalid encoding, ${type} too short`)
  }
  const length = parseInt(sliceBytes(encoded, 0, 32))
  const bytesEnd = 32 + length
  const alignmentEnd = alignTo32(bytesEnd)
  const bytes = sliceBytes(encoded, 32, bytesEnd)
  const padding = sliceBytes(encoded, bytesEnd, alignmentEnd)
  const extra = sliceBytes(encoded, alignmentEnd)
  if (!isZeroed(padding)) {
    throw new Error('Invalid encoding')
  }
  return { bytes, extra }
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

function sliceBytes(
  bytes: `0x${string}`,
  from: number,
  to?: number,
): `0x${string}` {
  const fromIndex = from * 2 + 2
  const toIndex = to !== undefined ? to * 2 + 2 : bytes.length
  if (
    fromIndex < 0 ||
    fromIndex > bytes.length ||
    toIndex < 0 ||
    toIndex > bytes.length ||
    fromIndex > toIndex
  ) {
    throw new Error('Invalid slice range')
  }
  return `0x${bytes.slice(fromIndex, toIndex)}`
}

function isZeroed(bytes: `0x${string}`) {
  return /^0x0*$/.test(bytes)
}

function alignTo32(length: number) {
  if (length % 32 === 0) {
    return length
  }
  return Math.floor(length / 32 + 1) * 32
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
    const length = parseInt(countString)
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
    type,
    size: 1,
    dynamic: type === 'bytes' || type === 'string',
  }
}
