import { Address32 } from '@l2beat/shared-pure'
import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import {
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

function findParsedAround<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  parse: (log: LogToCapture['txLogs'][number]) => T | undefined,
): { parsed: T; index: number } | undefined {
  const startPos = logs.findIndex((log) => log.logIndex === startLogIndex)
  if (startPos === -1) return

  for (let offset = 0; offset < logs.length; offset++) {
    const forward = startPos + offset
    if (forward < logs.length) {
      const parsed = parse(logs[forward])
      if (parsed) return { parsed, index: forward }
    }

    if (offset === 0) continue
    const backward = startPos - offset
    if (backward >= 0) {
      const parsed = parse(logs[backward])
      if (parsed) return { parsed, index: backward }
    }
  }
}

export class HyperlaneEcoPlugin implements InteropPlugin {
  name = 'hyperlane-eco'

  capture(input: LogToCapture) {
    const batchSent = parseBatchSent(input.log, null)
    if (batchSent) {
      const dispatchId = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log) => parseDispatchId(log, null),
      )
      if (!dispatchId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(batchSent._sourceChainID), // intended
      )

      return [
        BatchSentDispatch.create(input, {
          messageId: dispatchId.parsed.messageId,
          $dstChain,
        }),
      ]
    }

    const intentProven = parseIntentProven(input.log, null)
    if (intentProven) {
      const processMatch = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log) => parseProcess(log, null),
      )
      console.log('processMatch', processMatch)
      if (!processMatch) return

      const processIdLog = input.txLogs[processMatch.index + 1]
      const processId = processIdLog && parseProcessId(processIdLog, null)
      console.log('processId', processId)
      if (!processId) return

      const $srcChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(processMatch.parsed.origin), // intended
      )

      return [
        IntentProvenProcess.create(input, {
          messageId: processId.messageId,
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
        extraEvents: [batchSentDispatch, event],
      }),
    ]
  }
}
