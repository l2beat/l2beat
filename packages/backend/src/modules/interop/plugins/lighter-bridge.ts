import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { iterateLogs } from './logScan'
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

const LIGHTER_BRIDGE = ChainSpecificAddress(
  'eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7',
)
const LIGHTER_BRIDGE_ADDRESS = ChainSpecificAddress.address(LIGHTER_BRIDGE)

// Lighter contract constants. NATIVE_TICK_SIZE is hardcoded because the ETH
// transfer in `_to.call{value}` emits no log and outer tx.value can be 0
// when routers / 4337 wallets intermediate. Branching on NATIVE_ASSET_INDEX
// also avoids the one multicall edge case position-based attribution can't
// disambiguate (an unrelated `Transfer(_, bridge)` happening to land at
// firstNPR - 1 when our deposit is NATIVE).
const NATIVE_ASSET_INDEX = 1
const NATIVE_TICK_SIZE = 10n ** 10n

const depositLog =
  'event Deposit(uint48 toAccountIndex, address toAddress, uint16 assetIndex, uint8 routeType, uint128 baseAmount)'
const newPriorityRequestLog =
  'event NewPriorityRequest(address sender, uint64 serialId, uint8 pubdataType, bytes pubData, uint64 expirationTimestamp)'
const withdrawPendingLog =
  'event WithdrawPending(address indexed owner, uint16 assetIndex, uint128 baseAmount)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseDeposit = createEventParser(depositLog)
const parseNewPriorityRequest = createEventParser(newPriorityRequestLog)
const parseWithdrawPending = createEventParser(withdrawPendingLog)
const parseTransfer = createEventParser(transferLog)

interface LighterDepositArgs {
  $dstChain: 'lighter'
  srcAmount: bigint
  srcTokenAddress: Address32
  recipient: EthereumAddress
  assetIndex: number
}

interface LighterWithdrawPendingArgs {
  $srcChain: 'lighter'
  dstAmount: bigint
  dstTokenAddress: Address32
  owner: EthereumAddress
  assetIndex: number
}

const LighterDeposit = createInteropEventType<LighterDepositArgs>(
  'lighter-bridge.Deposit',
  { direction: 'outgoing' },
)

const LighterWithdrawPending =
  createInteropEventType<LighterWithdrawPendingArgs>(
    'lighter-bridge.WithdrawPending',
    { direction: 'incoming' },
  )

export class LighterBridgePlugin implements InteropPluginResyncable {
  readonly name = 'lighter-bridge'

  constructor(private oneSidedChains: string[] = []) {}

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: depositLog,
        addresses: [LIGHTER_BRIDGE],
        includeTxEvents: [transferLog],
      },
      {
        type: 'event',
        signature: withdrawPendingLog,
        addresses: [LIGHTER_BRIDGE],
        includeTxEvents: [transferLog],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain !== 'ethereum') return

    const deposit = parseDeposit(input.log, [LIGHTER_BRIDGE_ADDRESS])
    if (deposit) {
      const assetIndex = Number(deposit.assetIndex)
      const resolved =
        assetIndex === NATIVE_ASSET_INDEX
          ? {
              srcTokenAddress: Address32.NATIVE,
              srcAmount: deposit.baseAmount * NATIVE_TICK_SIZE,
            }
          : resolveErc20DepositToken(input, assetIndex, deposit.baseAmount)
      // Skip the event entirely on resolution failure rather than emit
      // wrong data; a malformed log stream means we can't trust the amount.
      if (!resolved) return
      return [
        LighterDeposit.create(input, {
          $dstChain: 'lighter',
          srcAmount: resolved.srcAmount,
          srcTokenAddress: resolved.srcTokenAddress,
          recipient: EthereumAddress(deposit.toAddress),
          assetIndex,
        }),
      ]
    }

    const withdraw = parseWithdrawPending(input.log, [LIGHTER_BRIDGE_ADDRESS])
    if (withdraw) {
      const owner = EthereumAddress(withdraw.owner)
      const assetIndex = Number(withdraw.assetIndex)
      const resolved =
        assetIndex === NATIVE_ASSET_INDEX
          ? {
              dstTokenAddress: Address32.NATIVE,
              dstAmount: withdraw.baseAmount * NATIVE_TICK_SIZE,
            }
          : resolveErc20WithdrawToken(input, withdraw.baseAmount, owner)
      if (!resolved) return
      return [
        LighterWithdrawPending.create(input, {
          $srcChain: 'lighter',
          dstAmount: resolved.dstAmount,
          dstTokenAddress: resolved.dstTokenAddress,
          owner,
          assetIndex,
        }),
      ]
    }
  }

  matchTypes = [LighterDeposit, LighterWithdrawPending]

  match(event: InteropEvent, _db: InteropEventDb): MatchResult | undefined {
    // Plugin only ever produces partial transfers since Lighter L2 is not a
    // captured event source; gate on the policy list (see PARTIAL_TRANSFERS.md).
    if (!this.oneSidedChains.includes('lighter')) return

    if (LighterDeposit.checkType(event)) {
      return [
        Result.Transfer('lighter-bridge.Transfer', {
          srcEvent: event,
          dstChain: 'lighter',
          srcAmount: event.args.srcAmount,
          srcTokenAddress: event.args.srcTokenAddress,
          srcWasBurned: false,
          bridgeType: 'lockAndMint',
        }),
      ]
    }

    if (LighterWithdrawPending.checkType(event)) {
      return [
        Result.Transfer('lighter-bridge.Transfer', {
          srcChain: 'lighter',
          dstEvent: event,
          dstAmount: event.args.dstAmount,
          dstTokenAddress: event.args.dstTokenAddress,
          dstWasMinted: false,
          bridgeType: 'lockAndMint',
        }),
      ]
    }
  }
}

