import { assert } from '@l2beat/backend-tools'
import { DecompressionStream } from 'stream/web'

import { rlpDecode } from '../../utils/rlpDecode'

export function byteArrFromHexStr(hexString: string) {
  const str = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  assert(str.length % 2 === 0, 'Invalid hex string length')
  const arr = []
  for (let i = 0; i < str.length; i += 2) {
    arr.push(parseInt(str.substring(i, i + 2), 16))
  }
  return new Uint8Array(arr)
}

export function hexStrFromByteArr(byteArr: Uint8Array) {
  return (
    '0x' +
    Array.from(byteArr)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  )
}

export async function getBatchFromChannel(channel: Uint8Array) {
  const decompressed = await decompressToByteArray(channel)
  const decoded = rlpDecode(decompressed)

  assert(decoded instanceof Uint8Array, 'Invalid decoded type')

  return decoded
}

export async function decompressToByteArray(compressedData: Uint8Array) {
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
      if (err instanceof Error && err.message === 'unexpected end of file')
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
