import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'

export const STARGATE = {
  name: 'stargate',
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
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.lzEndpoint &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketSent' })[0]
  ) {
    const oftSentLog = input.transactionLogs.find(
      (l) =>
        EthereumAddress(l.address) === network.stargatePoolUsdc &&
        l.topics[0] ===
          encodeEventTopics({ abi: ABI, eventName: 'OFTSent' })[0],
    )

    if (!oftSentLog) {
      return undefined
    }
    const data = decodeEventLog({
      abi: ABI,
      data: oftSentLog.data,
      topics: oftSentLog.topics,
      eventName: 'OFTSent',
    })

    const destination = NETWORKS.find(
      (b) => b.eid === data.args.dstEid,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: STARGATE.name,
      origin: chain.shortName,
      destination: destination ?? data.args.dstEid.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'OFTSent',
      matchingId: data.args.guid,
      amount: data.args.amountSentLD,
      token: network.usdc,
      // messageProtocol: 'layerzerov2',
      // messageId: data.args.guid,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.lzEndpoint &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
  ) {
    const oftReceivedLog = input.transactionLogs.find(
      (l) =>
        EthereumAddress(l.address) === network.stargatePoolUsdc &&
        l.topics[0] ===
          encodeEventTopics({ abi: ABI, eventName: 'OFTReceived' })[0],
    )
    if (!oftReceivedLog) {
      return undefined
    }
    const data = decodeEventLog({
      abi: ABI,
      data: oftReceivedLog.data,
      topics: oftReceivedLog.topics,
      eventName: 'OFTReceived',
    })

    const origin = NETWORKS.find(
      (c) => c.eid === data.args.srcEid,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'inbound',
      application: STARGATE.name,
      origin: origin ?? data.args.srcEid.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'OFTReceived',
      matchingId: data.args.guid,
      amount: data.args.amountReceivedLD,
      token: network.usdc,
      // messageProtocol: 'layerzerov2',
      // messageId: data.args.guid,
    }
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
