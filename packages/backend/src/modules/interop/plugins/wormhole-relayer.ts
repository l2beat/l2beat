/* Wormhole Relayer is auxiliary contract for apps using WormholeCore not wanting to have their own relayer.

On SRC it emits SendEvent with useless info - hence it's ignored and Wormhole Core LogMessagePublished is used instead.
On DST it emits Delivery event which is used to match with LogMessagePublished on SRC.

*/

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
import { LogMessagePublished, WORMHOLE_NETWORKS } from './wormhole'

const parseDelivery = createEventParser(
  'event Delivery(address indexed recipientContract, uint16 indexed sourceChain, uint64 indexed sequence, bytes32 deliveryVaaHash,uint8 status,uint256 gasUsed,uint8 refundStatus,bytes additionalStatusInfo,bytes overridesInfo)',
)

/*
const parseSendEvent = createEventParser(
  'event SendEvent(uint64 indexed sequence, uint256 deliveryQuote, uint256 paymentForExtraReceiverValue)',
)
*/

export const Delivery = createInteropEventType<{
  recipientContract: string
  sourceChain: number
  sequence: string
  deliveryVaaHash: `0x${string}`
  $srcChain: string
}>('wormhole-relayer.Delivery')

export const SendEvent = createInteropEventType<{
  sequence: string
  $dstChain: string
}>('wormhole-relayer.SendEvent')

export class WormholeRelayerPlugin implements InteropPlugin {
  name = 'wormhole-relayer'

  capture(input: LogToCapture) {
    const parsed = parseDelivery(input.log, null)
    if (parsed) {
      return [
        Delivery.create(input.ctx, {
          recipientContract: parsed.recipientContract,
          sourceChain: parsed.sourceChain,
          deliveryVaaHash: parsed.deliveryVaaHash,
          $srcChain: findChain(
            WORMHOLE_NETWORKS,
            (x) => x.wormholeChainId,
            Number(parsed.sourceChain),
          ),
          sequence: parsed.sequence.toString(),
        }),
      ]
    }
    /*
        const send = parseSendEvent(input.log, null)
        if (send) {
          return SendEvent.create(input.ctx, {
            sequence: send.sequence.toString(),
            $dstChain: 'unknown yet',
          })
        }
    */
  }

  matchTypes = [Delivery]
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (Delivery.checkType(delivery)) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: delivery.args.sequence,
        wormholeChainId: delivery.args.sourceChain,
      })
      if (!logMessagePublished) {
        return
      }

      return [
        Result.Message('wormhole.Message', {
          app: 'wormhole-relayer', // NOTE: This isn't a real app, it's a mechanism for apps to use
          srcEvent: logMessagePublished,
          dstEvent: delivery,
        }),
      ]
    }
  }
}
