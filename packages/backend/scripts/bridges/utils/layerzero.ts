import { createHash } from 'crypto'

export const LAYERZERO_CONSTANTS = {
  PACKET_VERSION: 1,
  PACKET_HEADER_LENGTH: 81, // 1 + 8 + 4 + 32 + 4 + 32 = 81 bytes
  EID_LENGTH: 4,
  NONCE_LENGTH: 8,
  SENDER_LENGTH: 32,
  RECEIVER_LENGTH: 32,
} as const

export interface DecodedPacketHeader {
  version: number
  nonce: bigint
  srcEid: number
  sender: string
  dstEid: number
  receiver: string
}

export function decodePacket(encodedPayload: string) {
  try {
    const header = decodePacketHeader(encodedPayload)

    if (!header) return null

    const hex = encodedPayload.startsWith('0x')
      ? encodedPayload.slice(2)
      : encodedPayload

    const headerLength = LAYERZERO_CONSTANTS.PACKET_HEADER_LENGTH * 2

    const payload =
      hex.length > headerLength ? '0x' + hex.slice(headerLength) : '0x'

    return {
      header,
      payload,
    }
  } catch (error) {
    console.error('Failed to decode packet:', error)
    return null
  }
}

export function decodePacketHeader(
  encodedPayload: string,
): DecodedPacketHeader | null {
  try {
    const hex = encodedPayload.startsWith('0x')
      ? encodedPayload.slice(2)
      : encodedPayload

    if (hex.length < LAYERZERO_CONSTANTS.PACKET_HEADER_LENGTH * 2) {
      return null
    }

    let offset = 0
    const version = Number.parseInt(hex.slice(offset, offset + 2), 16)
    offset += 2

    const nonce = BigInt('0x' + hex.slice(offset, offset + 16))
    offset += 16

    const srcEid = Number.parseInt(hex.slice(offset, offset + 8), 16)
    offset += 8

    const sender = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    const dstEid = Number.parseInt(hex.slice(offset, offset + 8), 16)
    offset += 8

    const receiver = '0x' + hex.slice(offset, offset + 64)

    offset += 64

    return {
      version,
      nonce,
      srcEid,
      sender,
      dstEid,
      receiver,
    }
  } catch (error) {
    console.error('Failed to decode packet header:', error)
    return null
  }
}

export function createLayerZeroGuid(
  nonce: bigint,
  srcEid: number,
  sender: string,
  dstEid: number,
  receiver: string,
): string {
  const nonceBytes = nonce.toString(16).padStart(16, '0')

  const srcEidBytes = srcEid.toString(16).padStart(8, '0')

  const senderBytes32 = normalizeAddress(sender).slice(2)

  const dstEidBytes = dstEid.toString(16).padStart(8, '0')

  const receiverBytes32 = normalizeAddress(receiver).slice(2)

  const concatenated =
    nonceBytes + srcEidBytes + senderBytes32 + dstEidBytes + receiverBytes32

  const hash = createHash('sha256').update(concatenated, 'hex').digest('hex')

  return '0x' + hash
}

export function normalizeAddress(address: string): string {
  const addr = address.startsWith('0x') ? address.slice(2) : address

  return '0x' + addr.padStart(64, '0')
}
