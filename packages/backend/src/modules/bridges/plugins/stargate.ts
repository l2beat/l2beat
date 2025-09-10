import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'

const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)

const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

export const OFTSent = createBridgeEventType<{
  guid: string
}>('stargate.OFTSent')

export const OFTReceived = createBridgeEventType<{
  guid: string
}>('stargate.OFTReceived')

// NOTE: This is just an example plugin! Not production ready!
export class StargatePlugin implements BridgePlugin {
  name = 'stargate'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    // TODO: whitelist
    const oftSent = parseOFTSent(input.log, null)
    if (oftSent) {
      return OFTSent.create(input.ctx, { guid: oftSent.guid })
    }

    // TODO: whitelist
    const oftReceived = parseOFTReceived(input.log, null)
    if (oftReceived) {
      return OFTReceived.create(input.ctx, { guid: oftReceived.guid })
    }
  }

  match(oftReceived: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!OFTReceived.checkType(oftReceived)) {
      return
    }

    const oftSent = db.find(OFTSent, { guid: oftReceived.args.guid })
    if (!oftSent) return

    return {
      messages: [
        {
          type: 'stargate.Message',
          outbound: oftSent,
          inbound: oftReceived,
        },
      ],
    }
  }
}
