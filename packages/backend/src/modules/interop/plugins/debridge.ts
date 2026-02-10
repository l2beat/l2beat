/* the deBridge messaging protocol allows for token transfers. The only difference between message and token transfer is that
the latter requires a token address and amount to be specified. In case of token transfer, the tokens are locked in the deBridgeGate contract on the source chain
and minted (or released if the native token is bridged) on the destination chain. */

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  ClaimedOrderCancel,
  ClaimedUnlock,
  CreatedOrder,
  SentOrderCancel,
  SentOrderUnlock,
} from './debridge-dln'
import { findParsedAround } from './hyperlane-hwr'
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

const parseSent = createEventParser(
  'event Sent(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, bytes receiver, uint256 nonce, uint256 indexed chainIdTo, uint32 referralCode, (uint256 receivedAmount, uint256 fixFee, uint256 transferFee, bool useAssetFee, bool isNativeToken) feeParams, bytes autoParams, address nativeSender)',
)

const parseClaimed = createEventParser(
  'event Claimed(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, address indexed receiver, uint256 nonce, uint256 indexed chainIdFrom, bytes autoParams, bool isNativeToken)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

const TRANSFER_AMOUNT_TOLERANCE_BPS = 500n

function isWithinTolerance(value: bigint, target: bigint): boolean {
  if (target === 0n) return value === 0n
  const delta = (target * TRANSFER_AMOUNT_TOLERANCE_BPS) / 10_000n
  return value >= target - delta && value <= target + delta
}

// https://docs.debridge.com/dmp-details/dmp/deployed-contracts
export const DEBRIDGE_NETWORKS = defineNetworks('debridge', [
  { chainId: '1', chain: 'ethereum' },
  { chainId: '42161', chain: 'arbitrum' },
  { chainId: '8453', chain: 'base' },
  { chainId: '10', chain: 'optimism' },
  // { chainId: '33139', chain: 'apechain' }, // not supported
  { chainId: '137', chain: 'polygonpos' },
  // { chainId: '324', chain: 'zksync2' }, // not supported
  { chainId: '2741', chain: 'abstract' },
  // { chainId: '747474', chain: 'katana' }, // not supported
  { chainId: '56', chain: 'bsc' },
])

export const Sent = createInteropEventType<{
  submissionId: `0x${string}`
  amount: bigint
  srcTokenAddress?: Address32
  srcWasBurned?: boolean
  $dstChain: string
}>('debridge.Sent', { direction: 'outgoing' })

export const Claimed = createInteropEventType<{
  submissionId: `0x${string}`
  amount: bigint
  dstTokenAddress?: Address32
  dstWasMinted?: boolean
  receiver: EthereumAddress
  $srcChain: string
}>('debridge.Claimed', { direction: 'incoming' })

export class DeBridgePlugin implements InteropPlugin {
  readonly name = 'debridge'

  capture(input: LogToCapture) {
    const sent = parseSent(input.log, null)
    if (sent) {
      let srcTokenAddress: Address32 | undefined
      let srcWasBurned: boolean | undefined
      if (sent.amount > 0n) {
        const transferInfo = findParsedAround(
          input.txLogs,
          input.log.logIndex ?? -1,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (!transfer || !isWithinTolerance(transfer.value, sent.amount)) {
              return
            }
            return {
              address: Address32.from(log.address),
              burned: Address32.from(transfer.to) === Address32.ZERO,
            }
          },
        )
        srcTokenAddress = transferInfo?.address
        srcWasBurned = transferInfo?.burned
      }
      if (!srcTokenAddress && sent.amount > 0n) {
        srcTokenAddress = Address32.NATIVE // gas does not emit
        srcWasBurned = false
      }
      return [
        Sent.create(input, {
          submissionId: sent.submissionId,
          srcTokenAddress,
          srcWasBurned,
          amount: sent.amount,
          $dstChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            sent.chainIdTo.toString(),
          ),
        }),
      ]
    }

    const claimed = parseClaimed(input.log, null)
    if (claimed) {
      let dstTokenAddress: Address32 | undefined
      let dstWasMinted: boolean | undefined
      if (claimed.amount > 0n) {
        const transferInfo = findParsedAround(
          input.txLogs,
          input.log.logIndex ?? -1,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (
              !transfer ||
              !isWithinTolerance(transfer.value, claimed.amount)
            ) {
              return
            }
            return {
              address: Address32.from(log.address),
              minted: Address32.from(transfer.from) === Address32.ZERO,
            }
          },
        )
        dstTokenAddress = transferInfo?.address
        dstWasMinted = transferInfo?.minted
      }

      return [
        Claimed.create(input, {
          submissionId: claimed.submissionId,
          amount: claimed.amount,
          dstTokenAddress,
          dstWasMinted,
          receiver: EthereumAddress(claimed.receiver),
          $srcChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            claimed.chainIdFrom.toString(),
          ),
        }),
      ]
    }
  }

  matchTypes = [Claimed]
  match(claimed: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!Claimed.checkType(claimed)) return
    const sent = db.find(Sent, {
      submissionId: claimed.args.submissionId,
    })
    if (!sent) return

    const results: MatchResult = []
    let app = 'unknown'
    const extraEvents: InteropEvent[] = []

    const hasTransfer = claimed.args.amount > 0
    if (hasTransfer) {
      app = 'tokenBridge'
      results.push(
        Result.Transfer('debridge.Transfer', {
          srcEvent: sent,
          srcTokenAddress: sent.args.srcTokenAddress ?? Address32.NATIVE,
          srcAmount: claimed.args.amount,
          srcWasBurned: sent.args.srcWasBurned,
          dstEvent: claimed,
          dstTokenAddress: claimed.args.dstTokenAddress ?? Address32.NATIVE,
          dstAmount: claimed.args.amount,
          dstWasMinted: claimed.args.dstWasMinted,
          bridgeType: 'lockAndMint'
        }),
      )
    }

    const claimedUnlockBatch = db.findAll(ClaimedUnlock, {
      sameTxBefore: claimed,
    })
    // dln fills are matched in debridge-dln.ts
    // dln settlement is batched and matched here, not in debridge-dln.ts
    if (claimedUnlockBatch.length > 0) {
      app = 'debridge-dln-settlement'
      const sentOrderUnlockBatch = db.findAll(SentOrderUnlock, {
        submissionId: claimed.args.submissionId,
      })
      const sentOrderUnlockById = new Map(
        sentOrderUnlockBatch.map((event) => [event.args.orderId, event]),
      )

      for (const claimedUnlock of claimedUnlockBatch) {
        const sentOrderUnlock = sentOrderUnlockById.get(
          claimedUnlock.args.orderId,
        )
        if (!sentOrderUnlock) continue

        // TODO: it is not really necessary to match the individual settlements here
        // but it might be interesting to match intent fill to its settlement at some point
        extraEvents.push(sentOrderUnlock, claimedUnlock)
        // would doublecount settlement transfers
        // results.push(
        //   Result.Transfer('debridge-dln-settlement.Transfer', {
        //     srcEvent: sentOrderUnlock,
        //     dstEvent: claimedUnlock,
        //     dstTokenAddress: claimedUnlock.args.giveTokenAddress,
        //     dstAmount: claimedUnlock.args.giveAmount,
        //   }),
        // )
      }
    }
    // cancellation: works like settlement but without the fill/transfer
    // (debridge message from dst to src)
    const claimedOrderCancel = db.find(ClaimedOrderCancel, {
      sameTxBefore: claimed,
    })
    if (claimedOrderCancel) {
      const sentOrderCancel = db.find(SentOrderCancel, {
        submissionId: claimed.args.submissionId,
      })
      if (sentOrderCancel) {
        const originalCreatedOrder = db.find(CreatedOrder, {
          orderId: sentOrderCancel.args.orderId,
        })
        if (originalCreatedOrder) {
          app = 'debridge-dln-cancellation'
          extraEvents.push(
            originalCreatedOrder,
            sentOrderCancel,
            claimedOrderCancel,
          )
        }
      }
    }

    results.push(
      Result.Message('debridge.Message', {
        app,
        srcEvent: sent,
        dstEvent: claimed,
        extraEvents,
      }),
    )

    return results
  }
}
