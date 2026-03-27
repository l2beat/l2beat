import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import { PortalDepositFinalized, TransactionDeposited } from './opstack/opstack'
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

const messageForwardedLog =
  'event MessageForwarded(address indexed gateway, uint256 value, bytes callData)'

const ZKLINK_ARBITRATOR = ChainSpecificAddress(
  'eth:0x1ee09a2caa0813a5183f90f5a6d0e4871f4c6002',
)

const MessageForwarded = createInteropEventType<object>(
  'zklink-nova.MessageForwarded',
)

const parseMessageForwarded = createEventParser(messageForwardedLog)

export class ZklinkNovaPlugin implements InteropPluginResyncable {
  readonly name = 'zklink-nova'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageForwardedLog,
        addresses: [ZKLINK_ARBITRATOR],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const messageForwarded = parseMessageForwarded(input.log, [
        ChainSpecificAddress.address(ZKLINK_ARBITRATOR),
      ])
      if (messageForwarded) {
        return [MessageForwarded.create(input, {})]
      }
    }
  }

  matchTypes = [PortalDepositFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (PortalDepositFinalized.checkType(event)) {
      const transactionDeposited = db.find(TransactionDeposited, {
        sourceHash: event.args.sourceHash,
        chain: event.args.chain,
      })
      if (!transactionDeposited) return

      // Find MessageForwarded at exact offset from TransactionDeposited
      // Pattern: TransactionDeposited (N) → SentMessage (N+1) → SentMessageExtension1 (N+2) → MessageForwarded (N+3)
      const messageForwarded = db.find(MessageForwarded, {
        sameTxAtOffset: { event: transactionDeposited, offset: 3 },
      })
      if (!messageForwarded) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'zklink-nova',
          srcEvent: transactionDeposited,
          dstEvent: event,
          extraEvents: [messageForwarded],
        }),
      ]

      if (transactionDeposited.args.mint > 0n) {
        results.push(
          Result.Transfer('zklink-nova.L1ToL2Transfer', {
            srcEvent: transactionDeposited,
            srcAmount: transactionDeposited.args.mint,
            srcTokenAddress: Address32.NATIVE,
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: transactionDeposited.args.mint,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: false,
            extraEvents: [messageForwarded],
          }),
        )
      }

      return results
    }
  }
}
