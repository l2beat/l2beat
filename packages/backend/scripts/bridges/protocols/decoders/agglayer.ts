import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import {
  createAgglayerTransferId,
  decodeGlobalIndex,
} from '../../utils/agglayer'

export const AGGLAYER = {
  name: 'agglayer',
  decoder: decoder,
}

const ABI = parseAbi([
  'event BridgeEvent(uint8 leafType, uint32 originNetwork, address originAddress, uint32 destinationNetwork, address destinationAddress, uint256 amount, bytes metadata, uint32 depositCount)',
  'event ClaimEvent(uint256 globalIndex, uint32 originNetwork, address originAddress, address destinationAddress, uint256 amount)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const bridge = BRIDGES.find((b) => b.chainShortName === chain.shortName)

  if (!bridge) return undefined

  if (
    EthereumAddress(input.log.address) === bridge.address &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'BridgeEvent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'BridgeEvent',
    })

    const transferId = createAgglayerTransferId(
      BigInt(data.args.originNetwork),
      data.args.originAddress,
      data.args.destinationAddress,
      data.args.amount,
      BigInt(data.args.depositCount),
    )

    const destination = BRIDGES.find(
      (b) => b.chainId === data.args.destinationNetwork,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'outbound',
      protocol: AGGLAYER.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationNetwork.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'BridgeEvent',
      matchingId: transferId,
    }
  }

  if (
    EthereumAddress(input.log.address) === bridge.address &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'ClaimEvent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'ClaimEvent',
    })

    const globalIndexDecoded = decodeGlobalIndex(data.args.globalIndex)

    const transferId = createAgglayerTransferId(
      BigInt(data.args.originNetwork),
      data.args.originAddress,
      data.args.destinationAddress,
      data.args.amount,
      globalIndexDecoded.localRootIndex,
    )

    const origin = BRIDGES.find(
      (c) => c.chainId === data.args.originNetwork,
    )?.chainShortName

    return {
      type: 'message',
      direction: 'inbound',
      protocol: AGGLAYER.name,
      origin: origin ?? data.args.originNetwork.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'ClaimEvent',
      matchingId: transferId,
    }
  }

  return undefined
}

const BRIDGES = [
  {
    chainId: 0,
    chainShortName: 'eth',
    address: EthereumAddress('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'),
  },
  {
    chainId: 1,
    chainShortName: 'zkevm',
    address: EthereumAddress('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'),
  },
  {
    chainId: 20,
    chainShortName: 'katana',
    address: EthereumAddress('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'),
  },
]
