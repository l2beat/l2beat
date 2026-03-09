import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import type { TokenMap } from '../engine/match/TokenMap'
import { findParsedAround } from './hyperlane-hwr'
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

const AVALANCHE_BRIDGE_EOA = EthereumAddress(
  '0x8EB8a3b98659Cce290402893d0123abb75E3ab28',
)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const mintLog =
  'event Mint(address to, uint256 amount, address feeAddress, uint256 feeAmount, bytes32 originTxId)'
const unwrapLog = 'event Unwrap(uint256 amount, uint256 chainId)'

const parseTransfer = createEventParser(transferLog)
const parseMint = createEventParser(mintLog)
const parseUnwrap = createEventParser(unwrapLog)

interface AvalancheDepositArgs {
  $dstChain: 'avalanche'
  srcAmount: bigint
  srcTokenAddress: Address32
  sender: EthereumAddress
}

interface AvalancheMintArgs {
  $srcChain: 'ethereum'
  originTxId: `0x${string}`
  feeAmount: bigint
  dstAmount: bigint
  dstTokenAddress: Address32
  recipient: EthereumAddress
}

interface AvalancheBurnArgs {
  $dstChain: 'ethereum'
  srcTokenAddress: Address32
  srcAmount: bigint
  sender: EthereumAddress
  rawChainId?: bigint
}

interface AvalancheWithdrawalArgs {
  $srcChain: 'avalanche'
  dstTokenAddress: Address32
  dstAmount: bigint
  recipient: EthereumAddress
}

export const AvalancheDeposit = createInteropEventType<AvalancheDepositArgs>(
  'avalanche.Deposit',
  {
    direction: 'outgoing',
  },
)

export const AvalancheMint = createInteropEventType<AvalancheMintArgs>(
  'avalanche.Mint',
  {
    direction: 'incoming',
  },
)

export const AvalancheBurn = createInteropEventType<AvalancheBurnArgs>(
  'avalanche.Burn',
  {
    direction: 'outgoing',
  },
)

export const AvalancheWithdrawal =
  createInteropEventType<AvalancheWithdrawalArgs>('avalanche.Withdrawal', {
    direction: 'incoming',
  })

type TransferData = {
  tokenAddress: Address32
  from: EthereumAddress
  to: EthereumAddress
  value: bigint
}

type TokenRelation = 'exact' | 'unknown' | 'mismatch'

type WithdrawalCandidate = {
  burn: InteropEvent<AvalancheBurnArgs>
  feeGapBps: bigint
  timeDelta: number
  tokenRelation: TokenRelation
}

// Drop burns that are too old to plausibly belong to this withdrawal.
const MAX_WITHDRAWAL_DELAY = 1 * UnixTime.DAY
// Prefer very recent burns when ranking candidates.
const STRONG_TIME_WINDOW = 10 * UnixTime.MINUTE
// Keep a wider fallback window when nothing lands in the strong window.
const SECONDARY_TIME_WINDOW = 12 * UnixTime.HOUR
// Treat candidates with nearly identical timing as ambiguous.
const AMBIGUOUS_TIME_DELTA = UnixTime.MINUTE
// Treat candidates with nearly identical fee gaps as ambiguous.
const AMBIGUOUS_FEE_GAP_BPS = 10n
// Basis-point denominator used for fee-gap comparisons.
const BPS = 10_000n

