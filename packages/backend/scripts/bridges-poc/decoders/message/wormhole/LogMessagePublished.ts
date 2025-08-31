import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import { createWormholeSequence } from '../../../../bridges/utils/wormhole'
import type {
  Decoder,
  DecoderInput,
  DecoderOutput,
} from '../../../types/Decoder'

const ABI = parseAbi([
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
  'function parseTransfer(bytes memory encoded) public pure returns ((uint8 payloadID,uint256 amount,bytes32 tokenAddress,uint16 tokenChain,bytes32 to,uint16 toChain,uint256 fee) memory transfer)',
])

// We need config for ChainId to create ID
const CONFIG = [
  {
    chainId: 2,
    chain: 'ethereum',
  },
  {
    chainId: 23,
    chain: 'arbitrum',
  },
  {
    chainId: 30,
    chain: 'base',
  },
]

export const Wormhole_LogMessagePublished: Decoder = {
  topic: encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0],
  decoder,
}

function decoder(input: DecoderInput): DecoderOutput {
  const network = CONFIG.find((n) => n.chain === input.chain)
  if (!network) return {}

  const data = decodeEventLog({
    abi: ABI,
    data: input.log.data,
    topics: input.log.topics,
    eventName: 'LogMessagePublished',
  })

  const id = createWormholeSequence(
    network.chainId,
    EthereumAddress(data.args.sender),
    data.args.sequence,
  )

  return {
    message: {
      id: id,
      messagingProtocol: 'wormhole',
      txHash: input.transactionHash,
      timestamp: input.blockTimestamp,
      blockNumber: input.blockNumber,

      type: 'Wormhole_Outbound',
      originChain: input.chain,
      sender: data.args.sender,
      payload: data.args.payload,
    },
  }
}
