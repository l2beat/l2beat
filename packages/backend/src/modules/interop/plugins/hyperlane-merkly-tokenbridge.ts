/**
 * Merkly tokenbridge via Hyperlane AMB (there are other merkly bridges)
 * in practice Merkly is only used to bridge ETH/WETH (liquidity pool)
 * does not emit at the destination, so for matching it behaves like a half-HWR with ETH as the asset
 * NON-MINTING
 */
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { Dispatch, Process, parseDispatch, parseDispatchId } from './hyperlane'
import { findParsedAround, parseSentTransferRemote } from './hyperlane-hwr'
import {
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

// https://minter.merkly.com/hyperlane/docs
const MERKLY_TOKENBRIDGE_NETWORKS = defineNetworks(
  'hyperlane-merkly-tokenbridge',
  [
    {
      chain: 'ethereum',
      chainId: 1,
      address: EthereumAddress('0x64D9b639aE85a1e436c1752889c5C40699f3887C'),
    },
    {
      chain: 'arbitrum',
      chainId: 42161,
      address: EthereumAddress('0x233888F5Dc1d3C0360b559aBc029675290DAFa70'),
    },
    {
      chain: 'base',
      chainId: 8453,
      address: EthereumAddress('0x0cb0354E9C51960a7875724343dfC37B93d32609'),
    },
    {
      chain: 'optimism',
      chainId: 10,
      address: EthereumAddress('0xC110E7FAA95680c79937CCACa3d1caB7902bE25e'),
    },
    // no apechain
    {
      chain: 'polygonpos',
      chainId: 137,
      address: EthereumAddress('0x0cb0354E9C51960a7875724343dfC37B93d32609'),
      token: EthereumAddress('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'),
    },
    // no zksync2
    {
      chain: 'abstract',
      chainId: 2741,
      address: EthereumAddress('0xa0be52cEA8BDC5CF39ca6EdB4FeBb9610ef68750'),
    },
    // no katana
    // no bsc
  ],
)

export const HwrTransferSentMerkly = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  destination: number
  recipient: Address32
  amount: bigint
  tokenAddress: Address32
}>('hyperlane-merkly-tokenbridge.TransferSent')

export class HyperlaneMerklyTokenBridgePlugin implements InteropPlugin {
  readonly name = 'hyperlane-merkly-tokenbridge'

  capture(input: LogToCapture) {
    const network = MERKLY_TOKENBRIDGE_NETWORKS.find(
      (n) => n.chain === input.chain,
    )
    if (!network) return

    const sentTransferRemote = parseSentTransferRemote(input.log, [
      network.address, // important to filter by emitter as this is the only distinction from other HWR
    ])
    if (sentTransferRemote) {
      const senderAddress = input.log.address.toLowerCase()
      const messageId = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (txLog, index) => {
          const dispatch = parseDispatch(txLog, null)
          if (!dispatch) return
          if (dispatch.sender.toLowerCase() !== senderAddress) return
          // TODO: edge case logs
          if (
            Number(dispatch.destination) !==
            Number(sentTransferRemote.destination)
          )
            return

          const nextLog = input.txLogs[index + 1]
          const dispatchId = nextLog && parseDispatchId(nextLog, null)
          return dispatchId?.messageId
        },
      )
      if (!messageId) return

      const $dstChain = findChain(
        MERKLY_TOKENBRIDGE_NETWORKS,
        (x) => x.chainId,
        Number(sentTransferRemote.destination),
      )

      return [
        HwrTransferSentMerkly.create(input, {
          messageId,
          $dstChain,
          destination: Number(sentTransferRemote.destination),
          recipient: Address32.from(sentTransferRemote.recipient),
          amount: sentTransferRemote.amount,
          tokenAddress: network.token
            ? Address32.from(network.token)
            : Address32.NATIVE, // we assume ETH (empirically, contracts are unverified)
        }),
      ]
    }
  }

  matchTypes = [Process]
  match(process: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (Process.checkType(process)) {
      const network = MERKLY_TOKENBRIDGE_NETWORKS.find(
        (n) => n.chain === process.ctx.chain,
      )
      const hwrSentMerkly = db.find(HwrTransferSentMerkly, {
        messageId: process.args.messageId,
      })
      if (!hwrSentMerkly) return

      const dispatch = db.find(Dispatch, {
        messageId: process.args.messageId,
      })
      if (!dispatch) {
        return
      }

      return [
        Result.Message('hyperlane.Message', {
          // there are non-hyperlane merkly bridges
          app: 'merkly-tokenbridge-hyperlane',
          srcEvent: dispatch,
          dstEvent: process,
        }),
        Result.Transfer('merkly-tokenbridge-hyperlane.Transfer', {
          srcEvent: hwrSentMerkly,
          srcTokenAddress: hwrSentMerkly.args.tokenAddress,
          srcAmount: hwrSentMerkly.args.amount,
          dstEvent: process, // merkly does not emit at destination
          dstTokenAddress: network?.token
            ? Address32.from(network.token)
            : Address32.NATIVE,
          dstAmount: hwrSentMerkly.args.amount,
        }),
      ]
    }
  }
}
