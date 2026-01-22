import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { RelayedMessage, SentMessage } from './opstack/opstack'
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

const L1_SORARE_BRIDGE = EthereumAddress(
  '0xDAB785F7719108390A26ff8d167e40aE4789F8D7',
)
const L2_SORARE_BRIDGE = EthereumAddress(
  '0xba78a06459a85b6d01a613294fe91cf9ce8326cb',
)

const TransferRegistered = createInteropEventType<{
  ticketHash: string
  amount: bigint
}>('sorare-base.TransferRegistered')

const FactRegistered = createInteropEventType<{
  ticketHash: string
}>('sorare-base.FactRegistered')

const parseTransferRegistered = createEventParser(
  'event TransferRegistered(bytes32 ticketHash, address indexed sender, address recipient, uint256 amount, bytes32 messageHash)',
)

const parseFactRegistered = createEventParser(
  'event FactRegistered(bytes32 ticketHash)',
)

export class SorareBasePlugin implements InteropPlugin {
  readonly name = 'sorare-base'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const transferRegistered = parseTransferRegistered(input.log, [
        L1_SORARE_BRIDGE,
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
      const factRegistered = parseFactRegistered(input.log, [L2_SORARE_BRIDGE])
      if (factRegistered) {
        return [
          FactRegistered.create(input, {
            ticketHash: factRegistered.ticketHash,
          }),
        ]
      }
    }
  }

  matchTypes = [FactRegistered]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (FactRegistered.checkType(event)) {
      // L2: FactRegistered → RelayedMessage
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAfter: event,
        chain: 'base',
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage) return

      // L1: SentMessage → TransferRegistered
      const transferRegistered = db.find(TransferRegistered, {
        sameTxAfter: sentMessage,
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
  }
}
