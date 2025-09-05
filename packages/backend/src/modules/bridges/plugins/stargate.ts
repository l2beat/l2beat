import {
  type BridgeEvent,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type EventDb,
  type LogToDecode,
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

  decode(input: LogToDecode) {
    // TODO: whitelist
    const oftSent = parseOFTSent(input.log, null)
    if (oftSent) {
      return OFTSent.create(input.tx, { guid: oftSent.guid })
    }

    // TODO: whitelist
    const oftReceived = parseOFTReceived(input.log, null)
    if (oftReceived) {
      return OFTReceived.create(input.tx, { guid: oftReceived.guid })
    }
  }

  match(oftReceived: BridgeEvent, db: EventDb): MatchResult | undefined {
    if (!OFTReceived.checkType(oftReceived)) {
      return
    }

    const oftSent = db.find(OFTSent, { guid: oftReceived.args.guid })
    if (!oftSent) return

    return {
      message: {
        type: 'stargate.Message',
        outbound: oftSent,
        inbound: oftReceived,
      },
    }
  }
}
