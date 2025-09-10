

import { MessageReceived, MessageSent } from './cctpv2'
import {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  LogToCapture,
  MatchResult,
  createBridgeEventType,
  createEventParser,
} from './types'

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(uint32 sourceDomain, bytes32 sourceNonce, uint256 amount)',
)

export const OrderFulfilled = createBridgeEventType<{
  txHash: string
}>('mayan-mctp-fast.OrderFullfilled')

export class MayanMCTPFastPlugin implements BridgePlugin {
  name = 'mayanMCTPFast'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, { txHash: input.ctx.txHash })
    }
  }


  match(orderFulfilled: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) {
      return
    }
    console.log('orderFulfilled found', orderFulfilled)
    // find MessageReceived with the same txHash as OrderFulfilled
    const messageReceived = db.find(MessageReceived, {
      txHash: orderFulfilled.args.txHash
    })
    if (!messageReceived) {
      return
    }
    console.log('messageReceived found', messageReceived)
    // find MessageSent with the same body as MessageReceived
    const messageSent = db.find(MessageSent, {
      message: messageReceived.args.messageBody,
    })
    if (!messageSent) {
      return
    }
    console.log('messageSent found', messageSent)

    return {
      messages: [
        {
          type: 'cctpv2.Message',
          outbound: messageSent,
          inbound: messageReceived,
        },
        {
          type: 'mayan-mctp-fast.Message',
          outbound: messageSent,
          inbound: orderFulfilled,
        },
      ],
    }
  }
}


/*
MsgBody:
00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00
Source message in a source event:
000000010000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000100000000
00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00

Dst message as passed to the msg receiver:
00000001000000000000000635a2681ce63afbba04e173024d6b260ffbf6a02fbf51cd924b75c5da4f16422300000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e774100000001000003e8
00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a000000000000000000000000000000000000000000000000000000000000fe3a0000000000000000000000000000000000000000000000000000000002119c3303000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00

Dst message passed to msg tranmitter
00000001000000000000000635a2681ce63afbba04e173024d6b260ffbf6a02fbf51cd924b75c5da4f16422300000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e774100000001000003e8

// MsgBody
00000001                                                          // Version
000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48  // burnToken
000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741  // mintRecipient
0000000000000000000000000000000000000000000000000000000026cad397  // amount
000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741  // msgSender
000000000000000000000000000000000000000000000000000000000001164a  // maxFee
000000000000000000000000000000000000000000000000000000000000fe3a  // EMPTY_FEE_EXECUTED  (injected)
0000000000000000000000000000000000000000000000000000000002119c33  // EMPTY_EXPIRATION_BLOCK (injected)
// hook 
03
000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c3  // dstAddr
0000000000000000000000000000000000000000000000000000000000000000  // tokenOut
0000000000d7f4a7                                                  // amountOutMin (8)
0000000000000000                                                  // gasDrop (8)
000000000002f0d2                                                  // redeemFee (8)
000000000000d4d7                                                  // refundFee (8)
0000000068ac554d                                                  // deadline (8)
000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd  // referr Address (32)
00                                                                // referrerBps

// encodePacked struct in a hook data
  	struct OrderPayload {
		 uint8 payloadType;
		 bytes32 destAddr;
		 bytes32 tokenOut;
		 uint64 amountOutMin;
		 uint64 gasDrop;
		 uint64 redeemFee;
		 uint64 refundFee;
		 uint64 deadline;
		 bytes32 referrerAddr;
		 uint8 referrerBps;
	}

CCTPMessage from Mayan via CCTP Token Transfer consists of:

CCTP v2 Message on the Destination
-version
-sourceDomain
-dstDomain
-nonce - on source 0x, on dst specific nonce. A CCTP V2 nonce is a unique identifier for a message that can only be used once on the destination domain. Circle assigns CCTP V2 nonces offchain.
-sender   : TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
-recipient  : TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
-dstCaller: FastMCTP (0xc1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741)
-minFinThreshold
-finThreshExecuted
-messageBody  // there are potentially many message body formats, in this case it's a BurnMessageV2 
  - version  (uint32)
  - burnToken (bytes32)
  - mintRecipient (bytes32)
  - amount (uint256)
  - messageSender (bytes32)
  - maxFee (uint256)
  - EMPTY_FEE_EXECUTED (uint256)     - only present on DST
  - EMPTY_EXPIRATION_BLOCK (uint256) - only present on DST
  - hookData
     - payLoadType
     - dstAddress
     - tokenOut
     - amountOutMin
     - gasDrop
     - redeemFee
     - refundFee
     - deadline
     - referrerAddr
     - referrerBps
  */