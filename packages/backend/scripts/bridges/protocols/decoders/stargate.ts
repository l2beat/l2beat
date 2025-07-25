import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { Message } from '../../types/Message'
import type { TransactionWithLogs } from '../../types/TransactionWithLogs'
import { createLayerZeroGuid, decodePacket } from '../../utils/layerzero'

export const STARGATE = {
  name: 'stargate',
  messagingLayer: 'layerzerov2',
  decoder: decoder,
}

const ABI = parseAbi([
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
])

function decoder(
  chain: Chain,
  transaction: TransactionWithLogs,
): Partial<{ message: Message; asset: Asset }> | undefined {
  let message: Message | undefined = undefined
  let asset: Asset | undefined = undefined

  for (const log of transaction.logs) {
    const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

    if (!network) continue

    if (
      EthereumAddress(log.address) === network.lzEndpoint &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'PacketSent' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'PacketSent',
      })

      const packet = decodePacket(data.args.encodedPayload)
      if (!packet) {
        console.error(`Failed to decode packet (tx ${transaction.hash})`)
        continue
      }

      const destination = NETWORKS.find(
        (b) => b.eid === packet.header.dstEid,
      )?.chainShortName

      const guid = createLayerZeroGuid(
        packet.header.nonce,
        packet.header.srcEid,
        packet.header.sender,
        packet.header.dstEid,
        packet.header.receiver,
      )

      message = {
        direction: 'outbound',
        protocol: STARGATE.messagingLayer,
        origin: chain.shortName,
        destination: destination ?? packet.header.dstEid.toString(),
        blockTimestamp: transaction.blockTimestamp,
        txHash: transaction.hash,
        type: 'PacketSent',
        matchingId: guid,
      }
      continue
    }

    if (
      EthereumAddress(log.address) === network.stargatePoolUsdc &&
      log.topics[0] === encodeEventTopics({ abi: ABI, eventName: 'OFTSent' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'OFTSent',
      })

      const destination = NETWORKS.find(
        (b) => b.eid === data.args.dstEid,
      )?.chainShortName

      asset = {
        direction: 'outbound',
        application: STARGATE.name,
        origin: chain.shortName,
        destination: destination ?? data.args.dstEid.toString(),
        blockTimestamp: transaction.blockTimestamp,
        txHash: transaction.hash,
        type: 'OFTSent',
        matchingId: data.args.guid,
        amount: data.args.amountSentLD,
        token: network.usdc,
      }
      continue
    }

    if (
      EthereumAddress(log.address) === network.lzEndpoint &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'PacketDelivered',
      })

      const origin = NETWORKS.find(
        (c) => c.eid === data.args.origin.srcEid,
      )?.chainShortName

      const guid = createLayerZeroGuid(
        data.args.origin.nonce,
        data.args.origin.srcEid,
        data.args.origin.sender,
        network.eid,
        data.args.receiver,
      )

      message = {
        direction: 'inbound',
        protocol: STARGATE.messagingLayer,
        origin: origin ?? data.args.origin.srcEid.toString(),
        destination: chain.shortName,
        blockTimestamp: transaction.blockTimestamp,
        txHash: transaction.hash,
        type: 'PacketDelivered',
        matchingId: guid,
      }
      continue
    }

    if (
      EthereumAddress(log.address) === network.stargatePoolUsdc &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'OFTReceived' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'OFTReceived',
      })

      const origin = NETWORKS.find(
        (c) => c.eid === data.args.srcEid,
      )?.chainShortName

      asset = {
        direction: 'inbound',
        application: STARGATE.name,
        origin: origin ?? data.args.srcEid.toString(),
        destination: chain.shortName,
        blockTimestamp: transaction.blockTimestamp,
        txHash: transaction.hash,
        type: 'OFTReceived',
        matchingId: data.args.guid,
        amount: data.args.amountReceivedLD,
        token: network.usdc,
      }
      continue
    }
  }

  if (message && asset) {
    return { message, asset }
  }

  return undefined
}

const NETWORKS = [
  {
    chainId: 1,
    eid: 30101,
    chainShortName: 'eth',
    lzEndpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
    stargatePoolUsdc: EthereumAddress(
      '0xc026395860Db2d07ee33e05fE50ed7bD583189C7',
    ),
    usdc: EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chainShortName: 'arb1',
    lzEndpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
    stargatePoolUsdc: EthereumAddress(
      '0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
    ),
    usdc: EthereumAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chainShortName: 'base',
    lzEndpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
    stargatePoolUsdc: EthereumAddress(
      '0x27a16dc786820B16E5c9028b75B99F6f604b5d26',
    ),
    usdc: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
  },
]
