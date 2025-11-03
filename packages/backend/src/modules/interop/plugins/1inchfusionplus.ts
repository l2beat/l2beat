import { EthereumAddress } from '@l2beat/shared-pure'
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

/**
 * minimally tracks the 1inch Fusion+ HTLC-based intent protocol, mainly all messages.
 * the two events tracked do not track whether the user withdraws, meaning it can happen that we track intents that were not fully completed.
 * if we track the withdrawal as completion, we will see higher latency, but more solid crosschain events.
 * only supports token IDs for now, which are 1inch-specific.
 */

const ONEINCH_FUSIONPLUS_NETWORKS = defineNetworks('oneinch-fusion-plus', [
  {
    chain: 'ethereum',
    chainId: 1,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'), // escrowFactory contract
  },
  {
    chain: 'arbitrum',
    chainId: 42161,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'base',
    chainId: 8453,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'optimism',
    chainId: 10,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
])

const parseSrcEscrowCreated = createEventParser(
  'event SrcEscrowCreated((bytes32 orderHash, bytes32 hashlock, uint256 maker, uint256 taker, uint256 token, uint256 amount, uint256 safetyDeposit, uint256 timelocks) srcImmutables, (uint256 maker, uint256 amount, uint256 token, uint256 safetyDeposit, uint256 chainId) dstImmutablesComplement)',
)

const parseDstEscrowCreated = createEventParser(
  'event DstEscrowCreated(address escrow, bytes32 hashlock, uint256 taker)',
)

// const parseEscrowWithdrawal = createEventParser( // emitted by the escrow itself, not the factory (and in a different tx)
//   'event EscrowWithdrawal(bytes32 secret)',
// )

const DstEscrowCreated = createInteropEventType<{
  hashlock: `0x${string}`
}>('oneinch-fusion-plus.DstEscrowCreated')

const SrcEscrowCreated = createInteropEventType<{
  hashlock: string
  srcTokenId: string
  srcAmount: string
}>('oneinch-fusion-plus.SrcEscrowCreated')

export class OneinchFusionPlusPlugin implements InteropPlugin {
  name = 'oneinch-fusion-plus'

  capture(input: LogToCapture) {
    const network = ONEINCH_FUSIONPLUS_NETWORKS.find(
      (n) => n.chain === input.ctx.chain,
    )
    if (!network) return

    const dstEscrowCreated = parseDstEscrowCreated(input.log, [network.address])
    if (dstEscrowCreated) {
      return [
        DstEscrowCreated.create(input.ctx, {
          hashlock: dstEscrowCreated.hashlock,
        }),
      ]
    }

    const srcEscrowCreated = parseSrcEscrowCreated(input.log, [network.address])
    if (srcEscrowCreated) {
      return [
        SrcEscrowCreated.create(input.ctx, {
          hashlock: srcEscrowCreated.srcImmutables.hashlock,
          srcTokenId: srcEscrowCreated.srcImmutables.token.toString(), // 1inch token id, not token address
          srcAmount: srcEscrowCreated.srcImmutables.amount.toString(),
        }),
      ]
    }
  }

  matchTypes = [DstEscrowCreated]
  match(
    dstEscrowCreated: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (DstEscrowCreated.checkType(dstEscrowCreated)) {
      const srcEscrowCreated = db.find(SrcEscrowCreated, {
        hashlock: dstEscrowCreated.args.hashlock,
      })
      if (!srcEscrowCreated) return

      return [
        Result.Message('oneinch-fusion-plus.Message', {
          app: 'oneinch-fusion-plus',
          srcEvent: srcEscrowCreated,
          dstEvent: dstEscrowCreated,
        }),
        Result.Transfer('oneinch-fusion-plus.Transfer', {
          srcEvent: srcEscrowCreated,
          srcAmount: BigInt(srcEscrowCreated.args.srcAmount),
          dstEvent: dstEscrowCreated,
        }),
      ]
    }
  }
}
