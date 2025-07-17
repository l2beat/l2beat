import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Message } from '../../types/Message'
import type { TransactionWithViemLogs } from '../../types/TransactionWithViemLogs'
import { createLayerZeroGuid, decodePacket } from '../../utils/layerzero'

export const LAYERZEROV2 = {
  name: 'layerzerov2',
  decoder: decoder,
}

function decoder(
  chain: Chain,
  transaction: TransactionWithViemLogs,
): Message | undefined {
  for (const log of transaction.logs) {
    const endpoint = ENDPOINTS.find((b) => b.chainShortName === chain.shortName)

    if (!endpoint || EthereumAddress(log.address) !== endpoint.address) continue

    if (
      EthereumAddress(log.address) === endpoint.address &&
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

      const destination = ENDPOINTS.find(
        (b) => b.chainId === packet.header.dstEid,
      )?.chainShortName

      const guid = createLayerZeroGuid(
        packet.header.nonce,
        packet.header.srcEid,
        packet.header.sender,
        packet.header.dstEid,
        packet.header.receiver,
      )

      return {
        direction: 'outbound',
        protocol: LAYERZEROV2.name,
        origin: chain.shortName,
        destination: destination ?? packet.header.dstEid.toString(),
        blockTimestamp: transaction.blockTimestamp,
        blockNumber: transaction.blockNumber,
        txHash: transaction.hash,
        type: 'PacketSent',
        matchingId: guid,
      }
    }

    if (
      EthereumAddress(log.address) === endpoint.address &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'PacketDelivered',
      })

      const origin = ENDPOINTS.find(
        (c) => c.eid === data.args.origin.srcEid,
      )?.chainShortName

      const guid = createLayerZeroGuid(
        data.args.origin.nonce,
        data.args.origin.srcEid,
        data.args.origin.sender,
        endpoint.eid,
        data.args.receiver,
      )

      return {
        direction: 'inbound',
        protocol: LAYERZEROV2.name,
        origin: origin ?? data.args.origin.srcEid.toString(),
        destination: chain.shortName,
        blockTimestamp: transaction.blockTimestamp,
        blockNumber: transaction.blockNumber,
        txHash: transaction.hash,
        type: 'PacketDelivered',
        matchingId: guid,
      }
    }
  }

  return undefined
}

const ABI = parseAbi([
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
])

const ENDPOINTS = [
  {
    chainId: 1,
    eid: 30101,
    chainShortName: 'eth',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chainShortName: 'arb1',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chainShortName: 'base',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
]
