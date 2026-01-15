import { Address32 } from '@l2beat/shared-pure'
import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import { findParsedAround } from './hyperlane-hwr'
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
 * This plugin tracks Hyperlane Eco contracts which *settle*
 * intents on the via the hyperlane message bridge.
 * 'proving' here just refers to messaging / settling
 * we are tracking the fill as the origin and the settlement as the destination
 *
 * there are 3 paths to settlement:
 * 1. HyperBatched: Queues the proof to be sent later in a group (BatchSent event on old contract, IntentProven (source) on new)
 * 2. HyperInstant: Immediately sends a message via Hyperlane to the Source Chain (HyperInstantFulfillment event on old contract, IntentProven (source) on new)
 * 3. Storage: Relies on standard storage proofs (no message back needed)
 *
 * we only track 1 and 2 as hyperlane messages, and an old IntentProven
 *
 * the new 'portal' contract can also sent via other bridges than hyperlane
 */

const parseBatchSent = createEventParser(
  'event BatchSent(bytes32[] indexed _hashes, uint256 indexed _sourceChainID)',
)

const parseIntentProvenSource = createEventParser(
  'event IntentProven(bytes32 indexed intentHash, bytes32 indexed claimant)',
)

const parseIntentProvenDestinationLegacy = createEventParser(
  'event IntentProven(bytes32 indexed _hash, address indexed _claimant)',
)

const parseIntentProvenDestination = createEventParser(
  'event IntentProven(bytes32 indexed intentHash, address indexed _claimant, uint64 destination)',
)

const parseHyperInstantFulfillment = createEventParser(
  'event HyperInstantFulfillment(bytes32 indexed _hash, uint256 indexed _sourceChainID, address indexed _claimant)',
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
  readonly name = 'hyperlane-eco'

  capture(input: LogToCapture) {
    const batchSent = parseBatchSent(input.log, null)
    const hyperInstantFulfillment = parseHyperInstantFulfillment(
      input.log,
      null,
    )
    const intentProvenSource = parseIntentProvenSource(input.log, null)
    if (batchSent || intentProvenSource || hyperInstantFulfillment) {
      const dispatch = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, index) => {
          const dispatch = parseDispatch(log, null)
          if (!dispatch) return
          return { parsed: dispatch, index }
        },
      )
      if (!dispatch) return

      const dispatchIdLog = input.txLogs[dispatch.index + 1]
      const dispatchId = dispatchIdLog && parseDispatchId(dispatchIdLog, null)
      if (!dispatchId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(dispatch.parsed.destination),
      )

      return [
        BatchSentDispatch.create(input, {
          messageId: dispatchId.messageId,
          $dstChain,
        }),
      ]
    }

    const intentProven =
      parseIntentProvenDestinationLegacy(input.log, null) ??
      parseIntentProvenDestination(input.log, null)
    if (intentProven) {
      const processMatch = findParsedAround(
        input.txLogs,
        // hack to support multicall situations like https://arbiscan.io/tx/0x8006690c841152e495e585bf22843c5ad31d284ce07338d3e7518db53fbf2abe#eventlog
        // we start one index higher because we would otherwise find the wrong processId of the batch first
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex! - 1,
        (log, index) => {
          const process = parseProcess(log, null)
          if (!process) return
          return { parsed: process, index }
        },
      )
      if (!processMatch) return

      const processIdLog = input.txLogs[processMatch.index + 1]
      const processId = processIdLog && parseProcessId(processIdLog, null)
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
