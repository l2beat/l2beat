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

const initiateSynthTransferLog =
  'event InitiateSynthTransfer(bytes32 indexed currencyKey, address indexed destination, uint256 amount)'
const finalizeSynthTransferLog =
  'event FinalizeSynthTransfer(bytes32 indexed currencyKey, address indexed destination, uint256 amount)'

const L1_BRIDGE = ChainSpecificAddress(
  'eth:0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F',
)
const L2_BRIDGE = ChainSpecificAddress(
  'oeth:0x136b1EC699c62b0606854056f02dC7Bb80482d63',
)

const L1_SUSD = Address32.from(
  EthereumAddress('0x57Ab1ec28D129707052df4dF418D58a2D46d5f51'),
)
const L2_SUSD = Address32.from(
  EthereumAddress('0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9'),
)

const SUSD_CURRENCY_KEY =
  '0x7355534400000000000000000000000000000000000000000000000000000000'

const InitiateL1 = createInteropEventType<{
  amount: bigint
}>('synthetix-bridge.InitiateL1')

const FinalizeL2 = createInteropEventType<{
  amount: bigint
}>('synthetix-bridge.FinalizeL2')

const InitiateL2 = createInteropEventType<{
  amount: bigint
}>('synthetix-bridge.InitiateL2', {
  ttl: 30 * UnixTime.DAY,
})

const FinalizeL1 = createInteropEventType<{
  amount: bigint
}>('synthetix-bridge.FinalizeL1')

const parseInitiateSynthTransfer = createEventParser(initiateSynthTransferLog)
const parseFinalizeSynthTransfer = createEventParser(finalizeSynthTransferLog)

export class SynthetixBridgePlugin implements InteropPluginResyncable {
  readonly name = 'synthetix-bridge'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: initiateSynthTransferLog,
        addresses: [L1_BRIDGE, L2_BRIDGE],
      },
      {
        type: 'event',
        signature: finalizeSynthTransferLog,
        addresses: [L1_BRIDGE, L2_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const initiate = parseInitiateSynthTransfer(input.log, [
        ChainSpecificAddress.address(L1_BRIDGE),
      ])
      if (initiate?.currencyKey === SUSD_CURRENCY_KEY) {
        return [InitiateL1.create(input, { amount: initiate.amount })]
      }

      const finalize = parseFinalizeSynthTransfer(input.log, [
        ChainSpecificAddress.address(L1_BRIDGE),
      ])
      if (finalize?.currencyKey === SUSD_CURRENCY_KEY) {
        return [FinalizeL1.create(input, { amount: finalize.amount })]
      }
    }

    if (input.chain === 'optimism') {
      const finalize = parseFinalizeSynthTransfer(input.log, [
        ChainSpecificAddress.address(L2_BRIDGE),
      ])
      if (finalize?.currencyKey === SUSD_CURRENCY_KEY) {
        return [FinalizeL2.create(input, { amount: finalize.amount })]
      }

      const initiate = parseInitiateSynthTransfer(input.log, [
        ChainSpecificAddress.address(L2_BRIDGE),
      ])
      if (initiate?.currencyKey === SUSD_CURRENCY_KEY) {
        return [InitiateL2.create(input, { amount: initiate.amount })]
      }
    }
  }

  matchTypes = [FinalizeL2, FinalizeL1]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (FinalizeL2.checkType(event)) {
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 1 },
      })
      if (!relayedMessage) return

      const sentMessage = db.find(SentMessage, {
        chain: 'optimism',
        msgHash: relayedMessage.args.msgHash,
      })
      if (!sentMessage) return

      const initiateL1 = db.find(InitiateL1, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!initiateL1) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'synthetix-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [initiateL1, event],
        }),
        Result.Transfer('synthetix-bridge.L1ToL2Transfer', {
          srcEvent: initiateL1,
          srcAmount: initiateL1.args.amount,
          srcTokenAddress: L1_SUSD,
          srcWasBurned: true,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L2_SUSD,
          dstWasMinted: true,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (FinalizeL1.checkType(event)) {
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAtOffset: { event, offset: 2 },
        chain: 'optimism',
      })
      if (!withdrawalFinalized) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: 'optimism',
      })
      if (!messagePassed) return

      const initiateL2 = db.find(InitiateL2, {
        sameTxAtOffset: { event: messagePassed, offset: 3 },
      })
      if (!initiateL2) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'synthetix-bridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
          extraEvents: [initiateL2, event],
        }),
        Result.Transfer('synthetix-bridge.L2ToL1Transfer', {
          srcEvent: initiateL2,
          srcAmount: initiateL2.args.amount,
          srcTokenAddress: L2_SUSD,
          srcWasBurned: true,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L1_SUSD,
          dstWasMinted: true,
        }),
      ]
    }
  }
}
