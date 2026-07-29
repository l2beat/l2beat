import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { findBestTransferLogByExactAmount } from './logScan'
import { getBestEffortBridgeTypeFromPartialSupplyAction } from './partialSupplyActionBridgeType'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// centrifuge uses Layerzero, Axelar, CCIP and Wormhole for messaging

const spokeAddress = EthereumAddress(
  '0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB',
)
const hubHandlerAddress = EthereumAddress(
  '0x0dEFb429B1663698da4bAe3278393F6844c3392C',
)

const spokeAddress32 = Address32.from(spokeAddress)

const initiateTransferSharesLog =
  'event InitiateTransferShares(uint16 centrifugeId, uint64 indexed poolId, bytes16 indexed scId, address indexed sender, bytes32 destinationAddress, uint128 amount)'
const forwardTransferSharesLog =
  'event ForwardTransferShares(uint16 indexed fromCentrifugeId, uint16 indexed toCentrifugeId, uint64 indexed poolId, bytes16 scId, bytes32 receiver, uint128 amount)'
const executeTransferSharesLog =
  'event ExecuteTransferShares(uint64 indexed poolId, bytes16 indexed scId, address indexed receiver, uint128 amount)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseInitiateTransferShares = createEventParser(initiateTransferSharesLog)
const parseForwardTransferShares = createEventParser(forwardTransferSharesLog)
const parseExecuteTransferShares = createEventParser(executeTransferSharesLog)
const parseTransfer = createEventParser(transferLog)

const CENTRIFUGE_NETWORKS = [
  { chain: 'ethereum', centrifugeId: 1 },
  { chain: 'base', centrifugeId: 2 },
  { chain: 'arbitrum', centrifugeId: 3 },
  { chain: 'plumenetwork', centrifugeId: 4 },
  { chain: 'avalanche', centrifugeId: 5 },
  { chain: 'bsc', centrifugeId: 6 },
  { chain: 'solana', centrifugeId: 7 },
  { chain: 'stellar', centrifugeId: 8 },
  { chain: 'hyperevm', centrifugeId: 9 },
  { chain: 'optimism', centrifugeId: 10 },
  { chain: 'monad', centrifugeId: 11 },
  { chain: 'pharos', centrifugeId: 12 },
] as const

export const InitiateTransferShares = createInteropEventType<{
  $dstChain: string
  srcCentrifugeId?: number
  dstCentrifugeId: number
  poolId: bigint
  scId: string
  sender: EthereumAddress
  receiver: string
  amount: bigint
  srcTokenAddress?: Address32
  srcWasBurned?: boolean
}>('centrifuge.InitiateTransferShares', { direction: 'outgoing' })

export const ForwardTransferShares = createInteropEventType<{
  $srcChain: string
  $dstChain: string
  srcCentrifugeId: number
  dstCentrifugeId: number
  poolId: bigint
  scId: string
  receiver: string
  amount: bigint
}>('centrifuge.ForwardTransferShares')

export const ExecuteTransferShares = createInteropEventType<{
  poolId: bigint
  scId: string
  receiver: string
  amount: bigint
  dstTokenAddress?: Address32
  dstWasMinted?: boolean
}>('centrifuge.ExecuteTransferShares', { direction: 'incoming' })

export class CentriFugePlugin implements InteropPluginResyncable {
  readonly name = 'centrifuge'

