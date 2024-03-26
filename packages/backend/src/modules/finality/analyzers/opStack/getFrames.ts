import { assert } from '@l2beat/backend-tools'

const VERSION_OFFSET = 0
const ENCODING_VERSION = 0
const FIXED_OVERHEAD_BYTES = 23

// https://specs.optimism.io/protocol/derivation.html#batcher-transaction-format
export function getFrames(rollupData: Uint8Array) {
  assert(
    rollupData[VERSION_OFFSET] === ENCODING_VERSION,
    `Invalid version received, expected ${ENCODING_VERSION} received ${rollupData[VERSION_OFFSET]}`,
  )

  const frames = rollupData.slice(1)

  // bytes32
  const channelId = '0x' + byteArrToNum(frames.slice(0, 16)).toString(16)
  // uint16
  const frameNumber = byteArrToNum(frames.slice(16, 18))
  // uint32
  const frameDataLength = byteArrToNum(frames.slice(18, 22))
  // bytes
  const frameData = frames.slice(22, 22 + frameDataLength)
  // bool
  const isLast = !!byteArrToNum(
    frames.slice(22 + frameDataLength, 22 + frameDataLength + 1),
  )

  // there can be multiple frames per blob, but they were never seen in the wild
  assert(
    frames.length === frameDataLength + FIXED_OVERHEAD_BYTES,
    "Invalid frame's length",
  )

  return {
    channelId,
    frameNumber,
    frameDataLength,
    frameData,
    isLast,
  }
}

function byteArrToNum(arr: Uint8Array): number {
  assert(arr.length > 0)

  if (arr.length === 1) {
    return arr[0]
  }

  return 256 * byteArrToNum(arr.slice(0, arr.length - 1)) + arr[arr.length - 1]
}
