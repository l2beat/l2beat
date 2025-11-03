/*
This version of a plugin assumes that Wormhole Relayer is used. NTT token is burn/mint by sending
a transfer() call on SRC to NTT manager assosciated with a given token. On DST, NTT manager mints the token.
There is one NTT manager per token.

SRC:
- WormholeCore.LogMessagePublished
- WormholeRelayer.RelayingInfo (not captured), but maybe it should as that would clear some Wormhole messages
- WormholeTransceiver.SendTransceiver message
DST:
- WormholeTransceiver.ReceivedRelayedMesssage
- WormholeRelayer.Delivery

Matching algorithm:
- starting from WormholeTransceiver.ReceivedRelayedMesssage on DST, extract digest
- find on DST WormholeRelayer.Delivery with the same digest, extract sequenceId
- find on SRC WormholeCore.LogMessagePublished and WormholeRelayer.SendEvent with the same sequenceId
- find on SRC WormholeTransceiver in the same tx and extract TokenInformation from it

Note that (TODO: )
- some NTTs may not use Wormhole Relayer, but Wormhole Core directly
- some NTTs may not use Wormhole Transceiver, but Axelar Transceiver


*/

import { BinaryReader } from '../../../tools/BinaryReader'
import {
  Address32,
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
import { Delivery } from './wormhole-relayer'

/*

event SendTransceiverMessage(
        uint16 recipientChain, TransceiverStructs.TransceiverMessage message
;
    struct TransceiverMessage {
        /// @notice Address of the NttManager contract that emitted this message.
        bytes32 sourceNttManagerAddress;
        /// @notice Address of the NttManager contract that receives this message.
        bytes32 recipientNttManagerAddress;
        /// @notice Payload provided to the Transceiver contract by the NttManager contract.
        bytes nttManagerPayload;
        /// @notice Optional payload that the transceiver can encode and use for its own message passing purposes.
        bytes transceiverPayload;
    }

  event ReceivedRelayedMessage(bytes32 digest, uint16 emitterChainId, bytes32 emitterAddress);


    */

// NTT_MANAGERS store token addresses for each NTT manager on a given chain
const NTT_MANAGERS: { [chain: string]: { [manager: string]: string } } = {
  base: {
    '0xbc51f76178a56811fdfe95d3897e6ac2b11dbb62':
      '0x46777c76dbbe40fabb2aab99e33ce20058e76c59', // L3
  },
}

const parseSendTransceiverMessage = createEventParser(
  'event SendTransceiverMessage(uint16 recipientChain, (bytes32 sourceNttManagerAddress, bytes32 recipientNttManagerAddress, bytes nttManagerPayload, bytes transceiverPayload) message)',
)

const parseReceivedRelayedMessage = createEventParser(
  'event ReceivedRelayedMessage(bytes32 digest, uint16 emitterChainId, bytes32 emitterAddress)',
)

export const TransceiverMessage = createInteropEventType<{
  sourceNttManagerAddress: string
  recipientNttManagerAddress: string
  nttManagerPayload: string
  $dstChain: string
}>('wormhole-ntt.SendTransceiverMessage')

export const ReceivedRelayedMessage = createInteropEventType<{
  digest: `0x${string}`
  emitterAddress: string
  $srcChain: string
}>('wormhole-ntt.ReceivedRelayedMessage')

export class WormholeNTTPlugin implements InteropPlugin {
  name = 'wormhole-ntt'

  capture(input: LogToCapture) {
    const send = parseSendTransceiverMessage(input.log, null)
    if (send) {
      return [
        TransceiverMessage.create(input.ctx, {
          sourceNttManagerAddress: send.message.sourceNttManagerAddress,
          recipientNttManagerAddress: send.message.recipientNttManagerAddress,
          nttManagerPayload: send.message.nttManagerPayload,
          $dstChain: findChain(
            WORMHOLE_NETWORKS,
            (x) => x.wormholeChainId,
            Number(send.recipientChain),
          ),
        }),
      ]
    }

    const received = parseReceivedRelayedMessage(input.log, null)
    if (received) {
      return [
        ReceivedRelayedMessage.create(input.ctx, {
          digest: received.digest,
          emitterAddress: received.emitterAddress,
          $srcChain: findChain(
            WORMHOLE_NETWORKS,
            (x) => x.wormholeChainId,
            Number(received.emitterChainId),
          ),
        }),
      ]
    }
  }

  matchTypes = [ReceivedRelayedMessage]
  match(received: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ReceivedRelayedMessage.checkType(received)) {
      // find on DST WormholeRelayer.Delivery with the same digest, extract sequenceId
      const delivery = db.find(Delivery, {
        deliveryVaaHash: received.args.digest,
      })
      if (!delivery) return

      // find on SRC WormholeCore.LogMessagePublished and WormholeRelayer.SendEvent with the same sequenceId
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: delivery.args.sequence,
        wormholeChainId: delivery.args.sourceChain,
      })
      if (!logMessagePublished) return

      /* do we need Send event for anything ?
      const sendEvent = db.find(SendEvent, {
        sequence: delivery.args.sequence,
        wormholeChainId: delivery.args.sourceChain,
      })
      if (!sendEvent) return
      */

      const sentTransceiverMessage = db.find(TransceiverMessage, {
        sameTxAfter: logMessagePublished,
      })
      if (!sentTransceiverMessage) return

      const srcTokenAddress = decodeNTTManagerPayload(
        sentTransceiverMessage.args.nttManagerPayload,
      )?.sourceToken
      const dstNTTAddress = Address32.cropToEthereumAddress(
        Address32.from(sentTransceiverMessage.args.recipientNttManagerAddress),
      ).toLowerCase()
      const dstTokenAddress =
        NTT_MANAGERS[sentTransceiverMessage.args.$dstChain]?.[dstNTTAddress]
      const amount = decodeNTTManagerPayload(
        sentTransceiverMessage.args.nttManagerPayload,
      )?.amount

      return [
        Result.Message('wormhole.Message', {
          app: 'wormhole-ntt', // NOTE: This isn't a real app, it's a mechanism for apps to use
          srcEvent: logMessagePublished,
          dstEvent: delivery,
        }),
        Result.Transfer('wormhole-ntt.Transfer', {
          extraEvents: [logMessagePublished, delivery],
          srcEvent: sentTransceiverMessage,
          dstEvent: received,
          srcTokenAddress: srcTokenAddress
            ? Address32.from(srcTokenAddress)
            : Address32.ZERO,
          srcAmount: amount ? BigInt(amount) : undefined,
          dstTokenAddress: dstTokenAddress
            ? Address32.from(dstTokenAddress)
            : Address32.ZERO, // TODO: Should extract token from dst NTT manager
          dstAmount: amount ? BigInt(amount) : undefined,
        }),
      ]
    }
  }
}

