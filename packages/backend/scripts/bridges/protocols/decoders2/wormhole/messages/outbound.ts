import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../../../chains'
import type { Asset } from '../../../../types/Asset'
import type { DecoderInput } from '../../../../types/DecoderInput'
import type { Message } from '../../../../types/Message'
import { createWormholeSequence } from '../../../../utils/wormhole'

export const WORMHOLE = {
  name: 'wormhole',
  decoder: decoder,
}

const ABI = parseAbi([
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
])

const NETWORKS = [
  {
    chainId: 2,
    chainShortName: 'eth',
    coreBridge: EthereumAddress('0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'),
  },
  {
    chainId: 23,
    chainShortName: 'arb1',
    coreBridge: EthereumAddress('0xa5f208e072434bC67592E4C49C1B991BA79BCA46'),
  },
  {
    chainId: 30,
    chainShortName: 'base',
    coreBridge: EthereumAddress('0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6'),
  },
]

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.coreBridge &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0]
  ) {
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
      type: 'message',
      direction: 'outbound',
      protocol: WORMHOLE.name,
      origin: chain.shortName,
      destination: 'destination',
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'LogMessagePublished',
      matchingId: id,
    }
  }

  return undefined
}
