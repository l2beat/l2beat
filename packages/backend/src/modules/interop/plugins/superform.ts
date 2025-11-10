import { EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzero/layerzero-v2.plugin'
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

const SUPERFORM_NETWORKS = defineNetworks('superform', [
  {
    chainId: 1,
    eid: 30101,
    chain: 'ethereum',
    address: EthereumAddress('0xa195608C2306A26f727d5199D5A382a4508308DA'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chain: 'arbitrum',
    address: EthereumAddress('0xa195608C2306A26f727d5199D5A382a4508308DA'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chain: 'base',
    address: EthereumAddress('0xa195608C2306A26f727d5199D5A382a4508308DA'),
  },
  {
    chainId: 10,
    eid: 30111,
    chain: 'optimism',
    address: EthereumAddress('0xa195608C2306A26f727d5199D5A382a4508308DA'),
  },
])

const parseCrossChainInitiatedDepositMulti = createEventParser(
  'event CrossChainInitiatedDepositMulti(uint256 indexed payloadId, uint64 indexed dstChainId, uint256[] superformIds, uint256[] amountsIn, uint8[] bridgeIds, uint8[] ambIds)',
)
const parseCrossChainInitiatedDepositSingle = createEventParser(
  'event CrossChainInitiatedDepositSingle(uint256 indexed payloadId, uint64 indexed dstChainId, uint256 superformIds, uint256 amountIn, uint8 bridgeId, uint8[] ambIds)',
)
const parseCrossChainInitiatedWithdrawMulti = createEventParser(
  'event CrossChainInitiatedWithdrawMulti(uint256 indexed payloadId, uint64 indexed dstChainId, uint256[] superformIds, uint8[] ambIds)',
)
const parseCrossChainInitiatedWithdrawSingle = createEventParser(
  'event CrossChainInitiatedWithdrawSingle(uint256 indexed payloadId, uint64 indexed dstChainId, uint256 superformIds, uint8[] ambIds)',
)
const SuperformCrosschainAction = createInteropEventType<{
  $dstChain: string
}>('superform.CrosschainAction')

export class SuperformPlugin implements InteropPlugin {
  name = 'superform'

  capture(input: LogToCapture) {
    const network = SUPERFORM_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const crossChainInitiatedDepositMulti =
      parseCrossChainInitiatedDepositMulti(input.log, [network.address])
    if (crossChainInitiatedDepositMulti) {
      const $dstChain = findChain(
        SUPERFORM_NETWORKS,
        (x) => BigInt(x.chainId),
        crossChainInitiatedDepositMulti.dstChainId,
      )
      return [
        SuperformCrosschainAction.create(input.ctx, {
          $dstChain,
        }),
      ]
    }
    const crossChainInitiatedDepositSingle =
      parseCrossChainInitiatedDepositSingle(input.log, [network.address])
    if (crossChainInitiatedDepositSingle) {
      const $dstChain = findChain(
        SUPERFORM_NETWORKS,
        (x) => BigInt(x.chainId),
        crossChainInitiatedDepositSingle.dstChainId,
      )
      return [
        SuperformCrosschainAction.create(input.ctx, {
          $dstChain,
        }),
      ]
    }
    const crossChainInitiatedWithdrawMulti =
      parseCrossChainInitiatedWithdrawMulti(input.log, [network.address])
    if (crossChainInitiatedWithdrawMulti) {
      const $dstChain = findChain(
        SUPERFORM_NETWORKS,
        (x) => BigInt(x.chainId),
        crossChainInitiatedWithdrawMulti.dstChainId,
      )
      return [
        SuperformCrosschainAction.create(input.ctx, {
          $dstChain,
        }),
      ]
    }
    const crossChainInitiatedWithdrawSingle =
      parseCrossChainInitiatedWithdrawSingle(input.log, [network.address])
    if (crossChainInitiatedWithdrawSingle) {
      const $dstChain = findChain(
        SUPERFORM_NETWORKS,
        (x) => BigInt(x.chainId),
        crossChainInitiatedWithdrawSingle.dstChainId,
      )
      return [
        SuperformCrosschainAction.create(input.ctx, {
          $dstChain,
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
    const superformCrosschainAction = db.find(SuperformCrosschainAction, {
      sameTxBefore: packetSent,
    })
    if (!superformCrosschainAction) return
    return [
      Result.Message('layerzero-v2.Message', {
        app: 'superform',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
        extraEvents: [superformCrosschainAction],
      }),
    ]
  }
}
