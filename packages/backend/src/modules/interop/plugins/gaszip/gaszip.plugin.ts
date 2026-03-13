/**
 * gaszip (standalone) plugin based on tx calldata in addition to logs
 * good API available at https://backend.gas.zip/v2/search/TXHASH for checking
 */

import type { Logger } from '@l2beat/backend-tools'
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
  type TxToCapture,
} from '../types'
import {
  DEPOSIT_CONTRACT_ADDRESS,
  DEPOSIT_EOA_ADDRESS,
  GASZIP_NETWORKS,
  getChainNameByGaszipId,
} from './gaszip.config'
import { decodeGasZipDeposit, extractFirstTwentyHex } from './gaszip.decoder'

const parseDeposit = createEventParser(
  'event Deposit(address from, uint256 chains, uint256 amount, bytes32 to)',
)

interface GasZipDepositArgs {
  $dstChain: string
  depositor: Address32
  amount: bigint
  tokenAddress: Address32
  depositType: string
  destinationChains: string
  destinationAddress?: Address32
}

interface GasZipFillArgs {
  receiver: Address32
  amount: bigint
  tokenAddress: Address32
}

type GasZipDepositEvent = InteropEvent<GasZipDepositArgs>
type GasZipFillEvent = InteropEvent<GasZipFillArgs>
type GasZipCandidate = {
  deposit: GasZipDepositEvent
  timeDelta: number
  amountDelta?: bigint
}

const GASZIP_AMOUNT_TOLERANCE_UP = 0.1 // see examples, 5% was too low
const GASZIP_AMOUNT_TOLERANCE_DOWN = 0.03 // for some reason some fills are more
const TOLERANCE_PRECISION = 10_000n

export const GasZipDeposit = createInteropEventType<GasZipDepositArgs>(
  'gaszip.Deposit',
  { direction: 'outgoing' },
)

export const GasZipFill = createInteropEventType<GasZipFillArgs>(
  'gaszip.Fill',
  { direction: 'incoming' },
)

export class GasZipPlugin implements InteropPlugin {
  readonly name = 'gaszip'

  constructor(private logger: Logger) {}