// https://arbiscan.io/address/0xe8336298d9439f0ca523b515525aa9ea0f377990#code#F20#L65
function decodeNTTManagerPayload(payload: string) {
  try {
    const reader = new BinaryReader(payload)
    const id = reader.readBytes(32)
    const sender = reader.readBytes(32)
    const payloadLength = reader.readUint16()
    const payloadData = reader.readBytes(payloadLength)
    const reader2 = new BinaryReader(payloadData)
    const prefix = reader2.readBytes(4)
    const decimals = reader2.readBytes(1)
    const amount = reader2.readUint64().toString()
    const sourceToken = reader2.readBytes(32)
    const toAddress = reader2.readBytes(32)
    const toChain = reader2.readBytes(2)
    return {
      id,
      sender,
      payloadData,
      prefix,
      decimals,
      amount,
      sourceToken,
      toAddress,
      toChain,
    }
  } catch {
    return undefined
  }
}

/*

On Source: 0xd8cec5a2163774b308d382442a59f3558f0e7d6ebf9817bc5953c27c3d98b671 (Arbitrum)

000000000000000000000000bc51f76178a56811fdfe95d3897e6ac2b11dbb62 // NTT Manager on dst

sendPayloadToEvm:
0x9945ff10
000000000000000000000000bc51f76178a56811fdfe95d3897e6ac2b11dbb62
000000000000000000000000bc51f76178a56811fdfe95d3897e6ac2b11dbb62
0091
00000000000000000000000000000000000000000000000000000000000007e6
000000000000000000000000023fa838682c115c2cfba96ef3791cb5bd931fc7
004f994e545408000000028a3d178c00000000000000000000000046777c76db
be40fabb2aab99e33ce20058e76c590000000000000000000000000f8d3248a3
df3a6ffd486f79e5c283e37a75a6b5001e

0000


LogMessagePublished:
0x01001e0000000000000000000000008d77ac62a6571a408e5c9655ff5de90d537c3045000000d99945ff10
000000000000000000000000bc51f76178a56811fdfe95d3897e6ac2b11dbb62  // src NNT Manager
000000000000000000000000bc51f76178a56811fdfe95d3897e6ac2b11dbb62  // dst NNT Manager
0091

00000000000000000000000000000000000000000000000000000000000007e6  // NTTManagerPayload
000000000000000000000000023fa838682c115c2cfba96ef3791cb5bd931fc7
004f994e545408000000028a3d178c
00000000000000000000000046777c76dbbe40fabb2aab99e33ce20058e76c59
0000000000000000000000000f8d3248a3
df3a6ffd486f79e5c283e37a75a6b5001e

000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007a1200000000000000000000000000000000000000000000000000000000000117049001e0000000000000000000000000f8d3248a3df3a6ffd486f79e5c283e37a75a6b500000000000000000000000070b4a48f482956983d8c69d3ae18fe229888638d0000000000000000000000007a0a53847776f7e94cc35742971acb2217b0db810000000000000000000000008d77ac62a6571a408e5c9655ff5de90d537c304500

SendTransceiverMessage.NTTManagerPayload:  (encodedPacked)
0x
00000000000000000000000000000000000000000000000000000000000007e6    // ID
000000000000000000000000023fa838682c115c2cfba96ef3791cb5bd931fc7    // Sender
004f                                                                // palyload length
994e545408000000028a3d178c                                          // payload
00000000000000000000000046777c76dbbe40fabb2aab99e33ce20058e76c59         // L3 token on dst
0000000000000000000000000f8d3248a3df3a6ffd486f79e5c283e37a75a6b5001e



On DST: 0xed7885b062d7b42ec332ffc035410686128103db9a38c6d4842276f95ed68539 (Base)

digest:
keccak256(abi.encodePacked(sourceChainId, abi.encodePacked(m.id, m.sender, payloadLength, m.payload);

*/
