import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeEventTopics,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import { extractAddressFromPadded } from '../../../../bridges/utils/viem'
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
// TokenBride is optional and in the future can be removed when we implement our own parseTransfer function
const NETWORKS = [
  {
    chainId: 2,
    chain: 'ethereum',
    tokenBridge: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'),
  },
  {
    chainId: 23,
    chain: 'arbitrum',
    tokenBridge: EthereumAddress('0x0b2402144Bb366A632D14B83F244D2e0e21bD39c'),
  },
  {
    chainId: 30,
    chain: 'base',
    tokenBridge: EthereumAddress('0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627'),
  },
]

export const Portal_LogMessagePublished: Decoder = {
  topic: encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0],
  decoder,
}

async function decoder(
  input: DecoderInput,
  rpc?: RpcClient,
): Promise<DecoderOutput> {
  const network = NETWORKS.find((n) => n.chain === input.chain)
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

  assert(rpc)
  //parseTransferWithPayload not yet supported
  //to support it we would need to check method signature from calldata
  const call = await rpc.call(
    {
      to: network.tokenBridge,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ABI,
          functionName: 'parseTransfer',
          args: [data.args.payload],
        }),
      ),
    },
    input.blockNumber,
  )

  const wormholeTransfer = decodeFunctionResult({
    abi: ABI,
    data: call.toString() as Hex,
    functionName: 'parseTransfer',
  })

  return {
    transfer: {
      id: id,
      app: 'portal',
      direction: 'outbound',
      timestamp: input.blockTimestamp,
      txHash: input.transactionHash,

      originChain: input.chain,
      // originToken: string
      originAmount: wormholeTransfer.amount,

      // destinationChain?: string
      destinationToken: extractAddressFromPadded(wormholeTransfer.tokenAddress),
      destinationAmount: wormholeTransfer.amount,

      type: 'LogMessagePublished',
    },
  }
}