// ERC20 `_deposit` emits a strict alternation `[NewPriorityRequest, Deposit]`
// per recipient, with a single `Transfer` immediately before the first
// NewPriorityRequest. Position-based matching follows the
// NewPriorityRequest-Deposit pattern backward to find our batch's first
// NewPriorityRequest, then reads the slot at `firstNewPriorityRequest - 1`
// for the Transfer. NATIVE deposits never reach this function (caller
// short-circuits on assetIndex).
function resolveErc20DepositToken(
  input: LogToCapture,
  assetIndex: number,
  baseAmount: bigint,
): { srcTokenAddress: Address32; srcAmount: bigint } | undefined {
  const startLogIndex = input.log.logIndex ?? -1
  let firstNewPriorityRequestLogIndex: number | undefined
  let sumBase = baseAmount

  let expectNewPriorityRequest = true
  for (const [log] of iterateLogs(input.txLogs, startLogIndex, 'before')) {
    if (EthereumAddress(log.address) !== LIGHTER_BRIDGE_ADDRESS) continue
    if (expectNewPriorityRequest) {
      const newPriorityRequest = parseNewPriorityRequest(log, [
        LIGHTER_BRIDGE_ADDRESS,
      ])
      if (!newPriorityRequest) break
      firstNewPriorityRequestLogIndex =
        log.logIndex ?? firstNewPriorityRequestLogIndex
      expectNewPriorityRequest = false
    } else {
      const sibling = parseDeposit(log, [LIGHTER_BRIDGE_ADDRESS])
      if (!sibling || Number(sibling.assetIndex) !== assetIndex) break
      sumBase += sibling.baseAmount
      expectNewPriorityRequest = true
    }
  }

  // Forward walk catches sibling Deposits emitted after us (we may not be
  // the last recipient in the batch).
  expectNewPriorityRequest = true
  for (const [log] of iterateLogs(input.txLogs, startLogIndex, 'after')) {
    if (EthereumAddress(log.address) !== LIGHTER_BRIDGE_ADDRESS) continue
    if (expectNewPriorityRequest) {
      const newPriorityRequest = parseNewPriorityRequest(log, [
        LIGHTER_BRIDGE_ADDRESS,
      ])
      if (!newPriorityRequest) break
      expectNewPriorityRequest = false
    } else {
      const sibling = parseDeposit(log, [LIGHTER_BRIDGE_ADDRESS])
      if (!sibling || Number(sibling.assetIndex) !== assetIndex) break
      sumBase += sibling.baseAmount
      expectNewPriorityRequest = true
    }
  }

  if (firstNewPriorityRequestLogIndex !== undefined) {
    const transferLogEntry = input.txLogs.find(
      (l) => l.logIndex === firstNewPriorityRequestLogIndex - 1,
    )
    if (transferLogEntry) {
      const transfer = parseTransfer(transferLogEntry, null)
      // Sanity guard: Transfer.value should equal `sumBase × tickSize`, so it
      // must be a clean positive multiple of sumBase. A non-multiple means we
      // grabbed the wrong Transfer (or the contract misbehaved).
      if (
        transfer &&
        EthereumAddress(transfer.to) === LIGHTER_BRIDGE_ADDRESS &&
        transfer.value > 0n &&
        transfer.value % sumBase === 0n
      ) {
        return {
          srcTokenAddress: Address32.from(
            EthereumAddress(transferLogEntry.address),
          ),
          srcAmount: (transfer.value * baseAmount) / sumBase,
        }
      }
    }
  }

  // `_deposit` always emits the Transfer at firstNPR - 1 for ERC20 calls;
  // reaching here means the log stream doesn't match the contract's emit
  // pattern. Caller drops the event rather than emit a wrong amount.
  return undefined
}

// ERC20 `withdrawPendingBalance` emits exactly one Transfer immediately
// followed by `WithdrawPending`. The position-based check at `WP - 1` with
// the `from=bridge AND to=owner` predicate makes attribution exact even
// when a relayer batches multiple claims in one tx. NATIVE withdrawals
// never reach this function (caller short-circuits on assetIndex).
function resolveErc20WithdrawToken(
  input: LogToCapture,
  baseAmount: bigint,
  owner: EthereumAddress,
): { dstTokenAddress: Address32; dstAmount: bigint } | undefined {
  const wpLogIndex = input.log.logIndex ?? -1
  const transferLogEntry = input.txLogs.find(
    (l) => l.logIndex === wpLogIndex - 1,
  )
  if (transferLogEntry) {
    const transfer = parseTransfer(transferLogEntry, null)
    // Sanity guard: Transfer.value should equal `baseAmount × tickSize`, so
    // it must be a clean positive multiple of baseAmount.
    if (
      transfer &&
      EthereumAddress(transfer.from) === LIGHTER_BRIDGE_ADDRESS &&
      EthereumAddress(transfer.to) === owner &&
      transfer.value > 0n &&
      transfer.value % baseAmount === 0n
    ) {
      return {
        dstTokenAddress: Address32.from(
          EthereumAddress(transferLogEntry.address),
        ),
        dstAmount: transfer.value,
      }
    }
  }

  return undefined
}