export class AvalanchePlugin implements InteropPluginResyncable {
  readonly name = 'avalanche'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: transferLog,
        addresses: '*',
      },
      {
        type: 'event',
        signature: mintLog,
        includeTxEvents: [transferLog],
        addresses: '*',
      },
      {
        type: 'event',
        signature: unwrapLog,
        includeTxEvents: [transferLog],
        addresses: '*',
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const transfer = parseTransferData(input.log)
      if (!transfer) return

      if (transfer.to === AVALANCHE_BRIDGE_EOA) {
        return [
          AvalancheDeposit.create(input, {
            $dstChain: 'avalanche',
            srcAmount: transfer.value,
            srcTokenAddress: transfer.tokenAddress,
            sender: transfer.from,
          }),
        ]
      }

      if (transfer.from === AVALANCHE_BRIDGE_EOA) {
        return [
          AvalancheWithdrawal.create(input, {
            $srcChain: 'avalanche',
            dstTokenAddress: transfer.tokenAddress,
            dstAmount: transfer.value,
            recipient: transfer.to,
          }),
        ]
      }

      return
    }

    if (input.chain !== 'avalanche') return

    const mint = parseMint(input.log, null)
    if (mint) {
      const tokenAddress = Address32.from(input.log.address)
      const recipient = EthereumAddress(mint.to)
      const hasRecipientTransfer = findMintedTransfer(
        input.txLogs,
        input.log.logIndex ?? -1,
        tokenAddress,
        recipient,
        mint.amount,
      )
      if (!hasRecipientTransfer) return

      if (mint.feeAmount > 0n) {
        const feeTransfer = findMintedTransfer(
          input.txLogs,
          input.log.logIndex ?? -1,
          tokenAddress,
          EthereumAddress(mint.feeAddress),
          mint.feeAmount,
        )
        if (!feeTransfer) return
      }

      return [
        AvalancheMint.create(input, {
          $srcChain: 'ethereum',
          originTxId: mint.originTxId,
          feeAmount: mint.feeAmount,
          dstAmount: mint.amount,
          dstTokenAddress: tokenAddress,
          recipient,
        }),
      ]
    }

    const unwrap = parseUnwrap(input.log, null)
    if (unwrap) {
      const tokenAddress = Address32.from(input.log.address)
      const burnTransfer = findBurnTransfer(
        input.txLogs,
        input.log.logIndex ?? -1,
        tokenAddress,
        unwrap.amount,
      )

      const sender = burnTransfer?.from ?? input.tx.from
      if (!sender) return

      return [
        AvalancheBurn.create(input, {
          $dstChain: 'ethereum',
          srcTokenAddress: tokenAddress,
          srcAmount: burnTransfer?.value ?? unwrap.amount,
          sender: EthereumAddress(sender),
          rawChainId: unwrap.chainId,
        }),
      ]
    }
  }

  matchTypes = [AvalancheMint, AvalancheWithdrawal]

  match(
    event: InteropEvent,
    db: InteropEventDb,
    tokenMap: TokenMap,
  ): MatchResult | undefined {
    if (AvalancheMint.checkType(event)) {
      const deposit = db.find(AvalancheDeposit, {
        ctx: { txHash: event.args.originTxId },
      })
      if (!deposit) return

      return [
        Result.Message('avalanche.Message', {
          app: 'avalanche-bridge',
          srcEvent: deposit,
          dstEvent: event,
        }),
        Result.Transfer('avalanche.Transfer', {
          srcEvent: deposit,
          srcTokenAddress: deposit.args.srcTokenAddress,
          srcAmount: deposit.args.srcAmount,
          srcWasBurned: false,
          dstEvent: event,
          dstTokenAddress: event.args.dstTokenAddress,
          dstAmount: event.args.dstAmount,
          dstWasMinted: true,
          bridgeType: 'lockAndMint',
        }),
      ]
    }

    if (!AvalancheWithdrawal.checkType(event)) return

    const burn = findBestBurnCandidate(event, db, tokenMap)
    if (!burn) return

    return [
      Result.Message('avalanche.Message', {
        app: 'avalanche-bridge',
        srcEvent: burn,
        dstEvent: event,
      }),
      Result.Transfer('avalanche.Transfer', {
        srcEvent: burn,
        srcTokenAddress: burn.args.srcTokenAddress,
        srcAmount: burn.args.srcAmount,
        srcWasBurned: true,
        dstEvent: event,
        dstTokenAddress: event.args.dstTokenAddress,
        dstAmount: event.args.dstAmount,
        dstWasMinted: false,
        bridgeType: 'lockAndMint',
      }),
    ]
  }
}

function parseTransferData(log: LogToCapture['txLogs'][number]) {
  const transfer = parseTransfer(log, null)
  if (!transfer) return

  return {
    tokenAddress: Address32.from(log.address),
    from: EthereumAddress(transfer.from),
    to: EthereumAddress(transfer.to),
    value: transfer.value,
  } satisfies TransferData
}

function findMintedTransfer(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  tokenAddress: Address32,
  recipient: EthereumAddress,
  amount: bigint,
) {
  return findParsedAround(logs, startLogIndex, (log) => {
    const transfer = parseTransferData(log)
    if (!transfer) return
    if (transfer.tokenAddress !== tokenAddress) return
    if (transfer.from !== EthereumAddress.ZERO) return
    if (transfer.to !== recipient) return
    if (transfer.value !== amount) return
    return transfer
  })
}

function findBurnTransfer(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  tokenAddress: Address32,
  amount: bigint,
) {
  return findParsedAround(logs, startLogIndex, (log) => {
    const transfer = parseTransferData(log)
    if (!transfer) return
    if (transfer.tokenAddress !== tokenAddress) return
    if (transfer.to !== EthereumAddress.ZERO) return
    if (transfer.value !== amount) return
    return transfer
  })
}

