import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  FailedRelayedMessage,
  RelayedMessage,
  SentMessage,
} from './opstack/opstack'
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

// == Event signatures ==

const transferRegisteredLog =
  'event TransferRegistered(bytes32 ticketHash, address indexed sender, address recipient, uint256 amount, bytes32 messageHash)'
const factRegisteredLog = 'event FactRegistered(bytes32 ticketHash)'

const L1_SORARE_BRIDGE = ChainSpecificAddress(
  'eth:0xDAB785F7719108390A26ff8d167e40aE4789F8D7',
)
const L2_SORARE_BRIDGE = ChainSpecificAddress(
  'base:0xba78a06459a85b6d01a613294fe91cf9ce8326cb',
)

const TransferRegistered = createInteropEventType<{
  ticketHash: string
  amount: bigint
}>('sorare-base.TransferRegistered')

const FactRegistered = createInteropEventType<{
  ticketHash: string
}>('sorare-base.FactRegistered')

const parseTransferRegistered = createEventParser(transferRegisteredLog)
const parseFactRegistered = createEventParser(factRegisteredLog)

export class SorareBasePlugin implements InteropPluginResyncable {
  readonly name = 'sorare-base'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: transferRegisteredLog,
        addresses: [L1_SORARE_BRIDGE],
      },
      {
        type: 'event',
        signature: factRegisteredLog,
        addresses: [L2_SORARE_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const transferRegistered = parseTransferRegistered(input.log, [
        ChainSpecificAddress.address(L1_SORARE_BRIDGE),
      ])
      if (transferRegistered) {
        return [
          TransferRegistered.create(input, {
            ticketHash: transferRegistered.ticketHash,
            amount: transferRegistered.amount,
          }),
        ]
      }
    } else if (input.chain === 'base') {
      const factRegistered = parseFactRegistered(input.log, [
        ChainSpecificAddress.address(L2_SORARE_BRIDGE),
      ])
      if (factRegistered) {
        return [
          FactRegistered.create(input, {
            ticketHash: factRegistered.ticketHash,
          }),
        ]
      }
    }
  }

  matchTypes = [FactRegistered, FailedRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (FactRegistered.checkType(event)) {
      // L2: FactRegistered → RelayedMessage (offset +1)
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 1 },
        chain: 'base',
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage) return

      // L1: SentMessage (N) → SentMessageExtension1 (N+1) → TransferRegistered (N+2)
      const transferRegistered = db.find(TransferRegistered, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!transferRegistered) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'sorare',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [transferRegistered, event],
        }),
        Result.Transfer('sorare-base.L1ToL2Transfer', {
          srcEvent: transferRegistered,
          srcAmount: transferRegistered.args.amount,
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: transferRegistered.args.amount,
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }

    if (FailedRelayedMessage.checkType(event)) {
      if (event.args.chain !== 'base') return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage) return

      const transferRegistered = db.find(TransferRegistered, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!transferRegistered) return

      return [
        Result.Message('opstack.L1ToL2MessageFailed', {
          app: 'sorare',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [transferRegistered],
        }),
      ]
    }
  }
}
