/**
 * For tagging apps that use Hyperlane AMB
 */
import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
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

const priceUpdatedLog = 'event PriceUpdated(uint256 price, uint256 timestamp)'
const parsePriceUpdated = createEventParser(priceUpdatedLog)

const PriceUpdatedProcess = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane-renzo.PriceUpdatedProcess')

const receivedFromBridgeLog = 'event ReceivedFromBridge(bytes32 indexed txId)'
const parseReceivedFromBridge = createEventParser(receivedFromBridgeLog)

const ReceivedFromBridgeProcess = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane-decent.ReceivedFromBridge')

export class HyperlaneSimpleAppsPlugIn implements InteropPluginResyncable {
  readonly name = 'hyperlane-simple-apps'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: priceUpdatedLog,
        includeTxEvents: [processLog, processIdLog],
        addresses: '*',
      },
      {
        type: 'event',
        signature: receivedFromBridgeLog,
        includeTxEvents: [processLog, processIdLog],
        addresses: '*',
      },
    ]
  }

  capture(input: LogToCapture) {
    const priceUpdated = parsePriceUpdated(input.log, null)
    if (priceUpdated) {
      const process = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, index) => {
          const process = parseProcess(log, null)
          if (!process) return
          return { parsed: process, index }
        },
      )
      if (!process) return
      const processIdLog = input.txLogs[process.index + 1]
      const processId = processIdLog && parseProcessId(processIdLog, null)
      if (!processId) return
      return [
        PriceUpdatedProcess.create(input, {
          messageId: processId.messageId,
          $srcChain: findChain(
            HYPERLANE_NETWORKS,
            (x) => x.chainId,
            process.parsed.origin,
          ),
        }),
      ]
    }

    const receivedFromBridge = parseReceivedFromBridge(input.log, null)
    if (receivedFromBridge) {
      const process = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, index) => {
          const process = parseProcess(log, null)
          if (!process) return
          return { parsed: process, index }
        },
      )
      if (!process) return
      const processIdLog = input.txLogs[process.index + 1]
      const processId = processIdLog && parseProcessId(processIdLog, null)
      if (!processId) return

      return [
        ReceivedFromBridgeProcess.create(input, {
          messageId: processId.messageId,
          $srcChain: findChain(
            HYPERLANE_NETWORKS,
            (x) => x.chainId,
            process.parsed.origin,
          ),
        }),
      ]
    }
  }

  matchTypes = [PriceUpdatedProcess, ReceivedFromBridgeProcess]
  match(
    incomingInteropEvent: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (PriceUpdatedProcess.checkType(incomingInteropEvent)) {
      const dispatch = db.find(Dispatch, {
        messageId: incomingInteropEvent.args.messageId,
      })
      if (!dispatch) {
        return
      }
      const process = db.find(Process, {
        messageId: incomingInteropEvent.args.messageId,
      })
      if (!process) {
        return
      }

      return [
        Result.Message('hyperlane.Message', {
          app: 'renzo-l2-deposit-price-feed',
          srcEvent: dispatch,
          dstEvent: incomingInteropEvent,
          extraEvents: [process],
        }),
      ]
    }

    if (ReceivedFromBridgeProcess.checkType(incomingInteropEvent)) {
      const dispatch = db.find(Dispatch, {
        messageId: incomingInteropEvent.args.messageId,
      })
      if (!dispatch) {
        return
      }
      const process = db.find(Process, {
        messageId: incomingInteropEvent.args.messageId,
      })
      if (!process) {
        return
      }

      return [
        Result.Message('hyperlane.Message', {
          app: 'decent-utb-swapper',
          srcEvent: dispatch,
          dstEvent: incomingInteropEvent,
          extraEvents: [process],
        }),
      ]
    }
  }
}