  captureTx(input: TxToCapture) {
    const network = getGasZipNetwork(input.chain)
    if (!network) return

    if (input.tx.to === DEPOSIT_EOA_ADDRESS) {
      let decoded
      try {
        decoded = decodeGasZipDeposit((input.tx.data ?? '0x') as string)
      } catch (_error) {
        return
      }
      if (decoded.destinationChainIds.length === 0) return
      if (!input.tx.value || input.tx.value === 0n) return
      if (!input.tx.from) return

      const destinationChains = decoded.destinationChainIds.map((gaszipId) => ({
        gaszipId,
        chain: getChainNameByGaszipId(gaszipId),
      }))

      const destinationAddress =
        decoded.destinationAddress ?? Address32.from(input.tx.from)
      const events = []

      for (const dc of destinationChains) {
        events.push(
          GasZipDeposit.createTx(input, {
            $dstChain: dc.chain,
            depositor: Address32.from(input.tx.from),
            amount: (input.tx.value ?? 0n) / BigInt(destinationChains.length),
            tokenAddress: Address32.NATIVE,
            depositType: decoded.type,
            destinationChains: JSON.stringify(destinationChains),
            destinationAddress,
          }),
        )
      }
      return events
    }
    if (input.tx.from && EthereumAddress(input.tx.from) === network.solver) {
      return [
        GasZipFill.createTx(input, {
          receiver: input.tx.to ? Address32.from(input.tx.to) : Address32.ZERO,
          amount: input.tx.value ?? 0n,
          tokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }

  capture(input: LogToCapture) {
    const network = getGasZipNetwork(input.chain)
    if (!network) {
      return
    }

    const deposit = parseDeposit(input.log, [DEPOSIT_CONTRACT_ADDRESS])
    if (!deposit) return

    // Decode the chains parameter (packed as 16-bit values)
    const chainIds: number[] = []
    let remaining = deposit.chains
    while (remaining > 0n) {
      const chainId = Number(remaining & 0xffffn)
      chainIds.push(chainId)
      remaining = remaining >> 16n
    }
    chainIds.reverse() // Reverse to get original order

    if (chainIds.length === 0) return

    const destinationChains = chainIds.map((gaszipId) => ({
      gaszipId,
      chain: getChainNameByGaszipId(gaszipId),
    }))

    const events = []
    for (const dc of destinationChains) {
      events.push(
        GasZipDeposit.create(input, {
          $dstChain: dc.chain,
          depositor: Address32.from(deposit.from),
          amount: deposit.amount / BigInt(destinationChains.length),
          tokenAddress: Address32.NATIVE,
          depositType: 'CONTRACT',
          destinationChains: JSON.stringify(destinationChains),
          destinationAddress: Address32.from(extractFirstTwentyHex(deposit.to)),
        }),
      )
    }
    return events
  }
  matchTypes = [GasZipFill]
  match(gasZipFill: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!GasZipFill.checkType(gasZipFill)) return

    const gasZipDeposit = findMatchingDeposit(gasZipFill, db)
    if (!gasZipDeposit) return

    return [
      Result.Message('gaszip.Message', {
        app: 'gaszip',
        srcEvent: gasZipDeposit,
        dstEvent: gasZipFill,
      }),
      Result.Transfer('gaszip.Transfer', {
        srcEvent: gasZipDeposit,
        srcTokenAddress: gasZipDeposit.args.tokenAddress,
        srcAmount: BigInt(gasZipDeposit.args.amount),
        srcWasBurned: false,
        dstEvent: gasZipFill,
        dstTokenAddress: gasZipFill.args.tokenAddress,
        dstAmount: BigInt(gasZipFill.args.amount),
        dstWasMinted: false,
      }),
    ]
  }
}

function getGasZipNetwork(chain: string) {
  return GASZIP_NETWORKS.find((network) => network.chain === chain)
}

// Split candidates into amount-comparable (who use the same token) and
// fallback buckets, then pick the
// most plausible earlier source transfer for this fill.
function findMatchingDeposit(
  fill: GasZipFillEvent,
  db: InteropEventDb,
): GasZipDepositEvent | undefined {
  const destination = getGasZipNetwork(fill.ctx.chain)
  if (!destination) return

  const comparableCandidates: GasZipCandidate[] = []
  const fallbackCandidates: GasZipCandidate[] = []

  for (const deposit of db.findAll(GasZipDeposit, {
    $dstChain: fill.ctx.chain,
    destinationAddress: fill.args.receiver,
  })) {
    const candidate = createCandidate(deposit, fill, destination)
    if (!candidate) continue

    if (candidate.amountDelta !== undefined) {
      comparableCandidates.push(candidate)
    } else {
      fallbackCandidates.push(candidate)
    }
  }

  if (comparableCandidates.length > 0) {
    comparableCandidates.sort(compareComparableCandidates)
    return comparableCandidates[0]?.deposit
  }

  fallbackCandidates.sort(compareFallbackCandidates)
  return fallbackCandidates[0]?.deposit
}

// Reject impossible source events and compute the ranking fields used by the
// matcher. Custom-gas routes skip amount comparison entirely.
function createCandidate(
  deposit: GasZipDepositEvent,
  fill: GasZipFillEvent,
  destination: (typeof GASZIP_NETWORKS)[number],
): GasZipCandidate | undefined {
  if (deposit.ctx.timestamp > fill.ctx.timestamp) return

  const timeDelta = fill.ctx.timestamp - deposit.ctx.timestamp
  const source = getGasZipNetwork(deposit.ctx.chain)

  if (!source || destination.customGas || source.customGas) {
    return { deposit, timeDelta }
  }

  if (!matchesApproximateAmount(deposit.args.amount, fill.args.amount)) {
    return
  }

  return {
    deposit,
    timeDelta,
    amountDelta: absBigInt(deposit.args.amount - fill.args.amount),
  }
}

function matchesApproximateAmount(depositAmount: bigint, fillAmount: bigint) {
  const minValue =
    fillAmount -
    (fillAmount * BigInt(Math.floor(GASZIP_AMOUNT_TOLERANCE_DOWN * 10_000))) /
      TOLERANCE_PRECISION
  const maxValue =
    fillAmount +
    (fillAmount * BigInt(Math.floor(GASZIP_AMOUNT_TOLERANCE_UP * 10_000))) /
      TOLERANCE_PRECISION

  return depositAmount >= minValue && depositAmount <= maxValue
}

// For normal gas routes, prefer the closest earlier source event and only use
// amount proximity as a tie-breaker.
function compareComparableCandidates(a: GasZipCandidate, b: GasZipCandidate) {
  if (a.timeDelta !== b.timeDelta) {
    return a.timeDelta - b.timeDelta
  }

  if (a.amountDelta === b.amountDelta) {
    return 0
  }

  if (a.amountDelta === undefined) return 1
  if (b.amountDelta === undefined) return -1
  return a.amountDelta < b.amountDelta ? -1 : 1
}

// For custom-gas routes, timing is the only reliable ranking signal.
function compareFallbackCandidates(a: GasZipCandidate, b: GasZipCandidate) {
  return a.timeDelta - b.timeDelta
}

function absBigInt(value: bigint) {
  return value >= 0n ? value : -value
}
