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

const rootPropagatedLog = 'event RootPropagated(uint256 root)'

const WORLD_ID_BRIDGE = ChainSpecificAddress(
  'eth:0xa6d85f3b3be6ff6dc52c3aabe9a35d0ce252b79f',
)

const RootPropagated = createInteropEventType<object>('world-id.RootPropagated')

const parseRootPropagated = createEventParser(rootPropagatedLog)

export class WorldIdPlugin implements InteropPluginResyncable {
  readonly name = 'world-id'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: rootPropagatedLog,
        addresses: [WORLD_ID_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const rootPropagated = parseRootPropagated(input.log, [
        ChainSpecificAddress.address(WORLD_ID_BRIDGE),
      ])
      if (rootPropagated) {
        return [RootPropagated.create(input, {})]
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

      // Find RootPropagated at exact offset from TransactionDeposited
      // Pattern: TransactionDeposited (N) → SentMessage (N+1) → SentMessageExtension1 (N+2) → RootPropagated (N+3)
      const rootPropagated = db.find(RootPropagated, {
        sameTxAtOffset: { event: transactionDeposited, offset: 3 },
      })
      if (!rootPropagated) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'world-id',
          srcEvent: transactionDeposited,
          dstEvent: event,
          extraEvents: [rootPropagated],
        }),
      ]

      if (transactionDeposited.args.mint > 0n) {
        results.push(
          Result.Transfer('world-id.L1ToL2Transfer', {
            srcEvent: transactionDeposited,
            srcAmount: transactionDeposited.args.mint,
            srcTokenAddress: Address32.NATIVE,
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: transactionDeposited.args.mint,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: false,
            extraEvents: [rootPropagated],
          }),
        )
      }

      return results
    }
  }
}
