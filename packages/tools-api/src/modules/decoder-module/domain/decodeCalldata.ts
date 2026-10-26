import { inflateRawSync } from 'zlib'

export const calldataBytesMax = 64 * 1024
// Incompressible calldata deflates into stored blocks, a few bytes bigger.
const compressedBytesMax = calldataBytesMax + 1024
const encodedLengthMax = Math.ceil((compressedBytesMax * 4) / 3)

export function decodeCalldata(encoded: string): `0x${string}` {
  if (encoded.length > encodedLengthMax) {
    throw new Error('Calldata too long', {
      cause: { length: encoded.length, encodedLengthMax },
    })
  }

  const compressed = Buffer.from(encoded, 'base64url')
  const calldata = inflateCalldata(compressed)
  return `0x${calldata.toString('hex')}`
}

function inflateCalldata(compressed: Buffer): Buffer {
  try {
    return inflateRawSync(compressed, { maxOutputLength: calldataBytesMax })
  } catch (error) {
    if (isBufferTooLarge(error)) {
      throw new Error('Calldata too long', { cause: { calldataBytesMax } })
    }
    throw error
  }
}

function isBufferTooLarge(error: unknown): boolean {
  return (
    error instanceof RangeError &&
    'code' in error &&
    error.code === 'ERR_BUFFER_TOO_LARGE'
  )
}
