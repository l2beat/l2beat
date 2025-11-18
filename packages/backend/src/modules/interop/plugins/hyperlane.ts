import { keccak256 } from 'viem'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

export const parseDispatch = createEventParser(
  'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)',
)

export const parseProcess = createEventParser(
  'event Process(uint32 indexed origin, bytes32 indexed sender, address indexed recipient)',
)

export const parseProcessId = createEventParser(
  'event ProcessId(bytes32 indexed messageId)',
)

export const parseDispatchId = createEventParser(
  'event DispatchId(bytes32 indexed messageId)',
)

export const Dispatch = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
}>('hyperlane.Dispatch')

export const Process = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane.Process')

export const HYPERLANE_NETWORKS = defineNetworks('hyperlane', [
  { chain: 'ethereum', chainId: 1 },
  { chain: 'arbitrum', chainId: 42161 },
  { chain: 'base', chainId: 8453 },
  { chain: 'optimism', chainId: 10 },
])

export class HyperlanePlugIn implements InteropPlugin {
  name = 'hyperlane'

  capture(input: LogToCapture) {
    const process = parseProcess(input.log, null)
    if (process) {
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      const processId = nextLog && parseProcessId(nextLog, null)
      if (!processId) return
      return [
        Process.create(input.ctx, {
          messageId: processId.messageId,
          $srcChain: findChain(
            HYPERLANE_NETWORKS,
            (x) => x.chainId,
            process.origin,
          ),
        }),
      ]
    }

    const dispatch = parseDispatch(input.log, null)
    if (dispatch)
      return [
        Dispatch.create(input.ctx, {
          messageId: keccak256(dispatch.message),
          $dstChain: findChain(
            HYPERLANE_NETWORKS,
            (x) => x.chainId,
            dispatch.destination,
          ),
        }),
      ]
  }

  matchTypes = [Process]
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (Process.checkType(delivery)) {
      const dispatch = db.find(Dispatch, {
        messageId: delivery.args.messageId,
      })
      if (!dispatch) {
        return
      }

      return [
        Result.Message('hyperlane.Message', {
          app: 'unknown',
          srcEvent: dispatch,
          dstEvent: delivery,
        }),
      ]
    }
  }
}
