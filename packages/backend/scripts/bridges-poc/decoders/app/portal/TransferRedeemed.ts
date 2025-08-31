import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import { extractAddressFromPadded } from '../../../../bridges/utils/viem'
import { createWormholeSequence } from '../../../../bridges/utils/wormhole'
import type {
  Decoder,
  DecoderInput,
  DecoderOutput,
} from '../../../types/Decoder'

const ABI = parseAbi([
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress, uint64 indexed sequence)',
])

export const Portal_TransferRedeemed: Decoder = {
  topic: encodeEventTopics({ abi: ABI, eventName: 'TransferRedeemed' })[0],
  decoder,
}

function decoder(input: DecoderInput): DecoderOutput {
  const data = decodeEventLog({
    abi: ABI,
    data: input.log.data,
    topics: input.log.topics,
    eventName: 'TransferRedeemed',
  })

  const id = createWormholeSequence(
    data.args.emitterChainId,
    EthereumAddress(extractAddressFromPadded(data.args.emitterAddress)),
    data.args.sequence,
  )

  return {
    transfer: {
      id: id,
      app: 'portal',
      txHash: input.transactionHash,
      timestamp: input.blockTimestamp,
      blockNumber: input.blockNumber,

      type: 'Portal_Inbound',
      destinationChain: input.chain,
      wormholeMessageId: id,
    },
  }
}
