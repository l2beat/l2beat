import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { keccak256 } from 'viem'
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

/**
 * tracks the 1inch Fusion+ HTLC-based intent protocol.
 * a swap counts only once the destination escrow is withdrawn to the user. swaps whose escrows are cancelled
 * and refunded produce no transfer, and their escrow creation events are left to expire.
 * escrow timelocks are minutes (cancellation within ~10 min of creation onchain), well within the default TTL.
 */

// https://business.1inch.com/portal/documentation/overview#supported-chains
// chainconfeeg
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
  {
    chain: 'zksync2',
    chainId: 324,
    address: EthereumAddress('0x584aEaB186D81dbB52a8a14820c573480c3d4773'),
  },
  // no abstract
  // no katana
  {
    chain: 'bsc',
    chainId: 56,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'gnosis',
    chainId: 100,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'linea',
    chainId: 59144,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'unichain',
    chainId: 130,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  {
    chain: 'avalanche',
    chainId: 43114,
    address: EthereumAddress('0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A'),
  },
  // monad, tempo unsupported
])

const parseSrcEscrowCreated = createEventParser(
  'event SrcEscrowCreated((bytes32 orderHash, bytes32 hashlock, uint256 maker, uint256 taker, uint256 token, uint256 amount, uint256 safetyDeposit, uint256 timelocks) srcImmutables, (uint256 maker, uint256 amount, uint256 token, uint256 safetyDeposit, uint256 chainId) dstImmutablesComplement)',
)

const parseDstEscrowCreated = createEventParser(
  'event DstEscrowCreated(address escrow, bytes32 hashlock, uint256 taker)',
)

// emitted by the per-swap escrow clones, in a later tx than the escrow creation
const parseEscrowWithdrawal = createEventParser(
  'event EscrowWithdrawal(bytes32 secret)',
)

const DstEscrowCreated = createInteropEventType<{
  escrow: EthereumAddress
  hashlock: `0x${string}`
}>('oneinch-fusion-plus.DstEscrowCreated')

const EscrowWithdrawal = createInteropEventType<{
  escrow: EthereumAddress
  hashlock: `0x${string}`
}>('oneinch-fusion-plus.EscrowWithdrawal', { direction: 'incoming' })

const SrcEscrowCreated = createInteropEventType<{
  hashlock: `0x${string}`
  srcTokenAddress: Address32
  srcAmount: bigint
  dstTokenAddress: Address32
  dstAmount: bigint
  $dstChain: string
}>('oneinch-fusion-plus.SrcEscrowCreated', { direction: 'outgoing' })

// 1inch `Address` values keep the address in the low 160 bits, and the zero address stands for the native token
function toTokenAddress(value: bigint): Address32 {
  const address = value & ((1n << 160n) - 1n)
  if (address === 0n) return Address32.NATIVE
  return Address32.from(`0x${address.toString(16).padStart(40, '0')}`)
}

export class OneinchFusionPlusPlugin implements InteropPlugin {
  readonly name = 'oneinch-fusion-plus'

  capture(input: LogToCapture) {
    const network = ONEINCH_FUSIONPLUS_NETWORKS.find(
      (n) => n.chain === input.chain,
    )
    if (!network) return

    const dstEscrowCreated = parseDstEscrowCreated(input.log, [network.address])
    if (dstEscrowCreated) {
      return [
        DstEscrowCreated.create(input, {
          escrow: EthereumAddress(dstEscrowCreated.escrow),
          hashlock: dstEscrowCreated.hashlock,
        }),
      ]
    }

    const escrowWithdrawal = parseEscrowWithdrawal(input.log, null)
    if (escrowWithdrawal) {
      return [
        EscrowWithdrawal.create(input, {
          escrow: EthereumAddress(input.log.address),
          hashlock: keccak256(escrowWithdrawal.secret),
        }),
      ]
    }

    const srcEscrowCreated = parseSrcEscrowCreated(input.log, [network.address])
    if (srcEscrowCreated) {
      const { srcImmutables, dstImmutablesComplement } = srcEscrowCreated
      return [
        SrcEscrowCreated.create(input, {
          hashlock: srcImmutables.hashlock,
          srcTokenAddress: toTokenAddress(srcImmutables.token),
          srcAmount: srcImmutables.amount,
          dstTokenAddress: toTokenAddress(dstImmutablesComplement.token),
          dstAmount: dstImmutablesComplement.amount,
          $dstChain: findChain(
            ONEINCH_FUSIONPLUS_NETWORKS,
            (n) => n.chainId,
            Number(dstImmutablesComplement.chainId),
          ),
        }),
      ]
    }
  }

  matchTypes = [EscrowWithdrawal]
  match(
    escrowWithdrawal: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (EscrowWithdrawal.checkType(escrowWithdrawal)) {
      // source escrows and other factories' clones emit EscrowWithdrawal too. only a destination escrow
      // that the factory created earlier on the same chain counts, so anything else will never match
      const dstEscrowCreated = db.find(DstEscrowCreated, {
        escrow: escrowWithdrawal.args.escrow,
        hashlock: escrowWithdrawal.args.hashlock,
        ctx: { chain: escrowWithdrawal.ctx.chain },
      })
      if (!dstEscrowCreated) return [Result.Ignore([escrowWithdrawal])]

      const srcEscrowCreated = db.find(SrcEscrowCreated, {
        hashlock: escrowWithdrawal.args.hashlock,
        $dstChain: escrowWithdrawal.ctx.chain,
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
          dstEvent: escrowWithdrawal,
          dstTokenAddress: srcEscrowCreated.args.dstTokenAddress,
          dstAmount: srcEscrowCreated.args.dstAmount,
          dstWasMinted: false,
          extraEvents: [dstEscrowCreated],
        }),
      ]
    }
  }
}
