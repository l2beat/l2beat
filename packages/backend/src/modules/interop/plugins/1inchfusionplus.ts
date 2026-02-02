import { Address32, EthereumAddress } from '@l2beat/shared-pure'
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
 */

//
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
  // no apechain
  {
    chain: 'polygonpos',
    chainId: 137,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  // no zksync
  // no abstract
])

const parseSrcEscrowCreated = createEventParser(
  'event SrcEscrowCreated((bytes32 orderHash, bytes32 hashlock, uint256 maker, uint256 taker, uint256 token, uint256 amount, uint256 safetyDeposit, uint256 timelocks) srcImmutables, (uint256 maker, uint256 amount, uint256 token, uint256 safetyDeposit, uint256 chainId) dstImmutablesComplement)',
)

const parseDstEscrowCreated = createEventParser(
  'event DstEscrowCreated(address escrow, bytes32 hashlock, uint256 taker)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

// const parseEscrowWithdrawal = createEventParser( // emitted by the escrow itself, not the factory (and in a different tx)
//   'event EscrowWithdrawal(bytes32 secret)',
// )

const DstEscrowCreated = createInteropEventType<{
  hashlock: `0x${string}`
  dstTokenAddress?: Address32
  dstAmount?: bigint
}>('oneinch-fusion-plus.DstEscrowCreated', { direction: 'incoming' })

const SrcEscrowCreated = createInteropEventType<{
  hashlock: string
  srcTokenId: bigint
  srcTokenAddress?: Address32
  srcAmount: bigint
  dstAmount: bigint
}>('oneinch-fusion-plus.SrcEscrowCreated', { direction: 'outgoing' })

export class OneinchFusionPlusPlugin implements InteropPlugin {
  readonly name = 'oneinch-fusion-plus'

  capture(input: LogToCapture) {
    const network = ONEINCH_FUSIONPLUS_NETWORKS.find(
      (n) => n.chain === input.chain,
    )
    if (!network) return

    const dstEscrowCreated = parseDstEscrowCreated(input.log, [network.address])
    if (dstEscrowCreated) {
      // Find Transfer event by searching through all preceding logs in the same tx in the worst case
      let dstTokenAddress: Address32 | undefined
      let dstAmount: bigint | undefined

      for (
        let offset = 1;
        // biome-ignore lint/style/noNonNullAssertion: It's there
        offset <= input.log.logIndex!;
        offset++
      ) {
        const precedingLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! - offset,
        )
        if (!precedingLog) break

        const transfer = parseTransfer(precedingLog, null)
        if (transfer) {
          // dst address must match `to` of Transfer
          if (
            transfer.to.toLowerCase() === dstEscrowCreated.escrow.toLowerCase()
          ) {
            dstTokenAddress = Address32.from(precedingLog.address)
            dstAmount = transfer.value
            break
          }
        }
      }
      return [
        DstEscrowCreated.create(input, {
          hashlock: dstEscrowCreated.hashlock,
          dstTokenAddress: dstTokenAddress ?? Address32.NATIVE, // if we do not find a Transfer event, assume native
          dstAmount,
        }),
      ]
    }

    const srcEscrowCreated = parseSrcEscrowCreated(input.log, [network.address])
    if (srcEscrowCreated) {
      // Find Transfer event by searching through all preceding logs in the same tx in the worst case
      let srcTokenAddress: Address32 | undefined

      for (
        let offset = 1;
        // biome-ignore lint/style/noNonNullAssertion: It's there
        offset <= input.log.logIndex!;
        offset++
      ) {
        const precedingLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! - offset,
        )
        if (!precedingLog) break

        const transfer = parseTransfer(precedingLog, null)
        if (transfer) {
          // src escrow address unknown
          if (transfer.value === srcEscrowCreated.srcImmutables.amount) {
            srcTokenAddress = Address32.from(precedingLog.address)
            break
          }
        }
      }
      return [
        SrcEscrowCreated.create(input, {
          hashlock: srcEscrowCreated.srcImmutables.hashlock,
          srcTokenId: srcEscrowCreated.srcImmutables.token, // 1inch token id, not token address
          srcAmount: srcEscrowCreated.srcImmutables.amount,
          srcTokenAddress: srcTokenAddress ?? Address32.NATIVE, // if we do not find a Transfer event, assume native
          dstAmount: srcEscrowCreated.dstImmutablesComplement.amount,
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
          srcTokenAddress: srcEscrowCreated.args.srcTokenAddress,
          srcAmount: srcEscrowCreated.args.srcAmount,
          srcWasBurned: false,
          dstEvent: dstEscrowCreated,
          dstTokenAddress: dstEscrowCreated.args.dstTokenAddress,
          dstAmount:
            dstEscrowCreated.args.dstAmount ?? srcEscrowCreated.args.dstAmount,
          dstWasMinted: false,
        }),
      ]
    }
  }
}