function findBestBurnCandidate(
  withdrawal: InteropEvent<AvalancheWithdrawalArgs>,
  db: InteropEventDb,
  tokenMap: TokenMap,
) {
  const rawCandidates = db.findAll(AvalancheBurn, {
    sender: withdrawal.args.recipient,
  })

  let candidates = rawCandidates
    .filter((burn) => burn.ctx.timestamp <= withdrawal.ctx.timestamp)
    .filter(
      (burn) =>
        withdrawal.ctx.timestamp - burn.ctx.timestamp <= MAX_WITHDRAWAL_DELAY,
    )
    .filter((burn) => burn.args.srcAmount >= withdrawal.args.dstAmount)
    .map((burn) => createWithdrawalCandidate(burn, withdrawal, tokenMap))
    .filter((candidate) => candidate.tokenRelation !== 'mismatch')

  if (candidates.length === 0) return

  const exactMatches = candidates.filter(
    (candidate) => candidate.tokenRelation === 'exact',
  )
  if (exactMatches.length > 0) {
    candidates = exactMatches
  }

  if (
    candidates.some((candidate) => candidate.timeDelta <= STRONG_TIME_WINDOW)
  ) {
    candidates = candidates.filter(
      (candidate) => candidate.timeDelta <= STRONG_TIME_WINDOW,
    )
  } else if (
    candidates.some((candidate) => candidate.timeDelta <= SECONDARY_TIME_WINDOW)
  ) {
    candidates = candidates.filter(
      (candidate) => candidate.timeDelta <= SECONDARY_TIME_WINDOW,
    )
  }

  candidates.sort(compareWithdrawalCandidates)
  const [best, second] = candidates
  if (!best) return

  if (best.tokenRelation === 'unknown' && best.timeDelta > STRONG_TIME_WINDOW) {
    return
  }

  if (second && isAmbiguous(best, second)) {
    return
  }

  return best.burn
}

function createWithdrawalCandidate(
  burn: InteropEvent<AvalancheBurnArgs>,
  withdrawal: InteropEvent<AvalancheWithdrawalArgs>,
  tokenMap: TokenMap,
): WithdrawalCandidate {
  const feeGap = burn.args.srcAmount - withdrawal.args.dstAmount

  return {
    burn,
    feeGapBps:
      burn.args.srcAmount === 0n ? BPS : (feeGap * BPS) / burn.args.srcAmount,
    timeDelta: withdrawal.ctx.timestamp - burn.ctx.timestamp,
    tokenRelation: getTokenRelation(burn, withdrawal, tokenMap),
  }
}

function compareWithdrawalCandidates(
  a: WithdrawalCandidate,
  b: WithdrawalCandidate,
) {
  const tokenOrder =
    tokenRelationRank(a.tokenRelation) - tokenRelationRank(b.tokenRelation)
  if (tokenOrder !== 0) return tokenOrder

  if (a.feeGapBps !== b.feeGapBps) {
    return a.feeGapBps < b.feeGapBps ? -1 : 1
  }

  return a.timeDelta - b.timeDelta
}

function isAmbiguous(best: WithdrawalCandidate, second: WithdrawalCandidate) {
  return (
    tokenRelationRank(best.tokenRelation) ===
      tokenRelationRank(second.tokenRelation) &&
    absBigInt(best.feeGapBps - second.feeGapBps) <= AMBIGUOUS_FEE_GAP_BPS &&
    Math.abs(best.timeDelta - second.timeDelta) <= AMBIGUOUS_TIME_DELTA
  )
}

function tokenRelationRank(tokenRelation: TokenRelation) {
  switch (tokenRelation) {
    case 'exact':
      return 0
    case 'unknown':
      return 1
    case 'mismatch':
      return 2
  }
}

function getTokenRelation(
  burn: InteropEvent<AvalancheBurnArgs>,
  withdrawal: InteropEvent<AvalancheWithdrawalArgs>,
  tokenMap: TokenMap,
): TokenRelation {
  const srcAbstractTokenId = getAbstractTokenId(
    tokenMap,
    burn.ctx.chain,
    burn.args.srcTokenAddress,
  )
  const dstAbstractTokenId = getAbstractTokenId(
    tokenMap,
    withdrawal.ctx.chain,
    withdrawal.args.dstTokenAddress,
  )

  if (!srcAbstractTokenId || !dstAbstractTokenId) {
    return 'unknown'
  }

  return srcAbstractTokenId === dstAbstractTokenId ? 'exact' : 'mismatch'
}

function getAbstractTokenId(
  tokenMap: TokenMap,
  chain: string,
  tokenAddress: Address32,
) {
  if (tokenAddress === Address32.NATIVE) return

  try {
    return tokenMap.get(
      ChainSpecificAddress.fromLong(
        chain,
        Address32.cropToEthereumAddress(tokenAddress),
      ),
    )?.id
  } catch {
    return
  }
}

function absBigInt(value: bigint) {
  return value >= 0n ? value : -value
}
