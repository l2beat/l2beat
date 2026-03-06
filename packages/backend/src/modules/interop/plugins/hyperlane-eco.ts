/**
 * Intent settlement using Hyperlane AMB
 * this only tracks the settlement leg, not the fill/transfer
 */
import { Address32 } from '@l2beat/shared-pure'
import {
  Dispatch,
  dispatchIdLog,
  dispatchLog,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
  processIdLog,
  processLog,
} from './hyperlane'
import { findParsedAround } from './hyperlane-hwr'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/**
 * 'proving' here just refers to messaging / settling
 * we are tracking the fill as the origin and the settlement as the destination
 *
 * there are 3 paths to settlement:
 * 1. HyperBatched: Queues the proof to be sent later in a group (BatchSent event on old contract, IntentProven (source) on new)
 * 2. HyperInstant: Immediately sends a message via Hyperlane to the Source Chain (HyperInstantFulfillment event on old contract, IntentProven (source) on new)
 * 3. Storage: Relies on standard storage proofs (no message back needed)
 *
 * we track 1 and 2 as hyperlane messages, and an old IntentProven
 *
 * the new 'portal' contract can also send via other bridges than hyperlane
 */

const batchSentLog =
  'event BatchSent(bytes32[] indexed _hashes, uint256 indexed _sourceChainID)'
const parseBatchSent = createEventParser(batchSentLog)

const intentProvenSourceLog =
  'event IntentProven(bytes32 indexed intentHash, bytes32 indexed claimant)'
const parseIntentProvenSource = createEventParser(intentProvenSourceLog)

const intentProvenDestinationLegacyLog =
  'event IntentProven(bytes32 indexed _hash, address indexed _claimant)'
const parseIntentProvenDestinationLegacy = createEventParser(
  intentProvenDestinationLegacyLog,
)

const intentProvenDestinationLog =
  'event IntentProven(bytes32 indexed intentHash, address indexed _claimant, uint64 destination)'
const parseIntentProvenDestination = createEventParser(
  intentProvenDestinationLog,
)

const hyperInstantFulfillmentLog =
  'event HyperInstantFulfillment(bytes32 indexed _hash, uint256 indexed _sourceChainID, address indexed _claimant)'
const parseHyperInstantFulfillment = createEventParser(
  hyperInstantFulfillmentLog,
)

const ecoSourceTxEventSignatures = [dispatchLog, dispatchIdLog]
const ecoDestinationTxEventSignatures = [processLog, processIdLog]

const BatchSentDispatch = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
}>('hyperlane-eco.BatchSentDispatch')

const IntentProvenProcess = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
  recipient: Address32 // claimant
}>('hyperlane-eco.IntentProvenProcess')

export class HyperlaneEcoPlugin implements InteropPluginResyncable {
  readonly name = 'hyperlane-eco'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: batchSentLog,
        includeTxEvents: ecoSourceTxEventSignatures,
        addresses: '*',
      },
      {
        type: 'event',
        signature: intentProvenSourceLog,
        includeTxEvents: ecoSourceTxEventSignatures,
        addresses: '*',
      },
      {
        type: 'event',
        signature: hyperInstantFulfillmentLog,
        includeTxEvents: ecoSourceTxEventSignatures,
        addresses: '*',
      },
      {
        type: 'event',
        signature: intentProvenDestinationLegacyLog,
        includeTxEvents: ecoDestinationTxEventSignatures,
        addresses: '*',
      },
      {
        type: 'event',
        signature: intentProvenDestinationLog,
        includeTxEvents: ecoDestinationTxEventSignatures,
        addresses: '*',
      },
    ]
  }

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
