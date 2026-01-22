import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import {
  OPSTACK_NETWORKS,
  parseSentMessage,
  RelayedMessage,
  SentMessage,
} from './opstack/opstack'
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

const ZKLINK_ARBITRATOR = EthereumAddress(
  '0x1ee09a2caa0813a5183f90f5a6d0e4871f4c6002',
)

const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [
    ChainSpecificAddress.address(n.l1CrossDomainMessenger).toString(),
    n,
  ]),
)

const MessageForwarded = createInteropEventType<{
  chain: string
}>('zklink-nova.MessageForwarded')

const parseMessageForwarded = createEventParser(
  'event MessageForwarded(address indexed gateway, uint256 value, bytes callData)',
)

export class ZklinkNovaPlugin implements InteropPlugin {
  readonly name = 'zklink-nova'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const messageForwarded = parseMessageForwarded(input.log, [
        ZKLINK_ARBITRATOR,
      ])
      if (messageForwarded) {
        const gatewayAddress = messageForwarded.gateway.toLowerCase()
        // Find SentMessage where sender matches the gateway to determine chain
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(
            EthereumAddress(log.address).toString(),
          )
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            ChainSpecificAddress.address(network.l1CrossDomainMessenger),
          ])
          if (sentMessage?.sender.toLowerCase() === gatewayAddress) {
            return [MessageForwarded.create(input, { chain: network.chain })]
          }
        }
      }
    }
  }

  matchTypes = [RelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (RelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // L1: SentMessage → MessageForwarded (MessageForwarded comes after)
      const messageForwarded = db.find(MessageForwarded, {
        sameTxAfter: sentMessage,
        chain: event.args.chain,
      })
      if (!messageForwarded) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'zklink-nova',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [messageForwarded],
        }),
      ]

      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('zklink-nova.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [messageForwarded],
          }),
        )
      }

      return results
    }
  }
}
