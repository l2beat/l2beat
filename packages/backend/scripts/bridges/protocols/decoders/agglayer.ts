import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeEventLog,
  encodeEventTopics,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import {
  createAgglayerTransferId,
  decodeGlobalIndex,
  isAssetBridging,
} from '../../utils/agglayer'
import { extractAddressFromPadded } from '../../utils/viem'

export const AGGLAYER = {
  name: 'agglayer',
  decoder: decoder,
}

const ABI = parseAbi([
  'event BridgeEvent(uint8 leafType, uint32 originNetwork, address originAddress, uint32 destinationNetwork, address destinationAddress, uint256 amount, bytes metadata, uint32 depositCount)',
  'event ClaimEvent(uint256 globalIndex, uint32 originNetwork, address originAddress, address destinationAddress, uint256 amount)',
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])

async function decoder(
  chain: Chain,
  input: DecoderInput,
  rpc?: RpcClient,
): Promise<Message | Asset | undefined> {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.address &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'BridgeEvent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'BridgeEvent',
    })

    if (!isAssetBridging(BigInt(data.args.leafType))) {
      return undefined
    }

    const transferId = createAgglayerTransferId(
      BigInt(data.args.originNetwork),
      data.args.originAddress,
      data.args.destinationAddress,
      data.args.amount,
      BigInt(data.args.depositCount),
    )

    const destination = NETWORKS.find(
      (b) => b.chainId === data.args.destinationNetwork,
    )?.chainShortName

    const token =
      data.args.originNetwork === network.chainId
        ? data.args.originAddress
        : await getTokenWrappedAddress(
            rpc,
            network.address,
            data.args.originNetwork,
            data.args.originAddress,
            input,
          )

    return {
      type: 'asset',
      direction: 'outbound',
      application: AGGLAYER.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationNetwork.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'BridgeEvent',
      matchingId: transferId,
      amount: data.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.address &&
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

    const origin = globalIndexDecoded.mainnetFlag
      ? 'eth'
      : NETWORKS.find(
          // Rollup Index is equal to Rollup ID - 1
          (c) => c.chainId - 1 === Number(globalIndexDecoded.rollupIndex),
        )?.chainShortName

    const token =
      data.args.originNetwork === network.chainId
        ? data.args.originAddress
        : await getTokenWrappedAddress(
            rpc,
            network.address,
            data.args.originNetwork,
            data.args.originAddress,
            input,
          )

    return {
      type: 'asset',
      direction: 'inbound',
      application: AGGLAYER.name,
      origin: origin ?? data.args.originNetwork.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'ClaimEvent',
      matchingId: transferId,
      amount: data.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  return undefined
}

const NETWORKS = [
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
async function getTokenWrappedAddress(
  rpc: RpcClient | undefined,
  bridge: EthereumAddress,
  originNetwork: number,
  originAddress: `0x${string}`,
  input: DecoderInput,
) {
  assert(rpc)
  const tokenWrappedAddress = await rpc.call(
    {
      to: bridge,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ABI,
          functionName: 'getTokenWrappedAddress',
          args: [originNetwork, originAddress],
        }),
      ),
    },
    input.blockNumber,
  )

  const token = extractAddressFromPadded(tokenWrappedAddress.toString())
  return token
}
