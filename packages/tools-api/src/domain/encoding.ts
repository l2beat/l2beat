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
  | { type: 'call'; selector: `0x${string}`; parameters: AbiValue[] }

export function decodeType(type: string, encoded: `0x${string}`): AbiValue {
  return decodeParsed(parseType(type), encoded)
}

function decodeParsed(type: ParsedType, encoded: `0x${string}`): AbiValue {
  const common = { name: '', abi: type.type, encoded }
  let elements: ParsedType[] | undefined
  if (type.tupleElements) {
    elements = type.tupleElements
  }
  if (type.arrayElement) {
    const length = parseInt(sliceBytes(encoded, 0, 32))
    if (length > 1_000_000) {
      throw new Error('Invalid encoding')
    }
    encoded = sliceBytes(encoded, 32)
    elements = new Array(length).fill(type.arrayElement)
  }
  if (elements) {
    let offset = 0
    const staticData: `0x${string}`[] = []
    const dynamicOffsets: (number | undefined)[] = []
    for (const element of elements) {
      const end = offset + element.size
      const bytes = sliceBytes(encoded, offset * 32, (offset + 1) * 32)
      staticData.push(bytes)
      offset = end
      dynamicOffsets.push(element.dynamic ? parseInt(bytes) : undefined)
    }
    offset *= 32
    const array = elements.map((e, i) => {
      if (e.dynamic) {
        // biome-ignore lint/style/noNonNullAssertion: It's there
        const start = dynamicOffsets[i]!
        if (start !== offset) {
          throw new Error('Invalid encoding')
        }
        const end = dynamicOffsets.find((x, j) => j > i && x !== undefined)
        offset = end ?? -1
        return decodeParsed(e, sliceBytes(encoded, start, end))
      }
      // biome-ignore lint/style/noNonNullAssertion: It's there
      return decodeParsed(e, staticData[i]!)
    })
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
  throw new Error(`Invalid type: ${type.type}`)
}

function decodeUint(type: string, encoded: `0x${string}`) {
  if (encoded.length !== 66) {
    throw new Error('Invalid encoding')
  }
  const size = BigInt(type.slice('uint'.length))
  const max = 2n ** size - 1n
  const uint = BigInt(encoded)
  if (uint > max) {
    throw new Error(`Invalid encoding, ${type} too large`)
  }
  return uint
}

function decodeInt(type: string, encoded: `0x${string}`) {
  if (encoded.length !== 66) {
    throw new Error('Invalid encoding')
  }
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
  name?: string
  size: number
  dynamic: boolean
  function?: boolean
  tupleElements?: ParsedType[]
  arrayElement?: ParsedType
}

export function parseType(type: string): ParsedType {
  return parseAny(tokenizeType(type))
}

function parseAny(tokens: string[]): ParsedType {
  if (accept(tokens, 'function')) {
    const name = expect(tokens)
    expect(tokens, '(')
    const tuple = parseTuple(tokens)
    return {
      ...tuple,
      type: `function ${name}${tuple.type}`,
      name,
      function: true,
    }
  }
  return parseTypeName(tokens)
}

function parseTuple(tokens: string[]): ParsedType {
  const members: ParsedType[] = []
  while (!accept(tokens, ')')) {
    const parsed = parseTypeName(tokens)
    members.push(parsed)
    if (accept(tokens, ',')) {
      continue
    }
    expect(tokens, ')')
    break
  }
  const dynamic = members.some((x) => x.dynamic)
  return {
    type: `(${members.map((x) => x.type).join(', ')})`,
    dynamic,
    size: dynamic ? 1 : members.reduce((size, x) => size + x.size, 0),
    tupleElements: members,
  }
}

function parseTypeName(tokens: string[]): ParsedType {
  let parsed: ParsedType
  if (accept(tokens, 'tuple')) {
    expect(tokens, '(')
    parsed = parseTuple(tokens)
  } else if (accept(tokens, '(')) {
    parsed = parseTuple(tokens)
  } else {
    let type = expect(tokens)
    if (type === 'uint') {
      type = 'uint256'
    } else if (type === 'int') {
      type = 'int256'
    }
    const dynamic = type === 'bytes' || type === 'string'
    parsed = { type, size: 1, dynamic }
  }
  while (accept(tokens, '[')) {
    if (accept(tokens, ']')) {
      parsed = {
        type: `${parsed.type}[]`,
        size: 1,
        dynamic: true,
        arrayElement: parsed,
      }
      continue
    }
    const length = parseInt(expect(tokens))
    expect(tokens, ']')
    parsed = {
      type: `${parsed.type}[${length}]`,
      size: parsed.dynamic ? 1 : parsed.size * length,
      dynamic: parsed.dynamic,
      tupleElements: new Array(length).fill(parsed),
    }
  }
  let name: string | undefined
  while (tokens[0] && /^\w+$/.test(tokens[0])) {
    name = expect(tokens)
    if (
      name === 'memory' ||
      name === 'storage' ||
      name === 'calldata' ||
      name === 'indexed'
    ) {
      name = undefined
    }
  }
  if (name) {
    parsed.name = name
  }
  return parsed
}

function expect(tokens: string[], token?: string) {
  const actual = tokens.shift()
  if (actual && (!token || actual === token)) {
    return actual
  }
  throw new Error('Invalid type')
}

function accept(tokens: string[], token: string) {
  if (tokens[0] === token) {
    tokens.shift()
    return true
  }
  return false
}

export function tokenizeType(type: string) {
  const result: string[] = []
  let current: string = ''
  for (const char of type) {
    if (/\w/.test(char)) {
      current += char
      continue
    }
    if (current !== '') {
      result.push(current)
      current = ''
    }
    if (!/\s/.test(char)) {
      result.push(char)
    }
  }
  if (current !== '') {
    result.push(current)
  }
  return result
}
