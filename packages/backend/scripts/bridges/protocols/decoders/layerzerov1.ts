import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import {
  createLayerZeroGuid,
  createV1PacketId,
  decodeV1Packet,
  decodeV1SendUln301Packet,
} from '../../utils/layerzero'

export const LAYERZEROV1 = {
  name: 'layerzerov1',
  decoder: decoder,
}

const ABI = parseAbi([
  // UltraLightNodeV2
  'event Packet(bytes payload)',
  'event PacketReceived(uint16 indexed srcChainId, bytes srcAddress, address indexed dstAddress, uint64 nonce, bytes32 payloadHash)',
  // SendUln301
  'event PacketSent(bytes encodedPayload, bytes options, uint256 nativeFee, uint256 lzTokenFee)',
  // ReceiveUln301
  'event PacketDelivered((uint32 srcEid, bytes32 sender, uint64 nonce) origin, address receiver)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)
  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.ultraLightNode &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Packet' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Packet',
    })

    const decodedPacket = decodeV1Packet(data.args.payload)
    if (!decodedPacket) {
      console.error(`Failed to decode packet (tx ${input.transactionHash})`)
      return undefined
    }

    const packetId = createV1PacketId(
      decodedPacket.nonce,
      decodedPacket.localChainId,
      decodedPacket.ua,
      decodedPacket.dstChainId,
      decodedPacket.dstAddress,
    )

    const destination = NETWORKS.find(
      (b) => b.eid === decodedPacket.dstChainId,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'outbound',
      protocol: LAYERZEROV1.name,
      origin: chain.shortName,
      destination: destination ?? decodedPacket.dstChainId.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'Packet',
      matchingId: packetId,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.ultraLightNode &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketReceived' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'PacketReceived',
    })

    const dstChainId = network.eid
    assert(dstChainId)

    const packetId = createV1PacketId(
      data.args.nonce,
      data.args.srcChainId,
      data.args.dstAddress, // This is actually the UA (User Application)
      dstChainId,
      data.args.dstAddress,
    )

    const origin = NETWORKS.find(
      (c) => c.eid === data.args.srcChainId,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'inbound',
      protocol: LAYERZEROV1.name,
      origin: origin ?? data.args.srcChainId.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'PacketReceived',
      matchingId: packetId,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.sendUln &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketSent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'PacketSent',
    })

    const decodedPacket = decodeV1SendUln301Packet(data.args.encodedPayload)
    if (!decodedPacket) {
      console.error(`Failed to decode packet (tx ${input.transactionHash})`)
      return undefined
    }

    const guid = createLayerZeroGuid(
      decodedPacket.header.nonce,
      decodedPacket.header.srcEid,
      decodedPacket.header.sender,
      decodedPacket.header.dstEid,
      decodedPacket.header.receiver,
    )

    const destination = NETWORKS.find(
      (b) => b.eid === decodedPacket.header.dstEid,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'outbound',
      protocol: LAYERZEROV1.name,
      origin: chain.shortName,
      destination: destination ?? decodedPacket.header.dstEid.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'PacketSent',
      matchingId: guid,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.receiveUln &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'PacketDelivered',
    })

    const dstChainId = network.eid
    assert(dstChainId)

    const packetId = createLayerZeroGuid(
      BigInt(data.args.origin.srcEid),
      Number(data.args.origin.sender),
      data.args.origin.nonce.toString(),
      dstChainId,
      data.args.receiver,
    )

    const origin = NETWORKS.find(
      (c) => c.eid === data.args.origin.srcEid,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'inbound',
      protocol: LAYERZEROV1.name,
      origin: origin ?? data.args.origin.srcEid.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'PacketDelivered',
      matchingId: packetId,
    }
  }

  return undefined
}

const NETWORKS = [
  {
    chainId: 1,
    eid: 101,
    chainShortName: 'eth',
    ultraLightNode: EthereumAddress(
      '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
    ),
    sendUln: EthereumAddress('0xD231084BfB234C107D3eE2b22F97F3346fDAF705'),
    receiveUln: EthereumAddress('0x245B6e8FFE9ea5Fc301e32d16F66bD4C2123eEfC'),
  },
  {
    chainId: 42161,
    eid: 110,
    chainShortName: 'arb1',
    ultraLightNode: EthereumAddress(
      '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
    ),
    sendUln: EthereumAddress('0x5cDc927876031B4Ef910735225c425A7Fc8efed9'),
    receiveUln: EthereumAddress('0xe4DD168822767C4342e54e6241f0b91DE0d3c241'),
  },
  {
    chainId: 8453,
    eid: 184,
    chainShortName: 'base',
    ultraLightNode: EthereumAddress(
      '0x38dE71124f7a447a01D67945a51eDcE9FF491251',
    ),
    sendUln: EthereumAddress('0x9DB3714048B5499Ec65F807787897D3b3Aa70072'),
    receiveUln: EthereumAddress('0x58D53a2d6a08B72a15137F3381d21b90638bd753'),
  },
]
