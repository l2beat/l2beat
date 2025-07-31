import { createHash } from 'crypto'
import { solidityKeccak256 } from 'ethers/lib/utils'

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
  const nonceBytes = '0x' + nonce.toString(16).padStart(16, '0')

  const srcEidBytes = '0x' + srcEid.toString(16).padStart(8, '0')

  const senderBytes32 = '0x' + normalizeAddress(sender).slice(2)

  const dstEidBytes = '0x' + dstEid.toString(16).padStart(8, '0')

  const receiverBytes32 = '0x' + normalizeAddress(receiver).slice(2)

  return solidityKeccak256(
    ['bytes', 'bytes', 'bytes', 'bytes', 'bytes'],
    [nonceBytes, srcEidBytes, senderBytes32, dstEidBytes, receiverBytes32],
  )
}

export function normalizeAddress(address: string): string {
  const addr = address.startsWith('0x') ? address.slice(2) : address

  return '0x' + addr.padStart(64, '0')
}

export interface DecodedV1Packet {
  nonce: bigint
  localChainId: number
  ua: string // User Application address
  dstChainId: number
  dstAddress: string // Destination address
  payload: string // The actual message payload
}

export function decodeV1Packet(packetPayload: string): DecodedV1Packet | null {
  try {
    const hex = packetPayload.startsWith('0x')
      ? packetPayload.slice(2)
      : packetPayload

    // Validate minimum length (8 + 2 + 20 + 2 + 20 = 52 bytes minimum)
    if (hex.length < 104) {
      // 52 * 2 = 104 hex chars
      return null
    }

    let offset = 0

    // Parse nonce (8 bytes, big endian)
    const nonce = BigInt('0x' + hex.slice(offset, offset + 16))
    offset += 16

    // Parse localChainId (2 bytes, big endian)
    const localChainId = Number.parseInt(hex.slice(offset, offset + 4), 16)
    offset += 4

    // Parse ua (20 bytes)
    const ua = '0x' + hex.slice(offset, offset + 40)
    offset += 40

    // Parse dstChainId (2 bytes, big endian)
    const dstChainId = Number.parseInt(hex.slice(offset, offset + 4), 16)
    offset += 4

    // Parse dstAddress (20 bytes for Ethereum addresses)
    const dstAddress = '0x' + hex.slice(offset, offset + 40)
    offset += 40

    // Parse payload (remaining bytes)
    const payload = hex.length > offset ? '0x' + hex.slice(offset) : '0x'

    return {
      nonce,
      localChainId,
      ua,
      dstChainId,
      dstAddress,
      payload,
    }
  } catch (error) {
    console.error('Failed to decode v1 packet:', error)
    return null
  }
}

export function createV1PacketId(
  nonce: bigint,
  srcChainId: number,
  ua: string,
  dstChainId: number,
  dstAddress: string,
): string {
  // Convert to bytes format

  const nonceBytes = nonce.toString(16).padStart(16, '0')

  const srcChainIdBytes = srcChainId.toString(16).padStart(4, '0')

  const uaBytes = normalizeAddress(ua).slice(2)

  const dstChainIdBytes = dstChainId.toString(16).padStart(4, '0')

  const dstAddressBytes = normalizeAddress(dstAddress).slice(2)

  // Concatenate all components (equivalent to abi.encodePacked)

  const concatenated =
    nonceBytes + srcChainIdBytes + uaBytes + dstChainIdBytes + dstAddressBytes

  // Use sha256 (should be keccak256 for exact match with contracts)

  const hash = createHash('sha256').update(concatenated, 'hex').digest('hex')

  return '0x' + hash
}

export interface DecodedV1PacketHeader {
  version: number
  nonce: bigint
  srcEid: number // For SendUln301 events
  sender: string // bytes32 sender
  dstEid: number
  receiver: string // bytes32 receiver
}

export interface DecodedV1SendUln301Packet {
  header: DecodedV1PacketHeader
  payload: string
}

export function decodeV1SendUln301Packet(
  encodedPayload: string,
): DecodedV1SendUln301Packet | null {
  try {
    const hex = encodedPayload.startsWith('0x')
      ? encodedPayload.slice(2)
      : encodedPayload

    // Validate minimum length for header (1 + 8 + 4 + 32 + 4 + 32 = 81 bytes)
    if (hex.length < 162) {
      // 81 * 2 = 162 hex chars
      return null
    }
    let offset = 0

    // Parse version (1 byte)
    const version = Number.parseInt(hex.slice(offset, offset + 2), 16)
    offset += 2

    // Parse nonce (8 bytes, big endian)
    const nonce = BigInt('0x' + hex.slice(offset, offset + 16))
    offset += 16

    // Parse srcEid (4 bytes, big endian)
    const srcEid = Number.parseInt(hex.slice(offset, offset + 8), 16)
    offset += 8

    // Parse sender (32 bytes)
    const sender = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    // Parse dstEid (4 bytes, big endian)
    const dstEid = Number.parseInt(hex.slice(offset, offset + 8), 16)
    offset += 8

    // Parse receiver (32 bytes)
    const receiver = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    // Parse payload (remaining bytes)
    const payload = hex.length > offset ? '0x' + hex.slice(offset) : '0x'

    return {
      header: {
        version,
        nonce,
        srcEid,
        sender,
        dstEid,
        receiver,
      },
      payload,
    }
  } catch (error) {
    console.error('Failed to decode v1 SendUln301 packet:', error)
    return null
  }
}
