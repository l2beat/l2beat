/**
 * Hyperlane AMB
 * matches 'unknown' messages that we cannot identify as any tracked hyperlane app
 */
import { keccak256 } from 'viem'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { findHyperlaneChain, HyperlaneConfig } from './hyperlane.config'
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

export const dispatchLog =
  'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)'
export const parseDispatch = createEventParser(dispatchLog)

export const processLog =
  'event Process(uint32 indexed origin, bytes32 indexed sender, address indexed recipient)'
export const parseProcess = createEventParser(processLog)

export const processIdLog = 'event ProcessId(bytes32 indexed messageId)'
export const parseProcessId = createEventParser(processIdLog)

export const dispatchIdLog = 'event DispatchId(bytes32 indexed messageId)'
export const parseDispatchId = createEventParser(dispatchIdLog)

export const Dispatch = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
}>('hyperlane.Dispatch')

export const Process = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
}>('hyperlane.Process')

export class HyperlanePlugIn implements InteropPluginResyncable {
  readonly name = 'hyperlane'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    return [
      { type: 'event', signature: dispatchLog, addresses: '*' },
      { type: 'event', signature: processLog, addresses: '*' },
      { type: 'event', signature: dispatchIdLog, addresses: '*' },
      { type: 'event', signature: processIdLog, addresses: '*' },
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(HyperlaneConfig) ?? []

    const process = parseProcess(input.log, null)
    if (process) {
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      const processId = nextLog && parseProcessId(nextLog, null)
      if (!processId) return
      return [
        Process.create(input, {
          messageId: processId.messageId,
          $srcChain: findHyperlaneChain(networks, Number(process.origin)),
        }),
      ]
    }

    const dispatch = parseDispatch(input.log, null)
    if (dispatch)
      return [
        Dispatch.create(input, {
          messageId: keccak256(dispatch.message),
          $dstChain: findHyperlaneChain(networks, Number(dispatch.destination)),
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
