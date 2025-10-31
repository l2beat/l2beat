/* Assuming Axelar is used for sending Proofs and Wormhole for sending Payloads
On SRC:
- WormholeCore: LogMessagePublished
- WormholeRelayer: SendEvent
- MultiAdapter: SendPayLoad

- AxelarGateway: ContractCall
- MultiAdapter: SendProof
On DST: (Axelar Approve)
- AxelarGateway: ContractCallApproved
On DST: (Axelar Execute)
- AxelarGateway: ContractCallExecuted
- MultiAdapter: HandleProof
On DST: (Wormhole Delivery)
- MultiAdapter: HandlePayLoad
- WormholeRelayer: Delivery
*/

import {
  ContractCall,
  ContractCallApproved,
  ContractCallExecuted,
} from './axelar'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { LogMessagePublished } from './wormhole'
import { Delivery } from './wormhole-relayer'

const parseSendPayload = createEventParser(
  'event SendPayload(uint16 indexed centrifugeId, bytes32 indexed payloadId, bytes payload, address adapter, bytes32 adapterData, address refund)',
)

const parseSendProof = createEventParser(
  'event SendProof(uint16 indexed centrifugeId, bytes32 indexed payloadId, bytes32 payloadHash, address adapter, bytes32 adapterData)',
)

const parseHandlePayload = createEventParser(
  'event HandlePayload(uint16 indexed centrifugeId, bytes32 indexed payloadId, bytes payload, address adapter)',
)

const parseHandleProof = createEventParser(
  'event HandleProof(uint16 indexed centrifugeId, bytes32 indexed payloadId, bytes32 payloadHash, address adapter)',
)

export const SendPayLoad = createInteropEventType<{
  payloadId: string
  adapter: string
}>('centrifuge.SendPayLoad')

export const SendProof = createInteropEventType<{
  payloadId: string
  adapter: string
}>('centrifuge.SendProof')

export const HandlePayLoad = createInteropEventType<{
  payloadId: string
  adapter: string
}>('centrifuge.HandlePayLoad')

export const HandleProof = createInteropEventType<{
  payloadId: string
  adapter: string
}>('centrifuge.HandleProof')

export class CentriFugePlugin implements InteropPlugin {
  name = 'centrifuge'

  capture(input: LogToCapture) {
    const parsedSendPayload = parseSendPayload(input.log, null)
    if (parsedSendPayload) {
      return [
        SendPayLoad.create(input.ctx, {
          payloadId: parsedSendPayload.payloadId,
          adapter: parsedSendPayload.adapter,
        }),
      ]
    }

    const parsedSendProof = parseSendProof(input.log, null)
    if (parsedSendProof) {
      return [
        SendProof.create(input.ctx, {
          payloadId: parsedSendProof.payloadId,
          adapter: parsedSendProof.adapter,
        }),
      ]
    }

    const parsedHandlePayload = parseHandlePayload(input.log, null)
    if (parsedHandlePayload) {
      return [
        HandlePayLoad.create(input.ctx, {
          payloadId: parsedHandlePayload.payloadId,
          adapter: parsedHandlePayload.adapter,
        }),
      ]
    }

    const parsedHandleProof = parseHandleProof(input.log, null)
    if (parsedHandleProof) {
      return [
        HandleProof.create(input.ctx, {
          payloadId: parsedHandleProof.payloadId,
          adapter: parsedHandleProof.adapter,
        }),
      ]
    }
  }

  /* Matching algorithm:
    1. Start with HandleProof on DST chain
    2. Find ContractCallExecuted with the same transaction
    3. Find ContractCallApproved with the same commandId
    4. Find SendProof on SRC chain with the same payloadId
    5. Find ContractCall on SRC chain

    1. Start with HandlePayload on DST chain
    2. Find Delivery with the same transaction
    3. Find SendPayload on SRC chain with the same payloadId
    4. Find ContractCall on SRC chain with the same txHash as in step 2

    TODO: What if other adapters are used ?
    TODO: Add $srChain and $dstChain to Centrifuge events if possible (depending on adapter used)
  */

  matchTypes = [HandleProof, HandlePayLoad]
  match(
    handleProofOrPayload: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (HandleProof.checkType(handleProofOrPayload)) {
      const contractCallExecuted = db.find(ContractCallExecuted, {
        sameTxBefore: handleProofOrPayload,
      })
      if (!contractCallExecuted) return

      const contractCallApproved = db.find(ContractCallApproved, {
        commandId: contractCallExecuted.args.commandId,
      })
      if (!contractCallApproved) return

      const sendProof = db.find(SendProof, {
        payloadId: handleProofOrPayload.args.payloadId,
      })
      if (!sendProof) return

      const contractCall = db.find(ContractCall, {
        sameTxBefore: sendProof,
      })
      if (!contractCall) return

      return [
        Result.Message('axelar.ContractCallMessage', {
          app: 'centrifuge',
          srcEvent: contractCall,
          dstEvent: contractCallApproved,
          extraEvents: [sendProof, handleProofOrPayload, contractCallExecuted],
        }),
      ]
    }

    if (HandlePayLoad.checkType(handleProofOrPayload)) {
      const delivery = db.find(Delivery, {
        sameTxAfter: handleProofOrPayload,
      })
      if (!delivery) return

      const sendPayload = db.find(SendPayLoad, {
        payloadId: handleProofOrPayload.args.payloadId,
      })
      if (!sendPayload) return

      const logMessagePublished = db.find(LogMessagePublished, {
        sameTxBefore: sendPayload,
      })
      if (!logMessagePublished) return

      return [
        Result.Message('wormhole.Message', {
          app: 'centrifuge',
          srcEvent: logMessagePublished,
          dstEvent: delivery,
          extraEvents: [sendPayload, handleProofOrPayload],
        }),
      ]
    }
  }
}
