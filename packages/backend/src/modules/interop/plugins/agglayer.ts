import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { findParsedAround } from './hyperlane-hwr'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const BRIDGE_ADDRESS = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' // assume: same on all networks

interface AgglayerNetwork {
  networkId: number
  chain: string
  bridge: ChainSpecificAddress
}

const AGGLAYER_NETWORKS = defineNetworks<AgglayerNetwork>('agglayer', [
  {
    networkId: 0,
    chain: 'ethereum',
    bridge: ChainSpecificAddress(`eth:${BRIDGE_ADDRESS}`),
  },
  {
    networkId: 20,
    chain: 'katana',
    bridge: ChainSpecificAddress(`katana:${BRIDGE_ADDRESS}`),
  },
  // TODO: add forknet RPC
  // {
  //   networkId: 22,
  //   chain: 'forknet',
  //   bridge: ChainSpecificAddress(`forknet:${BRIDGE_ADDRESS}`),
  // },
])

function getNetworkById(networkId: number): AgglayerNetwork | undefined {
  return AGGLAYER_NETWORKS.find((n) => n.networkId === networkId)
}

function getNetworkByChain(chain: string): AgglayerNetwork | undefined {
  return AGGLAYER_NETWORKS.find((n) => n.chain === chain)
}

function toNumber(value: number | bigint): number {
  return typeof value === 'bigint' ? Number(value) : value
}

const GLOBAL_INDEX_MAINNET_FLAG = 1n << 64n
const GLOBAL_INDEX_DEPOSIT_COUNT_MASK = (1n << 32n) - 1n

function encodeGlobalIndex(localNetwork: number, depositCount: bigint): bigint {
  if (localNetwork === 0) return GLOBAL_INDEX_MAINNET_FLAG + depositCount
  return (BigInt(localNetwork - 1) << 32n) + depositCount
}

function decodeGlobalIndex(globalIndex: bigint): {
  originNetwork: number
  depositCount: bigint
} {
  const depositCount = globalIndex & GLOBAL_INDEX_DEPOSIT_COUNT_MASK
  if ((globalIndex & GLOBAL_INDEX_MAINNET_FLAG) !== 0n) {
    return { originNetwork: 0, depositCount }
  }
  return {
    originNetwork:
      Number((globalIndex >> 32n) & GLOBAL_INDEX_DEPOSIT_COUNT_MASK) + 1,
    depositCount,
  }
}

const bridgeEventLog =
  'event BridgeEvent(uint8 leafType, uint32 originNetwork, address originAddress, uint32 destinationNetwork, address destinationAddress, uint256 amount, bytes metadata, uint32 depositCount)'

const claimEventLog =
  'event ClaimEvent(uint256 globalIndex, uint32 originNetwork, address originAddress, address destinationAddress, uint256 amount)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseBridgeEvent = createEventParser(bridgeEventLog)
const parseClaimEvent = createEventParser(claimEventLog)
const parseTransfer = createEventParser(transferLog)
const ASSET_LEAF_TYPE = 0

const AgglayerBridgeEvent = createInteropEventType<{
  matchId: string
  globalIndex: bigint
  leafType: number
  originNetwork: number
  destinationNetwork: number
  // leafType=0 -> origin token address (0x00 for gas token), leafType=1 -> message sender
  originAddress: EthereumAddress
  // recipient on destination chain
  destinationAddress: EthereumAddress
  amount: bigint
  srcTokenAddress?: Address32
  srcWasBurned?: boolean
  metadata?: `0x${string}`
  $dstChain: string
}>('agglayer.BridgeEvent', { direction: 'outgoing', ttl: 30 * UnixTime.DAY })

const AgglayerClaimEvent = createInteropEventType<{
  matchId: string
  globalIndex: bigint
  originNetwork: number
  $srcChain: string
  // origin chain address: token (leafType=0) or sender (leafType=1)
  originAddress: EthereumAddress
  destinationAddress: EthereumAddress
  amount: bigint
  dstTokenAddress?: Address32
  dstWasMinted?: boolean
}>('agglayer.ClaimEvent', { direction: 'incoming', ttl: 30 * UnixTime.DAY })

export class AgglayerPlugin implements InteropPluginResyncable {
  readonly name = 'agglayer'

  getDataRequests(): DataRequest[] {
    const bridges = AGGLAYER_NETWORKS.map((n) => n.bridge)
    return [
      {
        type: 'event',
        signature: bridgeEventLog,
        addresses: bridges,
      },
      {
        type: 'event',
        signature: claimEventLog,
        includeTxEvents: [transferLog],
        addresses: bridges,
      },
    ]
  }

