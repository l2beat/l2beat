import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseL2ToL1Tx = createEventParser(
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)',
)

export const L2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
}>('orbitstack.L2ToL1Tx', { ttl: 14 * UnixTime.DAY })

const parseOutBoxTransactionExecuted = createEventParser(
  'event OutBoxTransactionExecuted(address indexed to, address indexed l2Sender, uint256 indexed zero, uint256 transactionIndex)',
)

export const OutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
}>('orbitstack.OutBoxTransactionExecuted')

const ORBITSTACK_NETWORKS = defineNetworks('orbitstack', [
  {
    chain: 'arbitrum',
    arbsys: EthereumAddress('0x0000000000000000000000000000000000000064'),
    outbox: EthereumAddress('0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840'),
  },
])

export class OrbitStackPlugin implements InteropPlugin {
  name = 'orbitstack'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.outbox === EthereumAddress(input.log.address),
      )
      if (!network) return

      const otxe = parseOutBoxTransactionExecuted(input.log, [network.outbox])
      if (otxe) {
        return OutBoxTransactionExecuted.create(input.ctx, {
          chain: network.chain,
          position: Number(otxe.transactionIndex),
        })
      }
    } else {
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )
      if (!network) return

      const l2ToL1Tx = parseL2ToL1Tx(input.log, [network.arbsys])
      if (l2ToL1Tx) {
        return L2ToL1Tx.create(input.ctx, {
          chain: network.chain,
          position: Number(l2ToL1Tx.position),
        })
      }
    }
  }

  matchTypes = [OutBoxTransactionExecuted]
  match(
    outBoxTransactionExecuted: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OutBoxTransactionExecuted.checkType(outBoxTransactionExecuted)) return

    const l2ToL1Tx = db.find(L2ToL1Tx, {
      chain: outBoxTransactionExecuted.args.chain,
      position: outBoxTransactionExecuted.args.position,
    })
    if (!l2ToL1Tx) return

    return [
      Result.Message('orbistack.Message', {
        app: 'unknown',
        srcEvent: l2ToL1Tx,
        dstEvent: outBoxTransactionExecuted,
      }),
    ]
  }
}
