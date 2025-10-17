import type { EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzero-v2'
import { STARGATE_NETWORKS } from './stargate'
import {
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

const parseCreditsSent = createEventParser(
  'event CreditsSent(uint32 dstEid, (uint32 srcEid, uint64 amount)[] credits)',
)

const parseCreditsReceived = createEventParser(
  'event CreditsReceived(uint32 srcEid, (uint32 srcEid, uint64 amount)[] credits)',
)

const StargateV2CreditsSent = createInteropEventType<{
  $dstChain: string
}>('stargate-v2-credit.CreditsSent')

const StargateV2CreditsReceived = createInteropEventType<{
  $srcChain: string
}>('stargate-v2-credit.CreditsReceived')

export class StargateV2CreditPlugin implements InteropPlugin {
  name = 'stargate-v2-credit'

  capture(input: LogToCapture) {
    const network = STARGATE_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const poolAddresses = [
      network.nativePool.address,
      network.usdcPool.address,
      network.usdtPool?.address,
    ].filter((addy): addy is EthereumAddress => !!addy)

    const creditsSent = parseCreditsSent(input.log, poolAddresses)
    if (creditsSent) {
      const $dstChain = findChain(
        STARGATE_NETWORKS,
        (x) => x.eid,
        creditsSent.dstEid,
      )
      return StargateV2CreditsSent.create(input.ctx, { $dstChain })
    }

    const creditsReceived = parseCreditsReceived(input.log, poolAddresses)
    if (creditsReceived) {
      const $srcChain = findChain(
        STARGATE_NETWORKS,
        (x) => x.eid,
        creditsReceived.srcEid,
      )
      return StargateV2CreditsReceived.create(input.ctx, { $srcChain })
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
    const creditsSent = db.find(StargateV2CreditsSent, {
      ctx: { txHash: packetSent.ctx.txHash },
    }) // only checking same tx emitting here, so plugin should be as low as possible in the hierarchy
    const creditsReceived = db.find(StargateV2CreditsReceived, {
      ctx: { txHash: packetDelivered.ctx.txHash },
    })
    if (!creditsSent || !creditsReceived) return
    return [
      Result.Message('layerzero-v2.Message', {
        app: 'stargate-v2-credit',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
      Result.Transfer('stargate-v2-credit', {
        srcEvent: creditsSent,
        dstEvent: creditsReceived,
      }),
    ]
  }
}
