import { EthereumAddress } from '@l2beat/shared-pure'
import { MessageReceived, MessageSent } from './cctpv2'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'
import { BinaryReader } from '../BinaryReader'

const parseDepositForBurn = createEventParser('event DepositForBurn(address indexed burnToken,uint256 amount,address indexed depositor,bytes32 mintRecipient,uint32 destinationDomain,bytes32 destinationTokenMessenger,bytes32 destinationCaller,uint256 maxFee,uint32 indexed minFinalityThreshold,bytes hookData)')

export const DepositForBurn = createBridgeEventType<{
  txHash: string
}>('cctpv2TokenMessenger.DepositForBurn')

export class CCTPv2TokenMessengerPlugin implements BridgePlugin {
  name = 'cctpv2TokenMessenger'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const depositForBurn = parseDepositForBurn(input.log, null)
    if (!depositForBurn) return


    return DepositForBurn.create(input.ctx, {
      txHash: input.ctx.txHash
    })
  }


  match(bridgeEvent: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!DepositForBurn.checkType(bridgeEvent)) {
      return
    }

    // Find MessageSent in the same tx as DepositForBurn
    const sent = db.find(MessageSent, {
      txHash: bridgeEvent.args.txHash,
    })
    if (!sent) {
      return
    }

    // I have a Sent event corresponding to DepositForBurn and I can parse it further since I know it contains Burn message in a messageBody
    const burnMessage = decodeBurnMessage(sent.args.message)
    console.log('burnMessage: ', burnMessage)

    // Now I need to find the Receive event where message body is the same except feeExecuted and expirationBlock
    // That does not solve the problem of a user sending two identical burn requests...

    return {
      messages: [
        {
          type: 'cctpv2TokenMessenger.BurnMessage',
          inbound: bridgeEvent,
          outbound: sent, // must be received here
        },
      ],
    }
  }
}

// link
function decodeBurnMessage(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const burnToken = reader.readBytes(32)
    const mintRecipient = reader.readBytes(32)
    const amount = reader.readUint256()
    const messageSender = reader.readBytes(32)
    const maxFee = reader.readUint256()
    const feeExecuted = reader.readUint256()
    const expirationBlock = reader.readUint256()
    const hookData = reader.readRemainingBytes()
    return {
      version,
      burnToken,
      mintRecipient,
      amount,
      messageSender,
      maxFee,
      feeExecuted,
      expirationBlock,
      hookData,
    }
  } catch {
    return undefined
  }
}

/*
00000001 // version
00000000 // sourceDomain
00000006 // destinationDomain
0000000000000000000000000000000000000000000000000000000000000000 // nonce
00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d // sender
00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d // recipient
000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741 // destinationCaller
00000001 // minFinalityThreshold
00000000 // EMPTY_FINALITY_THRESHOLD_EXECUTED
00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00

00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a000000000000000000000000000000000000000000000000000000000000fe3a0000000000000000000000000000000000000000000000000000000002119c3303000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00
*/