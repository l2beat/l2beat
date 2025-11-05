import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/**
 * INTENT SETTLEMENT PLUGIN (not fill)
 * This plugin tracks the 'Hyperprover' contract which *settles*
 * intents on the 'eco' protocol via the hyperlane message bridge.
 * 'proving' here just refers to messaging / settling
 * we are tracking the fill as the origin and the settlement as the destination
 */

const parseBatchSent = createEventParser(
  'event BatchSent(bytes32[] indexed _hashes, uint256 indexed _sourceChainID)',
)

const parseIntentProven = createEventParser(
  'event IntentProven(bytes32 indexed _hash, address indexed _claimant)',
)

const BatchSentDispatch = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
}>('hyperlane-eco.BatchSentDispatch')

const IntentProvenProcess = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
  recipient: Address32 // claimant
}>('hyperlane-eco.IntentProvenProcess')

export class HyperlaneEcoPlugin implements InteropPlugin {
  name = 'hyperlane-eco'

  capture(input: LogToCapture) {
    const batchSent = parseBatchSent(input.log, null)
    if (batchSent) {
      const nextnextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 2,
      )
      const dispatchId = nextnextLog && parseDispatchId(nextnextLog, null)
      if (!dispatchId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(batchSent._sourceChainID), // intended
      )

      return [
        BatchSentDispatch.create(input.ctx, {
          messageId: dispatchId.messageId,
          $dstChain,
        }),
      ]
    }

    const intentProven = parseIntentProven(input.log, null)
    if (intentProven) {
      const previousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 1,
      )
      const dispatchId = previousLog && parseProcessId(previousLog, null)
      if (!dispatchId) return

      const previouspreviousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 2,
      )
      const process =
        previouspreviousLog && parseProcess(previouspreviousLog, null)
      if (!process) return

      const $srcChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(process.origin), // intended
      )

      return [
        IntentProvenProcess.create(input.ctx, {
          messageId: dispatchId.messageId,
          $srcChain,
          recipient: Address32.from(intentProven._claimant),
        }),
      ]
    }
  }

  matchTypes = [IntentProvenProcess]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!IntentProvenProcess.checkType(event)) return

    const batchSentDispatch = db.find(BatchSentDispatch, {
      messageId: event.args.messageId,
    })
    if (!batchSentDispatch) return

    const dispatch = db.find(Dispatch, {
      messageId: event.args.messageId,
    })
    if (!dispatch) {
      return
    }

    const process = db.find(Process, {
      messageId: event.args.messageId,
    })
    if (!process) {
      return
    }

    return [
      Result.Message('hyperlane.Message', {
        app: 'eco',
        srcEvent: dispatch,
        dstEvent: process,
      }),
      Result.Transfer('hyperlaneEco.Transfer', {
        // TODO: intent settlement, not really transfer (but we need to consume the events)
        srcEvent: batchSentDispatch,
        dstEvent: event,
      }),
    ]
  }
}
