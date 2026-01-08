import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import { findParsedAround } from './hyperlane-eco'
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

const parsePriceUpdated = createEventParser(
  'event PriceUpdated(uint256 price, uint256 timestamp)',
)

const PriceUpdatedProcess = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane.PriceUpdatedProcess')

export class HyperlaneSimpleAppsPlugIn implements InteropPlugin {
  name = 'hyperlane-simple-apps'

  capture(input: LogToCapture) {
    const priceUpdated = parsePriceUpdated(input.log, null)
    if (!priceUpdated) return
    const process = findParsedAround(
      input.txLogs,
      // biome-ignore lint/style/noNonNullAssertion: It's there
      input.log.logIndex!,
      (log) => parseProcess(log, null),
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

  matchTypes = [PriceUpdatedProcess]
  match(
    priceUpdatedProcess: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (PriceUpdatedProcess.checkType(priceUpdatedProcess)) {
      const dispatch = db.find(Dispatch, {
        messageId: priceUpdatedProcess.args.messageId,
      })
      if (!dispatch) {
        return
      }
      const process = db.find(Process, {
        messageId: priceUpdatedProcess.args.messageId,
      })
      if (!process) {
        return
      }

      return [
        Result.Message('hyperlane.Message', {
          app: 'renzo-l2-deposit-price-feed',
          srcEvent: dispatch,
          dstEvent: priceUpdatedProcess,
          extraEvents: [process],
        }),
      ]
    }
  }
}
