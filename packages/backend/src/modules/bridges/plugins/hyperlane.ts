import { keccak256 } from 'viem'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

export const parseDispatch = createEventParser(
  'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)',
)

const parseProcess = createEventParser(
  'event Process(uint32 indexed origin, bytes32 indexed sender, address indexed recipient)',
)

const parseProcessId = createEventParser(
  'event ProcessId(bytes32 indexed messageId)',
)

export const Dispatch = createBridgeEventType<{
  messageId: `0x${string}`
  $dstChain: string
}>('hyperlane.Dispatch')

export const Process = createBridgeEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane.Process')

const HYPERLANE_NETWORKS = defineNetworks('hyperlane', [
  { chain: 'ethereum', chainId: 1 },
  { chain: 'arbitrum', chainId: 42161 },
  { chain: 'base', chainId: 8453 },
  { chain: 'optimism', chainId: 10 },
])

export class HyperlanePlugIn implements BridgePlugin {
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
      return Process.create(input.ctx, {
        messageId: processId.messageId,
        $srcChain: findChain(
          HYPERLANE_NETWORKS,
          (x) => x.chainId,
          process.origin,
        ),
      })
    }

    const dispatch = parseDispatch(input.log, null)
    if (dispatch)
      return Dispatch.create(input.ctx, {
        messageId: keccak256(dispatch.message),
        $dstChain: findChain(
          HYPERLANE_NETWORKS,
          (x) => x.chainId,
          dispatch.destination,
        ),
      })
  }

  matchTypes = [Process]
  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
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
