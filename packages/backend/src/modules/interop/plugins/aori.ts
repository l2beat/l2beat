import { EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzero/layerzero-v2.plugin'
import { STARGATE_NETWORKS } from './stargate'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const AORI_NETWORKS = defineNetworks('aori', [
  {
    chainId: 1,
    eid: 30101,
    chain: 'ethereum',
    address: EthereumAddress('0x0736bdc975af0675b9a045384efed91360d25479'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chain: 'arbitrum',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chain: 'base',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
  {
    chainId: 10,
    eid: 30111,
    chain: 'optimism',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
])

const parseSettleSent = createEventParser(
  'event SettleSent(uint32 indexed srcEid, address indexed filler, bytes payload, bytes32 guid, uint64 nonce, uint256 fee)',
)

const AoriSettleSent = createInteropEventType<{
  $dstChain: string
  guid: string
}>('aori.SettleSent')

// destination event not needed for now
// const parseSettle = createEventParser('event Settle(bytes32 indexed orderId)')
// const AoriSettle = createInteropEventType<{
//   $srcChain: string
// }>('aori.Settle')

export class AoriPlugin implements InteropPlugin {
  name = 'aori'

  capture(input: LogToCapture) {
    const network = AORI_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const settleSent = parseSettleSent(input.log, [network.address])
    if (settleSent) {
      const $dstChain = findChain(
        STARGATE_NETWORKS,
        (x) => x.eid,
        settleSent.srcEid, // yes
      )
      return [
        AoriSettleSent.create(input.ctx, {
          $dstChain,
          guid: settleSent.guid,
        }),
      ]
    }
  }

  matchTypes = [PacketDelivered]
  match(
    packetDelivered: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!PacketDelivered.checkType(packetDelivered)) return
    const packetSent = db.find(PacketSent, { guid: packetDelivered.args.guid })
    if (!packetSent) return
    const settleSent = db.find(AoriSettleSent, {
      guid: packetDelivered.args.guid,
    })
    if (!settleSent) return
    return [
      Result.Message('layerzero-v2.Message', {
        app: 'aori-settlement',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
        extraEvents: [settleSent],
      }),
    ]
  }
}
