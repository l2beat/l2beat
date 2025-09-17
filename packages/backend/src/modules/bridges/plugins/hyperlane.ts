/* 
Minimalistic plugin matching Hyperlane messages w/out detecting anything more specific. To detetc sender/receivers
additional event parsers would be needed.
*/

import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/* 
event DispatchId (index_topic_1 bytes32 messageId)
event ProcessId (index_topic_1 bytes32 messageId)

*/

const parseDispatchId = createEventParser(
  'event DispatchId(bytes32 indexed messageId)',
)

const parseProcessId = createEventParser(
  'event ProcessId(bytes32 indexed messageId)',
)

export const DispatchId = createBridgeEventType<{
  messageId: `0x${string}`
}>('hyperlane.DispatchId')

export const ProcessId = createBridgeEventType<{
  messageId: `0x${string}`
}>('hyperlane.ProcessId')

export class HyperlanePlugIn implements BridgePlugin {
  name = 'hyperlane'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const processId = parseProcessId(input.log, null)
    if (processId)
      return ProcessId.create(input.ctx, {
        messageId: processId.messageId,
      })

    const dispatchId = parseDispatchId(input.log, null)
    if (dispatchId)
      return DispatchId.create(input.ctx, {
        messageId: dispatchId.messageId,
      })
  }

  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (ProcessId.checkType(delivery)) {
      const dispatchId = db.find(DispatchId, {
        messageId: delivery.args.messageId,
      })
      if (!dispatchId) {
        return
      }

      return [Result.Message('hyperlane.Message', [dispatchId, delivery])]
    }
  }
}
