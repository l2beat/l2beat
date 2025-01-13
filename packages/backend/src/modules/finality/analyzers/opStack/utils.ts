import { brotliDecompressSync } from 'node:zlib'
import { DecompressionStream } from 'stream/web'

import { assert } from '@l2beat/shared-pure'
import { rlpDecodePartial } from '../../utils/rlpDecode'

const CHANNEL_VERSION_BROTLI = 1
const CHANNEL_VERSION_ZLIB_LOWER_NIBBLE_DEFALTE = 0x08
const CHANNEL_VERSION_ZLIB_LOWER_NIBBLE_RESERVED = 0x0f

export async function getBatchFromChannel(channel: Uint8Array) {
  const decompressed = await decompressToByteArray(channel)
  const batches = []

  let input = decompressed
  while (input.length > 0) {
    const [decoded, rest] = rlpDecodePartial(input)
    assert(decoded instanceof Uint8Array, 'Invalid decoded type')
    batches.push(decoded)
    input = rest
  }

  return batches
}

export function decompressToByteArray(compressedData: Uint8Array) {
  const channelVersionByte = compressedData[0]
  const lowerNibble = channelVersionByte & 0x0f

  // NOTE(radomski): Based on this spec
  // https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/fjord/derivation.md#brotli-channel-compression
  if (
    lowerNibble === CHANNEL_VERSION_ZLIB_LOWER_NIBBLE_DEFALTE ||
    lowerNibble === CHANNEL_VERSION_ZLIB_LOWER_NIBBLE_RESERVED
  ) {
    return decompressToByteArrayZlib(compressedData)
  }

  switch (channelVersionByte) {
    case CHANNEL_VERSION_BROTLI:
      return decompressToByteArrayBrotli(compressedData.slice(1))
    default: {
      assert(
        false,
        `Unsupported channel version (${channelVersionByte}), probably a different compression was used`,
      )
    }
  }
}

function decompressToByteArrayBrotli(
  compressedDataWithoutVersionByte: Uint8Array,
) {
  return brotliDecompressSync(compressedDataWithoutVersionByte)
}

async function decompressToByteArrayZlib(compressedData: Uint8Array) {
  const blob = new Blob([compressedData])
  const ds = new DecompressionStream('deflate')
  const stream = blob.stream().pipeThrough(ds)
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let totalSize = 0
  while (true) {
    try {
      const { done, value } = (await reader.read()) as {
        done: boolean
        value: Uint8Array
      }
      if (done) break
      chunks.push(value)
      totalSize += value.length
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'Z_BUF_ERROR')
        break
      throw err
    }
  }
  const concatenatedChunks = new Uint8Array(totalSize)
  let offset = 0
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset)
    offset += chunk.length
  }
  return concatenatedChunks
}
