import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'
import { BinaryReader } from '../BinaryReader'

const parsePacketSent = createEventParser(
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
)

const parsePacketDelivered = createEventParser(
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
)

export const PacketSent = createBridgeEventType<{
  guid: string
}>('layerzero-v2.PacketSent')

export const PacketDelivered = createBridgeEventType<{
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

  constructor(private logger: Logger) {}

  capture(input: LogToCapture) {
    const network = NETWORKS.find((b) => b.chain === input.ctx.chain)
    if (!network) {
      this.logger.warn('Network not configured', {
        plugin: this.name,
        ctx: input.ctx,
      })
      return
    }

    const packetSent = parsePacketSent(input.log, [network.address])
    if (packetSent) {
      const packet = decodePacket(packetSent.encodedPayload)
      if (packet) {
        const guid = createLayerZeroGuid(
          packet.header.nonce,
          packet.header.srcEid,
          packet.header.sender,
          packet.header.dstEid,
          packet.header.receiver,
        )

        return PacketSent.create(input.ctx, { guid })
      }
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

      return PacketDelivered.create(input.ctx, { guid })
    }
  }

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!PacketDelivered.checkType(event)) {
      return
    }

    const packetSent = db.find(PacketSent, { guid: event.args.guid })
    if (!packetSent) return

    return {
      messages: [
        {
          type: 'layerzero-v2.Message',
          outbound: packetSent,
          inbound: event,
        },
      ],
    }
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
