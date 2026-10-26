import { assert } from '@l2beat/shared-pure'

const RDB_TYPE_STRING = 0x00
const RDB_LENGTH_6BIT = 0
const RDB_LENGTH_14BIT = 1
const RDB_LENGTH_32BIT = 0x80
const RDB_LENGTH_ENCODED = 3
const RDB_ENCODING_INT8 = 0
const RDB_ENCODING_INT16 = 1
const RDB_ENCODING_INT32 = 2
const RDB_ENCODING_LZF = 3
const DUMP_TRAILER_LENGTH = 10
const LZF_LITERAL_LIMIT = 32
const LZF_LONG_REFERENCE = 7
const LZF_REFERENCE_LENGTH_MIN = 2

type LengthField =
  | { kind: 'length'; length: number; end: number }
  | { kind: 'encoding'; encoding: number; end: number }

interface DecodedValue {
  value: string
  end: number
}

export function decodeStringDump(dump: Buffer): string {
  assert(dump.length > DUMP_TRAILER_LENGTH, 'Dump is shorter than its trailer')
  assert(dump.readUInt8(0) === RDB_TYPE_STRING, 'Dump is not a string')

  const field = readLengthField(dump, 1)
  const decoded =
    field.kind === 'length'
      ? readRawString(dump, field.end, field.length)
      : readEncodedString(dump, field.end, field.encoding)
  assert(
    decoded.end === dump.length - DUMP_TRAILER_LENGTH,
    'Dump value does not end at its trailer',
  )
  return decoded.value
}

function readRawString(
  dump: Buffer,
  start: number,
  length: number,
): DecodedValue {
  const end = start + length
  assert(end <= dump.length, 'Dump string overruns the dump')
  return { value: dump.toString('utf8', start, end), end }
}

function readEncodedString(
  dump: Buffer,
  start: number,
  encoding: number,
): DecodedValue {
  if (encoding === RDB_ENCODING_INT8) {
    return { value: dump.readInt8(start).toString(), end: start + 1 }
  }
  if (encoding === RDB_ENCODING_INT16) {
    return { value: dump.readInt16LE(start).toString(), end: start + 2 }
  }
  if (encoding === RDB_ENCODING_INT32) {
    return { value: dump.readInt32LE(start).toString(), end: start + 4 }
  }
  assert(encoding === RDB_ENCODING_LZF, `Unknown string encoding ${encoding}`)

  const compressed = readLength(dump, start)
  const uncompressed = readLength(dump, compressed.end)
  const end = uncompressed.end + compressed.length
  assert(end <= dump.length, 'LZF data overruns the dump')
  const output = decompressLzf(
    dump.subarray(uncompressed.end, end),
    uncompressed.length,
  )
  return { value: output.toString('utf8'), end }
}

function readLength(
  dump: Buffer,
  start: number,
): { length: number; end: number } {
  const field = readLengthField(dump, start)
  assert(field.kind === 'length', 'Expected a length, got an encoding')
  return field
}

function readLengthField(dump: Buffer, start: number): LengthField {
  const first = dump.readUInt8(start)
  const lengthType = first >> 6
  if (lengthType === RDB_LENGTH_6BIT) {
    return { kind: 'length', length: first & 0x3f, end: start + 1 }
  }
  if (lengthType === RDB_LENGTH_14BIT) {
    const length = ((first & 0x3f) << 8) | dump.readUInt8(start + 1)
    return { kind: 'length', length, end: start + 2 }
  }
  if (lengthType === RDB_LENGTH_ENCODED) {
    return { kind: 'encoding', encoding: first & 0x3f, end: start + 1 }
  }
  assert(first === RDB_LENGTH_32BIT, `Unsupported length type ${first}`)
  return {
    kind: 'length',
    length: dump.readUInt32BE(start + 1),
    end: start + 5,
  }
}

function decompressLzf(input: Buffer, outputLength: number): Buffer {
  const output = Buffer.alloc(outputLength)
  let inputOffset = 0
  let outputOffset = 0
  while (inputOffset < input.length) {
    const control = input.readUInt8(inputOffset)
    inputOffset += 1

    if (control < LZF_LITERAL_LIMIT) {
      const literalLength = control + 1
      assert(inputOffset + literalLength <= input.length, 'LZF input overrun')
      assert(outputOffset + literalLength <= outputLength, 'LZF output overrun')
      input.copy(output, outputOffset, inputOffset, inputOffset + literalLength)
      inputOffset += literalLength
      outputOffset += literalLength
      continue
    }

    let referenceLength = control >> 5
    if (referenceLength === LZF_LONG_REFERENCE) {
      referenceLength += input.readUInt8(inputOffset)
      inputOffset += 1
    }
    referenceLength += LZF_REFERENCE_LENGTH_MIN
    const distance = ((control & 0x1f) << 8) + input.readUInt8(inputOffset) + 1
    inputOffset += 1
    assert(distance <= outputOffset, 'LZF reference before output start')
    assert(outputOffset + referenceLength <= outputLength, 'LZF output overrun')
    for (let i = 0; i < referenceLength; i++) {
      output[outputOffset + i] = output[outputOffset + i - distance]
    }
    outputOffset += referenceLength
  }
  assert(outputOffset === outputLength, 'LZF output shorter than declared')
  return output
}
