import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import { createLayerZeroGuid, decodePacket } from '../../utils/layerzero'

export const LAYERZEROV2 = {
  name: 'layerzerov2',
  decoder: decoder,
}

const ABI = parseAbi([
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const endpoint = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!endpoint) return undefined

  if (
    EthereumAddress(input.log.address) === endpoint.address &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketSent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'PacketSent',
    })

    const packet = decodePacket(data.args.encodedPayload)
    if (!packet) {
      console.error(`Failed to decode packet (tx ${input.transactionHash})`)
      return undefined
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

    return {
      type: 'message',
      direction: 'outbound',
      protocol: LAYERZEROV2.name,
      origin: chain.shortName,
      destination: destination ?? packet.header.dstEid.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'PacketSent',
      matchingId: guid,
    }
  }

  if (
    EthereumAddress(input.log.address) === endpoint.address &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'PacketDelivered',
    })

    const origin = NETWORKS.find(
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
      type: 'message',
      direction: 'inbound',
      protocol: LAYERZEROV2.name,
      origin: origin ?? data.args.origin.srcEid.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'PacketDelivered',
      matchingId: guid,
    }
  }

  return undefined
}

const NETWORKS = [
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
