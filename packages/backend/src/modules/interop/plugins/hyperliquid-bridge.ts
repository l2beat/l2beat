import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
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

const HYPERLIQUID_BRIDGE = ChainSpecificAddress(
  'arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7',
)
const ARB_USDC = ChainSpecificAddress(
  'arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
)

const HYPERLIQUID_BRIDGE_ADDRESS =
  ChainSpecificAddress.address(HYPERLIQUID_BRIDGE)
const ARB_USDC_ADDRESS = ChainSpecificAddress.address(ARB_USDC)
const ARB_USDC_TOKEN = Address32.from(ARB_USDC_ADDRESS)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const finalizedWithdrawalLog =
  'event FinalizedWithdrawal(address indexed user, address destination, uint64 usd, uint64 nonce, bytes32 message)'

const parseTransfer = createEventParser(transferLog)
const parseFinalizedWithdrawal = createEventParser(finalizedWithdrawalLog)

interface HyperliquidDepositArgs {
  $dstChain: 'hyperliquid'
  srcAmount: bigint
  srcTokenAddress: Address32
  sender: EthereumAddress
}

interface HyperliquidFinalizedWithdrawalArgs {
  $srcChain: 'hyperliquid'
  dstAmount: bigint
  dstTokenAddress: Address32
  recipient: EthereumAddress
  nonce: bigint
  message: `0x${string}`
}

const HyperliquidDeposit = createInteropEventType<HyperliquidDepositArgs>(
  'hyperliquid-bridge.Deposit',
  { direction: 'outgoing' },
)

const HyperliquidFinalizedWithdrawal =
  createInteropEventType<HyperliquidFinalizedWithdrawalArgs>(
    'hyperliquid-bridge.FinalizedWithdrawal',
    { direction: 'incoming' },
  )

export class HyperliquidBridgePlugin implements InteropPluginResyncable {
  readonly name = 'hyperliquid-bridge'

  constructor(private oneSidedChains: string[] = []) {}

  getDataRequests(): DataRequest[] {
    return [
      { type: 'event', signature: transferLog, addresses: [ARB_USDC] },
      {
        type: 'event',
        signature: finalizedWithdrawalLog,
        addresses: [HYPERLIQUID_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain !== 'arbitrum') return

    const finalizedWithdrawal = parseFinalizedWithdrawal(input.log, [
      HYPERLIQUID_BRIDGE_ADDRESS,
    ])
    if (finalizedWithdrawal) {
      return [
        HyperliquidFinalizedWithdrawal.create(input, {
          $srcChain: 'hyperliquid',
          dstAmount: finalizedWithdrawal.usd,
          dstTokenAddress: ARB_USDC_TOKEN,
          recipient: EthereumAddress(finalizedWithdrawal.destination),
          nonce: finalizedWithdrawal.nonce,
          message: finalizedWithdrawal.message,
        }),
      ]
    }

    const transfer = parseTransfer(input.log, [ARB_USDC_ADDRESS])
    if (!transfer) return
    if (EthereumAddress(transfer.to) !== HYPERLIQUID_BRIDGE_ADDRESS) return

    return [
      HyperliquidDeposit.create(input, {
        $dstChain: 'hyperliquid',
        srcAmount: transfer.value,
        srcTokenAddress: ARB_USDC_TOKEN,
        sender: EthereumAddress(transfer.from),
      }),
    ]
  }

  matchTypes = [HyperliquidDeposit, HyperliquidFinalizedWithdrawal]

  match(event: InteropEvent, _db: InteropEventDb): MatchResult | undefined {
    if (!this.oneSidedChains.includes('hyperliquid')) return

    if (HyperliquidDeposit.checkType(event)) {
      return [
        Result.Transfer('hyperliquid-bridge.Transfer', {
          srcEvent: event,
          dstChain: 'hyperliquid',
          srcAmount: event.args.srcAmount,
          srcTokenAddress: event.args.srcTokenAddress,
          srcWasBurned: false,
          bridgeType: 'lockAndMint',
        }),
      ]
    }

    if (HyperliquidFinalizedWithdrawal.checkType(event)) {
      return [
        Result.Transfer('hyperliquid-bridge.Transfer', {
          srcChain: 'hyperliquid',
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
