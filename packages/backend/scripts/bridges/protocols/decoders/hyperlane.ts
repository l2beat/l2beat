import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'

export const HYPERLANE = {
  name: 'hyperlane',
  decoder: decoder,
}

const ABI = parseAbi([
  'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)',
  'event DispatchId(bytes32 indexed messageId)',
  'event Process(uint32 indexed origin, bytes32 indexed sender, address indexed recipient)',
  'event ProcessId(bytes32 indexed messageId)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.mailbox &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Dispatch' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Dispatch',
    })

    const destination = NETWORKS.find(
      (b) => b.chainId === data.args.destination,
    )?.chainShortName

    const logWithId = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'DispatchId' })[0],
    )
    assert(logWithId, 'DispatchId not emitted')

    const id = decodeEventLog({
      abi: ABI,
      data: logWithId.data,
      topics: logWithId.topics,
      eventName: 'DispatchId',
    }).args.messageId

    return {
      type: 'message',
      direction: 'outbound',
      protocol: HYPERLANE.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destination.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'Dispatch',
      matchingId: id,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.mailbox &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Process' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Process',
    })

    const origin = NETWORKS.find(
      (c) => c.chainId === data.args.origin,
    )?.chainShortName

    const logWithId = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'ProcessId' })[0],
    )
    assert(logWithId, 'DispatchId not emitted')

    const id = decodeEventLog({
      abi: ABI,
      data: logWithId.data,
      topics: logWithId.topics,
      eventName: 'ProcessId',
    }).args.messageId

    return {
      type: 'message',
      direction: 'inbound',
      protocol: HYPERLANE.name,
      origin: origin ?? data.args.origin.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'Process',
      matchingId: id,
    }
  }

  return undefined
}

const NETWORKS = [
  {
    chainId: 1,
    chainShortName: 'eth',
    mailbox: EthereumAddress('0xc005dc82818d67AF737725bD4bf75435d065D239'),
  },
  {
    chainId: 42161,
    chainShortName: 'arb1',
    mailbox: EthereumAddress('0x979Ca5202784112f4738403dBec5D0F3B9daabB9'),
  },
  {
    chainId: 8453,
    chainShortName: 'base',
    mailbox: EthereumAddress('0xeA87ae93Fa0019a82A727bfd3eBd1cFCa8f64f1D'),
  },
]
