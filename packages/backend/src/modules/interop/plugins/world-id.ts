import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  OPSTACK_NETWORKS,
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

const WORLD_ID_BRIDGE = EthereumAddress(
  '0xa6d85f3b3be6ff6dc52c3aabe9a35d0ce252b79f',
)

const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

const RootPropagated = createInteropEventType<{
  chain: string
}>('world-id.RootPropagated')

const parseRootPropagated = createEventParser(
  'event RootPropagated(uint256 root)',
)

export class WorldIdPlugin implements InteropPlugin {
  readonly name = 'world-id'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const rootPropagated = parseRootPropagated(input.log, [WORLD_ID_BRIDGE])
      if (rootPropagated) {
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(
            EthereumAddress(log.address).toString(),
          )
          if (network) {
            return [RootPropagated.create(input, { chain: network.chain })]
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

      const rootPropagated = db.find(RootPropagated, {
        sameTxAfter: sentMessage,
        chain: event.args.chain,
      })
      if (!rootPropagated) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'world-id',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [rootPropagated],
        }),
      ]

      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('world-id.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [rootPropagated],
          }),
        )
      }

      return results
    }
  }
}
