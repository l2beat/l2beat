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

// Base's native Base <> Solana bridge. Only the Base side is observable, so
// this plugin emits one-sided transfers with 'solana' as the counterparty.
// Solana-native assets (SOL, SPL tokens) are locked on Solana and minted as
// CrossChainERC20 wrappers on Base; Base-native assets (ETH, ERC20s) are
// escrowed in the Bridge and minted as wrapped SPL on Solana - lockAndMint
// in both directions.
const BASESOL_BRIDGE = ChainSpecificAddress(
  'base:0x3eff766C76a1be2Ce1aCF2B69c78bCae257D5188',
)
const BASESOL_BRIDGE_ADDRESS = ChainSpecificAddress.address(BASESOL_BRIDGE)

// ERC-7528 pseudo-address the bridge uses for native ETH.
const ETH_PSEUDO_ADDRESS = EthereumAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
)

// Both events are emitted by the Bridge with amounts in local (Base) units.
const transferInitializedLog =
  'event TransferInitialized(address localToken, bytes32 remoteToken, bytes32 to, uint256 amount)'
const transferFinalizedLog =
  'event TransferFinalized(address localToken, bytes32 remoteToken, address to, uint256 amount)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseTransferInitialized = createEventParser(transferInitializedLog)
const parseTransferFinalized = createEventParser(transferFinalizedLog)
const parseTransfer = createEventParser(transferLog)

interface BaseSolInitializedArgs {
  $dstChain: 'solana'
  srcAmount: bigint
  srcTokenAddress: Address32
  srcWasBurned: boolean
  remoteToken: `0x${string}`
  recipient: `0x${string}`
}

interface BaseSolFinalizedArgs {
  $srcChain: 'solana'
  dstAmount: bigint
  dstTokenAddress: Address32
  dstWasMinted: boolean
  remoteToken: `0x${string}`
  recipient: EthereumAddress
}

const BaseSolTransferInitialized =
  createInteropEventType<BaseSolInitializedArgs>(
    'basesolbridge.TransferInitialized',
    { direction: 'outgoing' },
  )

const BaseSolTransferFinalized = createInteropEventType<BaseSolFinalizedArgs>(
  'basesolbridge.TransferFinalized',
  { direction: 'incoming' },
)

export class BaseSolBridgePlugin implements InteropPluginResyncable {
  readonly name = 'basesolbridge'

  constructor(private oneSidedChains: string[] = []) {}

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: transferInitializedLog,
        addresses: [BASESOL_BRIDGE],
        includeTxEvents: [transferLog],
      },
      {
        type: 'event',
        signature: transferFinalizedLog,
        addresses: [BASESOL_BRIDGE],
        includeTxEvents: [transferLog],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain !== 'base') return

    const initialized = parseTransferInitialized(input.log, [
      BASESOL_BRIDGE_ADDRESS,
    ])
    if (initialized) {
      const localToken = EthereumAddress(initialized.localToken)
      const isNative = localToken === ETH_PSEUDO_ADDRESS
      const movement = isNative
        ? undefined
        : findTokenMovement(input, localToken, initialized.amount)
      return [
        BaseSolTransferInitialized.create(input, {
          $dstChain: 'solana',
          srcAmount: initialized.amount,
          srcTokenAddress: isNative
            ? Address32.NATIVE
            : Address32.from(localToken),
          // Wrapped SPL tokens returning to Solana are burned; ETH and
          // Base-native ERC20s are escrowed in the Bridge.
          srcWasBurned: movement?.toZero ?? false,
          remoteToken: initialized.remoteToken,
          recipient: initialized.to,
        }),
      ]
    }

    const finalized = parseTransferFinalized(input.log, [
      BASESOL_BRIDGE_ADDRESS,
    ])
    if (finalized) {
      const localToken = EthereumAddress(finalized.localToken)
      const isNative = localToken === ETH_PSEUDO_ADDRESS
      const movement = isNative
        ? undefined
        : findTokenMovement(input, localToken, finalized.amount)
      return [
        BaseSolTransferFinalized.create(input, {
          $srcChain: 'solana',
          dstAmount: finalized.amount,
          dstTokenAddress: isNative
            ? Address32.NATIVE
            : Address32.from(localToken),
          // Solana-native assets are minted as CrossChainERC20 wrappers;
          // ETH and Base-native ERC20s are released from escrow.
          dstWasMinted: movement?.fromZero ?? false,
          remoteToken: finalized.remoteToken,
          recipient: EthereumAddress(finalized.to),
        }),
      ]
    }
  }

  matchTypes = [BaseSolTransferInitialized, BaseSolTransferFinalized]

  match(event: InteropEvent, _db: InteropEventDb): MatchResult | undefined {
    // The Solana side is not a captured event source, so this plugin only
    // ever produces partial transfers gated by the one-sided policy list
    // (see PARTIAL_TRANSFERS.md).
    if (!this.oneSidedChains.includes('solana')) return

    if (BaseSolTransferInitialized.checkType(event)) {
      return [
        Result.Transfer('basesolbridge.Transfer', {
          srcEvent: event,
          dstChain: 'solana',
          srcAmount: event.args.srcAmount,
          srcTokenAddress: event.args.srcTokenAddress,
          srcWasBurned: event.args.srcWasBurned,
          bridgeType: 'lockAndMint',
        }),
      ]
    }

    if (BaseSolTransferFinalized.checkType(event)) {
      return [
        Result.Transfer('basesolbridge.Transfer', {
          srcChain: 'solana',
          dstEvent: event,
          dstAmount: event.args.dstAmount,
          dstTokenAddress: event.args.dstTokenAddress,
          dstWasMinted: event.args.dstWasMinted,
          bridgeType: 'lockAndMint',
        }),
      ]
    }
  }
}

// The Bridge emits the token's burn/mint/lock/release Transfer log right
// before TransferInitialized/TransferFinalized (only a Burn/Mint marker log
// in between), so the closest matching Transfer walking backward belongs to
// this bridge event. Crossing another bridge event means we entered the
// previous message of a relayMessages batch, so the search stops there.
// Fee-on-transfer escrow tokens can have no Transfer matching the emitted
// amount; returning undefined then defaults to the escrow (not burned/minted)
// interpretation, which is correct for such tokens.
function findTokenMovement(
  input: LogToCapture,
  localToken: EthereumAddress,
  amount: bigint,
): { fromZero: boolean; toZero: boolean } | undefined {
  for (const [log] of iterateLogs(
    input.txLogs,
    input.log.logIndex ?? -1,
    'before',
  )) {
    if (
      parseTransferInitialized(log, [BASESOL_BRIDGE_ADDRESS]) ||
      parseTransferFinalized(log, [BASESOL_BRIDGE_ADDRESS])
    ) {
      return undefined
    }

    const transfer = parseTransfer(log, [localToken])
    if (!transfer || transfer.value !== amount) continue
    return {
      fromZero: EthereumAddress(transfer.from) === EthereumAddress.ZERO,
      toZero: EthereumAddress(transfer.to) === EthereumAddress.ZERO,
    }
  }
  return undefined
}