  constructor(private oneSidedChains: string[] = []) {}

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: initiateTransferSharesLog,
        includeTxEvents: [transferLog],
        addresses: getAddresses(spokeAddress),
      },
      {
        type: 'event',
        signature: forwardTransferSharesLog,
        addresses: getAddresses(hubHandlerAddress),
      },
      {
        type: 'event',
        signature: executeTransferSharesLog,
        includeTxEvents: [transferLog],
        addresses: getAddresses(spokeAddress),
      },
    ]
  }

  capture(input: LogToCapture) {
    const initiateTransferShares = parseInitiateTransferShares(input.log, [
      spokeAddress,
    ])
    if (initiateTransferShares) {
      const transferMatch = findBestTransferLogByExactAmount(
        input.txLogs,
        initiateTransferShares.amount,
        input.log.logIndex ?? -1,
        (log) => parseTransfer(log, null),
        (transfer) =>
          transfer.from === spokeAddress32 && transfer.to === Address32.ZERO,
      )

      return [
        InitiateTransferShares.create(input, {
          $dstChain: findCentrifugeChain(initiateTransferShares.centrifugeId),
          srcCentrifugeId: findCentrifugeId(input.chain),
          dstCentrifugeId: initiateTransferShares.centrifugeId,
          poolId: initiateTransferShares.poolId,
          scId: normalizeBytes(initiateTransferShares.scId),
          sender: EthereumAddress(initiateTransferShares.sender),
          receiver: normalizeBytes(initiateTransferShares.destinationAddress),
          amount: initiateTransferShares.amount,
          srcTokenAddress: transferMatch.transfer?.logAddress,
          srcWasBurned: transferMatch.transfer
            ? transferMatch.transfer.to === Address32.ZERO
            : undefined,
        }),
      ]
    }

    const forwardTransferShares = parseForwardTransferShares(input.log, [
      hubHandlerAddress,
    ])
    if (forwardTransferShares) {
      return [
        ForwardTransferShares.create(input, {
          $srcChain: findCentrifugeChain(
            forwardTransferShares.fromCentrifugeId,
          ),
          $dstChain: findCentrifugeChain(forwardTransferShares.toCentrifugeId),
          srcCentrifugeId: forwardTransferShares.fromCentrifugeId,
          dstCentrifugeId: forwardTransferShares.toCentrifugeId,
          poolId: forwardTransferShares.poolId,
          scId: normalizeBytes(forwardTransferShares.scId),
          receiver: normalizeBytes(forwardTransferShares.receiver),
          amount: forwardTransferShares.amount,
        }),
      ]
    }

    const executeTransferShares = parseExecuteTransferShares(input.log, [
      spokeAddress,
    ])
    if (executeTransferShares) {
      const transferMatch = findBestTransferLogByExactAmount(
        input.txLogs,
        executeTransferShares.amount,
        input.log.logIndex ?? -1,
        (log) => parseTransfer(log, null),
        (transfer) =>
          transfer.from === Address32.ZERO && transfer.to === spokeAddress32,
      )

      return [
        ExecuteTransferShares.create(input, {
          poolId: executeTransferShares.poolId,
          scId: normalizeBytes(executeTransferShares.scId),
          receiver: evmAddressToCentrifugeBytes32(
            executeTransferShares.receiver,
          ),
          amount: executeTransferShares.amount,
          dstTokenAddress: transferMatch.transfer?.logAddress,
          dstWasMinted: transferMatch.transfer
            ? transferMatch.transfer.from === Address32.ZERO
            : undefined,
        }),
      ]
    }
  }

  matchTypes = [ExecuteTransferShares, InitiateTransferShares]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ExecuteTransferShares.checkType(event)) {
      return this.matchExecuted(event, db)
    }

    if (InitiateTransferShares.checkType(event)) {
      return this.matchOneSidedInitiate(event, db)
    }
  }

  private matchExecuted(
    executeTransferShares: InteropEvent<{
      poolId: bigint
      scId: string
      receiver: string
      amount: bigint
      dstTokenAddress?: Address32
      dstWasMinted?: boolean
    }>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const forwardTransferShares = findBestForwardForExecute(
      executeTransferShares,
      db,
    )
    if (!forwardTransferShares) return

    const initiateTransferShares = findBestInitiateForForward(
      forwardTransferShares,
      db,
    )
    if (!initiateTransferShares) {
      const srcChain = forwardTransferShares.args.$srcChain
      if (!this.oneSidedChains.includes(srcChain)) return

      return [
        Result.Transfer('centrifuge.Transfer', {
          srcChain,
          dstEvent: executeTransferShares,
          dstAmount: executeTransferShares.args.amount,
          dstTokenAddress: executeTransferShares.args.dstTokenAddress,
          dstWasMinted: executeTransferShares.args.dstWasMinted,
          bridgeType: getBestEffortBridgeTypeFromPartialSupplyAction({
            srcWasBurned: undefined,
            dstWasMinted: executeTransferShares.args.dstWasMinted,
          }),
          extraEvents: [forwardTransferShares],
        }),
      ]
    }

    return [
      Result.Transfer('centrifuge.Transfer', {
        srcEvent: initiateTransferShares,
        srcAmount: initiateTransferShares.args.amount,
        srcTokenAddress: initiateTransferShares.args.srcTokenAddress,
        srcWasBurned: initiateTransferShares.args.srcWasBurned,
        dstEvent: executeTransferShares,
        dstAmount: executeTransferShares.args.amount,
        dstTokenAddress: executeTransferShares.args.dstTokenAddress,
        dstWasMinted: executeTransferShares.args.dstWasMinted,
        extraEvents: [forwardTransferShares],
      }),
    ]
  }

  private matchOneSidedInitiate(
    initiateTransferShares: InteropEvent<{
      $dstChain: string
      dstCentrifugeId: number
      poolId: bigint
      scId: string
      receiver: string
      amount: bigint
      srcTokenAddress?: Address32
      srcWasBurned?: boolean
    }>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const dstChain = initiateTransferShares.args.$dstChain
    if (!this.oneSidedChains.includes(dstChain)) return

    const forwardTransferShares = findBestForwardForInitiate(
      initiateTransferShares,
      db,
    )
    if (!forwardTransferShares) return

    const hasCounterpart = db.find(ExecuteTransferShares, {
      poolId: forwardTransferShares.args.poolId,
      scId: forwardTransferShares.args.scId,
      receiver: forwardTransferShares.args.receiver,
      amount: forwardTransferShares.args.amount,
      ctx: { chain: dstChain },
    })
    if (hasCounterpart) return

    return [
      Result.Transfer('centrifuge.Transfer', {
        srcEvent: initiateTransferShares,
        dstChain,
        srcAmount: initiateTransferShares.args.amount,
        srcTokenAddress: initiateTransferShares.args.srcTokenAddress,
        srcWasBurned: initiateTransferShares.args.srcWasBurned,
        bridgeType: getBestEffortBridgeTypeFromPartialSupplyAction({
          srcWasBurned: initiateTransferShares.args.srcWasBurned,
          dstWasMinted: undefined,
        }),
        extraEvents: [forwardTransferShares],
      }),
    ]
  }
}

