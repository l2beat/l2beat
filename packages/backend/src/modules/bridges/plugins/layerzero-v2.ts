import { EthereumAddress } from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parsePacketSent = createEventParser(
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
)

const parsePacketDelivered = createEventParser(
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
)

export const PacketSent = createBridgeEventType<{
  $dstChain: string
  guid: string
}>('layerzero-v2.PacketSent')

export const PacketDelivered = createBridgeEventType<{
  $srcChain: string
  guid: string
}>('layerzero-v2.PacketDelivered')

const NETWORKS = [
  {
    chainId: 1,
    eid: 30101,
    chain: 'ethereum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chain: 'arbitrum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chain: 'base',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
]

export class LayerZeroV2Plugin implements BridgePlugin {
  name = 'layerzero-v2'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const network = NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const packetSent = parsePacketSent(input.log, [network.address])
    if (packetSent) {
      const packet = decodePacket(packetSent.encodedPayload)
      if (!packet) return
      const guid = createLayerZeroGuid(
        packet.header.nonce,
        packet.header.srcEid,
        packet.header.sender,
        packet.header.dstEid,
        packet.header.receiver,
      )
      const $dstChain =
        NETWORKS.find((x) => x.eid === packet.header.dstEid)?.chain ?? 'unknown'
      return PacketSent.create(input.ctx, { $dstChain, guid })
    }

    const packetDelivered = parsePacketDelivered(input.log, [network.address])
    if (packetDelivered) {
      const guid = createLayerZeroGuid(
        packetDelivered.origin.nonce,
        packetDelivered.origin.srcEid,
        packetDelivered.origin.sender,
        network.eid,
        packetDelivered.receiver,
      )
      const $srcChain =
        NETWORKS.find((x) => x.eid === packetDelivered.origin.srcEid)?.chain ??
        'unknown'
      return PacketDelivered.create(input.ctx, { $srcChain, guid })
    }
  }

  match(
    packetDelivered: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!PacketDelivered.checkType(packetDelivered)) return
    const packetSent = db.find(PacketSent, { guid: packetDelivered.args.guid })
    if (!packetSent) return
    return [
      Result.Message('layerzero-v2.Message', [packetSent, packetDelivered]),
    ]
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

export const LAYERZERO_CONSTANTS = {
  PACKET_VERSION: 1,
  EID_LENGTH: 4,
  NONCE_LENGTH: 8,
  SENDER_LENGTH: 32,
  RECEIVER_LENGTH: 32,
} as const

// https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1#code#F14#L41
// https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1#code#F8#L8
// https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1#code#F30#L53

export function decodePacket(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint8()
    const nonce = reader.readUint64()
    const srcEid = reader.readUint32()
    const sender = reader.readBytes(32)
    const dstEid = reader.readUint32()
    const receiver = reader.readBytes(32)
    const payload = reader.readRemainingBytes()
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
    console.error('Failed to decode packet:', error)
    return null
  }
}
