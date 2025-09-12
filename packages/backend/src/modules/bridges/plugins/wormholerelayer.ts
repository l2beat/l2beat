/*
Wormhole Relayer:
- on SRC sends Wormhole Core msg and publishes SendEvent (ignored for now)
- on DST validates Wormhole Core msg and publishes Delivery event. Calls App contract. 
The mental model is: App using Wormhole Core messaging via Relayer to deliver messages across chains.
*/

import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'
import { LogMessagePublished, NETWORKS } from './wormhole'

const parseDelivery = createEventParser(
  'event Delivery(address indexed recipientContract, uint16 indexed sourceChain, uint64 indexed sequence, bytes32 deliveryVaaHash,uint8 status,uint256 gasUsed,uint8 refundStatus,bytes additionalStatusInfo,bytes overridesInfo)',
)

export const Delivery = createBridgeEventType<{
  recipientContract: string
  sourceChain: string
  sequence: string
}>('wormholeRelayer.Delivery')

export class WormholeRelayerPlugin implements BridgePlugin {
  name = 'wormholerelayer'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const parsed = parseDelivery(input.log, null)
    if (!parsed) return

    return Delivery.create(input.ctx, {
      recipientContract: parsed.recipientContract,
      sourceChain:
        NETWORKS.find((n) => n.wormholeChainId === Number(parsed.sourceChain))
          ?.chain || '???',
      sequence: parsed.sequence.toString(),
    })
  }

  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (Delivery.checkType(delivery)) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: delivery.args.sequence,
        wormholeChainId: delivery.args.sourceChain,
      })
      if (!logMessagePublished) {
        return
      }

      return {
        messages: [
          {
            type: 'WormholeCore.Message',
            outbound: logMessagePublished,
            inbound: delivery,
          },
        ],
      }
    }
  }
}
