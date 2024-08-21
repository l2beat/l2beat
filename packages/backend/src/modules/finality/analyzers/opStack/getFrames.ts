import { assert } from '@l2beat/shared-pure'

const VERSION_OFFSET = 0
const ENCODING_VERSION = 0
const FIXED_OVERHEAD_BYTES = 23

// https://specs.optimism.io/protocol/derivation.html#batcher-transaction-format
export function getFrames(rollupData: Uint8Array) {
  assert(
    rollupData[VERSION_OFFSET] === ENCODING_VERSION,
    `Invalid version received, expected ${ENCODING_VERSION} received ${rollupData[VERSION_OFFSET]}`,
  )

  // skipping the version byte
  const frames = rollupData.slice(1)
  const framesView = new DataView(frames.buffer)

  // bytes16
  const channelId = getBytes16(framesView)
  // uint16 (2 bytes)
  const frameNumber = framesView.getUint16(16)
  // uint32 (4 bytes)
  const frameDataLength = framesView.getUint32(18)
  // bytes
  const frameData = frames.slice(22, 22 + frameDataLength)
  // bool
  const isLast = !!framesView.getUint8(22 + frameDataLength)

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

function getBytes16(dataView: DataView, offset = 0): string {
  return (
    '0x' +
    Array.from(new Uint8Array(dataView.buffer, offset, 16))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  )
}
