import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  MessagePassed,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
} from './opstack/opstack'
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

// == Event signatures ==

const erc20BridgeInitiatedLog =
  'event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)'
const erc20BridgeFinalizedLog =
  'event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)'

// Sky bridge addresses (Base only)
// Supports USDS token
const L1_SKY_BRIDGE = ChainSpecificAddress(
  'eth:0xa5874756416fa632257eea380cabd2e87ced352a',
)
const L2_SKY_BRIDGE = ChainSpecificAddress(
  'base:0xee44cdb68d618d58f75d9fe0818b640bd7b8a7b7',
)

// L1 → L2: ERC20BridgeInitiated from Sky bridge
const DepositBridgeInitiated = createInteropEventType<{
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.DepositBridgeInitiated')

// L2 relay of L1→L2 deposit: ERC20BridgeFinalized from Sky bridge
const DepositBridgeFinalized = createInteropEventType<{
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.DepositBridgeFinalized')

// L2 → L1: ERC20BridgeInitiated from Sky bridge
const WithdrawalBridgeInitiated = createInteropEventType<{
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.WithdrawalBridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20BridgeFinalized from Sky bridge
const WithdrawalBridgeFinalized = createInteropEventType<{
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.WithdrawalBridgeFinalized')

// Event parsers
// Note: on L1 localToken=L1, remoteToken=L2; on L2 localToken=L2, remoteToken=L1
const parseERC20BridgeInitiated = createEventParser(erc20BridgeInitiatedLog)
const parseERC20BridgeFinalized = createEventParser(erc20BridgeFinalizedLog)

export class SkyBridgePlugin implements InteropPluginResyncable {
  readonly name = 'sky-bridge'

  getDataRequests(): DataRequest[] {
    return [
      // L1: ERC20BridgeInitiated, ERC20BridgeFinalized from L1_SKY_BRIDGE
      {
        type: 'event',
        signature: erc20BridgeInitiatedLog,
        addresses: [L1_SKY_BRIDGE],
      },
      {
        type: 'event',
        signature: erc20BridgeFinalizedLog,
        addresses: [L1_SKY_BRIDGE],
      },
      // L2: ERC20BridgeInitiated, ERC20BridgeFinalized from L2_SKY_BRIDGE
      {
        type: 'event',
        signature: erc20BridgeInitiatedLog,
        addresses: [L2_SKY_BRIDGE],
      },
      {
        type: 'event',
        signature: erc20BridgeFinalizedLog,
        addresses: [L2_SKY_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture ERC20BridgeInitiated (L1 → L2 deposit)
      const bridgeInitiated = parseERC20BridgeInitiated(input.log, [
        ChainSpecificAddress.address(L1_SKY_BRIDGE),
      ])
      if (bridgeInitiated) {
        return [
          DepositBridgeInitiated.create(input, {
            amount: bridgeInitiated.amount,
            l1Token: Address32.from(
              EthereumAddress(bridgeInitiated.localToken),
            ),
            l2Token: Address32.from(
              EthereumAddress(bridgeInitiated.remoteToken),
            ),
          }),
        ]
      }

      // L1: Capture ERC20BridgeFinalized (L2 → L1 withdrawal finalization)
      const bridgeFinalized = parseERC20BridgeFinalized(input.log, [
        ChainSpecificAddress.address(L1_SKY_BRIDGE),
      ])
      if (bridgeFinalized) {
        return [
          WithdrawalBridgeFinalized.create(input, {
            amount: bridgeFinalized.amount,
            l1Token: Address32.from(
              EthereumAddress(bridgeFinalized.localToken),
            ),
            l2Token: Address32.from(
              EthereumAddress(bridgeFinalized.remoteToken),
            ),
          }),
        ]
      }
    } else if (input.chain === 'base') {
      // L2: Capture ERC20BridgeFinalized (L1 → L2 deposit relay)
      const bridgeFinalized = parseERC20BridgeFinalized(input.log, [
        ChainSpecificAddress.address(L2_SKY_BRIDGE),
      ])
      if (bridgeFinalized) {
        return [
          DepositBridgeFinalized.create(input, {
            amount: bridgeFinalized.amount,
            l1Token: Address32.from(
              EthereumAddress(bridgeFinalized.remoteToken),
            ),
            l2Token: Address32.from(
              EthereumAddress(bridgeFinalized.localToken),
            ),
          }),
        ]
      }

      // L2: Capture ERC20BridgeInitiated (L2 → L1 withdrawal)
      const bridgeInitiated = parseERC20BridgeInitiated(input.log, [
        ChainSpecificAddress.address(L2_SKY_BRIDGE),
      ])
      if (bridgeInitiated) {
        return [
          WithdrawalBridgeInitiated.create(input, {
            amount: bridgeInitiated.amount,
            l1Token: Address32.from(
              EthereumAddress(bridgeInitiated.remoteToken),
            ),
            l2Token: Address32.from(
              EthereumAddress(bridgeInitiated.localToken),
            ),
          }),
        ]
      }
    }
  }

  matchTypes = [DepositBridgeFinalized, WithdrawalBridgeFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (DepositBridgeFinalized.checkType(event)) {
      // L2: DepositBridgeFinalized → RelayedMessage
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAfter: event,
        chain: 'base',
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage) return

      // L1: SentMessage → DepositBridgeInitiated
      const depositBridgeInitiated = db.find(DepositBridgeInitiated, {
        sameTxAfter: sentMessage,
      })
      if (!depositBridgeInitiated) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'sky-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [depositBridgeInitiated, event],
        }),
        Result.Transfer('sky-bridge.L1ToL2Transfer', {
          srcEvent: depositBridgeInitiated,
          srcAmount: depositBridgeInitiated.args.amount,
          srcTokenAddress: depositBridgeInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (WithdrawalBridgeFinalized.checkType(event)) {
      // L1: WithdrawalBridgeFinalized → WithdrawalFinalized
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAfter: event,
        chain: 'base',
      })
      if (!withdrawalFinalized) return

      // L2: Find MessagePassed by withdrawalHash
      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: 'base',
      })
      if (!messagePassed) return

      // L2: MessagePassed → WithdrawalBridgeInitiated
      const withdrawalBridgeInitiated = db.find(WithdrawalBridgeInitiated, {
        sameTxAfter: messagePassed,
      })
      if (!withdrawalBridgeInitiated) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'sky-bridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
          extraEvents: [withdrawalBridgeInitiated, event],
        }),
        Result.Transfer('sky-bridge.L2ToL1Transfer', {
          srcEvent: withdrawalBridgeInitiated,
          srcAmount: withdrawalBridgeInitiated.args.amount,
          srcTokenAddress: withdrawalBridgeInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }
  }
}