function findBestForwardForExecute(
  executeTransferShares: InteropEvent<{
    poolId: bigint
    scId: string
    receiver: string
    amount: bigint
  }>,
  db: InteropEventDb,
) {
  return closestByTimestamp(
    db.findAll(ForwardTransferShares, {
      $dstChain: executeTransferShares.ctx.chain,
      poolId: executeTransferShares.args.poolId,
      scId: executeTransferShares.args.scId,
      receiver: executeTransferShares.args.receiver,
      amount: executeTransferShares.args.amount,
    }),
    executeTransferShares.ctx.timestamp,
  )
}

function findBestInitiateForForward(
  forwardTransferShares: InteropEvent<{
    $srcChain: string
    $dstChain: string
    dstCentrifugeId: number
    poolId: bigint
    scId: string
    receiver: string
    amount: bigint
  }>,
  db: InteropEventDb,
) {
  return closestByTimestamp(
    db.findAll(InitiateTransferShares, {
      $dstChain: forwardTransferShares.args.$dstChain,
      dstCentrifugeId: forwardTransferShares.args.dstCentrifugeId,
      poolId: forwardTransferShares.args.poolId,
      scId: forwardTransferShares.args.scId,
      receiver: forwardTransferShares.args.receiver,
      amount: forwardTransferShares.args.amount,
      ctx: { chain: forwardTransferShares.args.$srcChain },
    }),
    forwardTransferShares.ctx.timestamp,
  )
}

function findBestForwardForInitiate(
  initiateTransferShares: InteropEvent<{
    $dstChain: string
    dstCentrifugeId: number
    poolId: bigint
    scId: string
    receiver: string
    amount: bigint
  }>,
  db: InteropEventDb,
) {
  return closestByTimestamp(
    db.findAll(ForwardTransferShares, {
      $srcChain: initiateTransferShares.ctx.chain,
      $dstChain: initiateTransferShares.args.$dstChain,
      dstCentrifugeId: initiateTransferShares.args.dstCentrifugeId,
      poolId: initiateTransferShares.args.poolId,
      scId: initiateTransferShares.args.scId,
      receiver: initiateTransferShares.args.receiver,
      amount: initiateTransferShares.args.amount,
    }),
    initiateTransferShares.ctx.timestamp,
  )
}

function closestByTimestamp<T extends InteropEvent>(
  events: T[],
  targetTimestamp: number,
): T | undefined {
  let best: T | undefined
  let bestDelta = Number.POSITIVE_INFINITY
  for (const event of events) {
    const delta = Math.abs(event.ctx.timestamp - targetTimestamp)
    if (delta < bestDelta) {
      best = event
      bestDelta = delta
    }
  }
  return best
}

function getAddresses(address: EthereumAddress) {
  const addresses: ChainSpecificAddress[] = []
  for (const network of CENTRIFUGE_NETWORKS) {
    try {
      addresses.push(ChainSpecificAddress.fromLong(network.chain, address))
    } catch {
      // Chain not supported by ChainSpecificAddress, skip capture.
    }
  }
  return addresses
}

function findCentrifugeChain(centrifugeId: number) {
  return (
    CENTRIFUGE_NETWORKS.find((n) => n.centrifugeId === centrifugeId)?.chain ??
    `Unknown_${centrifugeId}`
  )
}

function findCentrifugeId(chain: string) {
  return CENTRIFUGE_NETWORKS.find((n) => n.chain === chain)?.centrifugeId
}

function normalizeBytes(value: string) {
  return value.toLowerCase()
}

function evmAddressToCentrifugeBytes32(address: string) {
  return `0x${address.slice(2).toLowerCase().padEnd(64, '0')}`
}
