/* Note - as opposed to V2 where message events are emitted by the endpoint contract
   in V1 they are emitted by send/receive library contracts.
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parsePacketSent = createEventParser(
  'event PacketSent(bytes encodedPayload, bytes options, uint256 nativeFee, uint256 lzTokenFee)',
)

const parsePacketDelivered = createEventParser(
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
)

export const PacketSent = createBridgeEventType<{
  $dstChain: string
  guid: string
}>('layerzero-v1.PacketSent')

export const PacketDelivered = createBridgeEventType<{
  $srcChain: string
  guid: string
}>('layerzero-v1.PacketDelivered')

const LAYERZERO_NETWORKS = defineNetworks('layerzero', [
  {
    chainId: 1,
    eid: 101,
    chain: 'ethereum',
    sendLib: EthereumAddress('0xD231084BfB234C107D3eE2b22F97F3346fDAF705'),
    receiveLib: EthereumAddress('0x245B6e8FFE9ea5Fc301e32d16F66bD4C2123eEfC'),
  },
  {
    chainId: 42161,
    eid: 110,
    chain: 'arbitrum',
    sendLib: EthereumAddress('0x5cDc927876031B4Ef910735225c425A7Fc8efed9'),
    receiveLib: EthereumAddress('0xe4DD168822767C4342e54e6241f0b91DE0d3c241'),
  },
  {
    chainId: 8453,
    eid: 184,
    chain: 'base',
    sendLib: EthereumAddress('0x9DB3714048B5499Ec65F807787897D3b3Aa70072'),
    receiveLib: EthereumAddress('0x58D53a2d6a08B72a15137F3381d21b90638bd753'),
  },
])

export class LayerZeroV1Plugin implements BridgePlugin {
  name = 'layerzero-v1'

  capture(input: LogToCapture) {
    const network = LAYERZERO_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const packetSent = parsePacketSent(input.log, [network.sendLib])
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
        LAYERZERO_NETWORKS.find((x) => x.eid === packet.header.dstEid)?.chain ??
        'unknown'
      return PacketSent.create(input.ctx, { $dstChain, guid })
    }

    const packetDelivered = parsePacketDelivered(input.log, [
      network.receiveLib,
    ])
    if (packetDelivered) {
      const guid = createLayerZeroGuid(
        packetDelivered.origin.nonce,
        packetDelivered.origin.srcEid,
        packetDelivered.origin.sender,
        network.eid,
        packetDelivered.receiver,
      )
      const $srcChain =
        LAYERZERO_NETWORKS.find((x) => x.eid === packetDelivered.origin.srcEid)
          ?.chain ?? 'unknown'
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
      Result.Message('layerzero-v1.Message', [packetSent, packetDelivered]),
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