  capture(input: LogToCapture) {
    const bridge = parseBridgeEvent(input.log, null)
    if (bridge) {
      const localNetwork = getNetworkByChain(input.chain)
      if (!localNetwork) return
      const assetOriginNetworkId = toNumber(bridge.originNetwork)
      const destinationNetworkId = toNumber(bridge.destinationNetwork)
      const assetOriginNetwork = getNetworkById(assetOriginNetworkId)
      const destinationNetwork = getNetworkById(destinationNetworkId)
      if (!assetOriginNetwork || !destinationNetwork) return

      const depositCount = BigInt(bridge.depositCount)
      const globalIndex = encodeGlobalIndex(
        localNetwork.networkId,
        depositCount,
      )

      const leafType = toNumber(bridge.leafType)
      const originAddress = EthereumAddress(bridge.originAddress)
      const destinationAddress = EthereumAddress(bridge.destinationAddress)
      const baseArgs = {
        matchId: globalIndex.toString(),
        globalIndex,
        leafType,
        originNetwork: assetOriginNetworkId,
        destinationNetwork: destinationNetworkId,
        originAddress,
        destinationAddress,
        amount: bridge.amount,
        metadata: bridge.metadata,
        $dstChain: destinationNetwork.chain,
      } as const

      if (leafType !== ASSET_LEAF_TYPE) {
        return [AgglayerBridgeEvent.create(input, baseArgs)]
      }

      const isBridgeOnAssetOriginNetwork =
        localNetwork.networkId === assetOriginNetworkId
      let srcTokenAddress: Address32 | undefined = isBridgeOnAssetOriginNetwork
        ? originAddress === EthereumAddress.ZERO
          ? Address32.NATIVE
          : Address32.from(originAddress)
        : undefined
      let srcWasBurned: boolean | undefined
      if (bridge.amount > 0n) {
        const transferInfo = findParsedAround(
          input.txLogs,
          input.log.logIndex ?? -1,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (!transfer || transfer.value !== bridge.amount) return
            return {
              address: Address32.from(log.address),
              burned: Address32.from(transfer.to) === Address32.ZERO,
            }
          },
        )
        if (!srcTokenAddress) {
          srcTokenAddress = transferInfo?.address
        }
        srcWasBurned = transferInfo?.burned
        // no transfer event and asset leaftype
        if (!srcTokenAddress) {
          srcTokenAddress = Address32.NATIVE
          srcWasBurned = localNetwork.chain !== 'ethereum'
        }
      }

      return [
        AgglayerBridgeEvent.create(input, {
          ...baseArgs,
          srcTokenAddress,
          srcWasBurned,
        }),
      ]
    }

    const claim = parseClaimEvent(input.log, null)
    if (claim) {
      const originNetworkId = toNumber(claim.originNetwork)
      const assetOriginNetwork = getNetworkById(originNetworkId)
      const destinationNetwork = getNetworkByChain(input.chain)
      if (!assetOriginNetwork || !destinationNetwork) return

      const globalIndex = BigInt(claim.globalIndex)
      const decodedGlobalIndex = decodeGlobalIndex(globalIndex)
      const messageOriginNetwork = getNetworkById(
        decodedGlobalIndex.originNetwork,
      )
      if (!messageOriginNetwork) return

      const originAddress = EthereumAddress(claim.originAddress)
      const destinationAddress = EthereumAddress(claim.destinationAddress)
      const baseArgs = {
        matchId: globalIndex.toString(),
        globalIndex,
        originNetwork: originNetworkId,
        $srcChain: messageOriginNetwork.chain,
        originAddress,
        destinationAddress,
        amount: claim.amount,
      } as const

      // ClaimEvent does not expose leafType; amount==0 is the message-only fast path.
      if (claim.amount === 0n) {
        return [AgglayerClaimEvent.create(input, baseArgs)]
      }

      let dstTokenAddress: Address32 | undefined
      const transferInfo = findParsedAround(
        input.txLogs,
        input.log.logIndex ?? -1,
        (log) => {
          const transfer = parseTransfer(log, null)
          if (!transfer || transfer.value !== claim.amount) return
          if (EthereumAddress(transfer.to) !== destinationAddress) return
          return {
            address: Address32.from(log.address),
            minted: Address32.from(transfer.from) === Address32.ZERO,
          }
        },
      )
      dstTokenAddress = transferInfo?.address
      let dstWasMinted = transferInfo?.minted

      // no transfer event and asset leaftype
      if (!dstTokenAddress) {
        dstTokenAddress = Address32.NATIVE
        dstWasMinted = destinationNetwork.chain !== 'ethereum'
      }

      return [
        AgglayerClaimEvent.create(input, {
          ...baseArgs,
          dstTokenAddress,
          dstWasMinted,
        }),
      ]
    }
  }

  matchTypes = [AgglayerClaimEvent]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!AgglayerClaimEvent.checkType(event)) return
    const claim = event

    const bridge = db.find(AgglayerBridgeEvent, {
      matchId: claim.args.matchId,
      $dstChain: claim.ctx.chain,
    })
    if (!bridge) return

    const isAssetTransfer = bridge.args.leafType === 0

    const results: MatchResult = [
      Result.Message('agglayer.Message', {
        app: isAssetTransfer ? 'canonical-asset' : 'canonical-message',
        srcEvent: bridge,
        dstEvent: claim,
      }),
    ]

    if (isAssetTransfer) {
      results.push(
        Result.Transfer('agglayer.Transfer', {
          srcEvent: bridge,
          srcTokenAddress: bridge.args.srcTokenAddress,
          srcAmount: bridge.args.amount,
          srcWasBurned: bridge.args.srcWasBurned,
          dstEvent: claim,
          dstTokenAddress: claim.args.dstTokenAddress,
          dstAmount: claim.args.amount,
          dstWasMinted: claim.args.dstWasMinted,
        }),
      )
    }

    return results
  }
}
