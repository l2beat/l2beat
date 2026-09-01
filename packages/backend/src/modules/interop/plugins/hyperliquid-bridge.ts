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
const HYPEREVM_USDC = ChainSpecificAddress(
  'hyperevm:0xb88339CB7199b77E23DB6E890353E22632Ba630f',
)
const HYPEREVM_CORE_DEPOSIT_WALLET = ChainSpecificAddress(
  'hyperevm:0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24',
)

const HYPERLIQUID_BRIDGE_ADDRESS =
  ChainSpecificAddress.address(HYPERLIQUID_BRIDGE)
const ARB_USDC_ADDRESS = ChainSpecificAddress.address(ARB_USDC)
const ARB_USDC_TOKEN = Address32.from(ARB_USDC_ADDRESS)
const HYPEREVM_CORE_DEPOSIT_WALLET_ADDRESS = ChainSpecificAddress.address(
  HYPEREVM_CORE_DEPOSIT_WALLET,
)
const HYPEREVM_TOKEN_SYSTEM_ADDRESS = EthereumAddress(
  '0x2000000000000000000000000000000000000000',
)
export const HYPEREVM_USDC_TOKEN = Address32.from(
  ChainSpecificAddress.address(HYPEREVM_USDC),
)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const finalizedWithdrawalLog =
  'event FinalizedWithdrawal(address indexed user, address destination, uint64 usd, uint64 nonce, bytes32 message)'
const withdrawLog = 'event Withdraw(address indexed to, uint256 value)'

const parseTransfer = createEventParser(transferLog)
const parseFinalizedWithdrawal = createEventParser(finalizedWithdrawalLog)
const parseWithdraw = createEventParser(withdrawLog)

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

interface HyperliquidCoreDepositArgs {
  $dstChain: 'hyperliquid'
  srcAmount: bigint
  srcTokenAddress: Address32
  recipient: EthereumAddress
}

interface HyperliquidCoreWithdrawalArgs {
  $srcChain: 'hyperliquid'
  dstAmount: bigint
  dstTokenAddress: Address32
  recipient: EthereumAddress
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

const HyperliquidCoreDeposit =
  createInteropEventType<HyperliquidCoreDepositArgs>(
    'hyperliquid-bridge.CoreDeposit',
    { direction: 'outgoing' },
  )

const HyperliquidCoreWithdrawal =
  createInteropEventType<HyperliquidCoreWithdrawalArgs>(
    'hyperliquid-bridge.CoreWithdrawal',
    { direction: 'incoming' },
  )

export class HyperliquidBridgePlugin implements InteropPluginResyncable {
  readonly name = 'hyperliquid-bridge'

  constructor(private oneSidedChains: string[] = []) {}

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: transferLog,
        addresses: [ARB_USDC, HYPEREVM_CORE_DEPOSIT_WALLET],
      },
      {
        type: 'event',
        signature: finalizedWithdrawalLog,
        addresses: [HYPERLIQUID_BRIDGE],
      },
      {
        type: 'event',
        signature: withdrawLog,
        addresses: [HYPEREVM_CORE_DEPOSIT_WALLET],
      },
    ]
  }

  capture(input: LogToCapture): Omit<InteropEvent, 'plugin'>[] | undefined {
    if (input.chain === 'hyperevm') {
      return this.captureHyperevm(input)
    }

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

  private captureHyperevm(input: LogToCapture) {
    const transfer = parseTransfer(input.log, [
      HYPEREVM_CORE_DEPOSIT_WALLET_ADDRESS,
    ])
    if (transfer) {
      if (EthereumAddress(transfer.to) !== HYPEREVM_TOKEN_SYSTEM_ADDRESS) {
        return
      }

      return [
        HyperliquidCoreDeposit.create(input, {
          $dstChain: 'hyperliquid',
          srcAmount: transfer.value,
          srcTokenAddress: HYPEREVM_USDC_TOKEN,
          recipient: EthereumAddress(transfer.from),
        }),
      ]
    }

    const withdraw = parseWithdraw(input.log, [
      HYPEREVM_CORE_DEPOSIT_WALLET_ADDRESS,
    ])
    if (withdraw) {
      return [
        HyperliquidCoreWithdrawal.create(input, {
          $srcChain: 'hyperliquid',
          dstAmount: withdraw.value,
          dstTokenAddress: HYPEREVM_USDC_TOKEN,
          recipient: EthereumAddress(withdraw.to),
        }),
      ]
    }
  }

  matchTypes = [
    HyperliquidDeposit,
    HyperliquidFinalizedWithdrawal,
    HyperliquidCoreDeposit,
    HyperliquidCoreWithdrawal,
  ]

  match(event: InteropEvent, _db: InteropEventDb): MatchResult | undefined {
    if (!this.oneSidedChains.includes('hyperliquid')) return

    if (
      HyperliquidDeposit.checkType(event) ||
      HyperliquidCoreDeposit.checkType(event)
    ) {
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

    if (
      HyperliquidFinalizedWithdrawal.checkType(event) ||
      HyperliquidCoreWithdrawal.checkType(event)
    ) {
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
