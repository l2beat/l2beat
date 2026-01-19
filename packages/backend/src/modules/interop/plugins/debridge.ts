/* the deBridge messaging protocol allows for token transfers. The only difference between message and token transfer is that
the latter requires a token address and amount to be specified. In case of token transfer, the tokens are locked in the deBridgeGate contract on the source chain
and minted (or released if the native token is bridged) on the destination chain. */

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { ClaimedUnlock, SentOrderUnlock } from './debridge-dln'
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

/*

  struct FeeParams {
        uint256 receivedAmount;
        uint256 fixFee;
        uint256 transferFee;
        bool useAssetFee;
        bool isNativeToken;
    }


    event Sent(
        bytes32 submissionId,
        bytes32 indexed debridgeId,
        uint256 amount,
        bytes receiver,
        uint256 nonce,
        uint256 indexed chainIdTo,
        uint32 referralCode,
        FeeParams feeParams,
        bytes autoParams,
        address nativeSender
    );

    /// @dev Emitted once the tokens are transferred and withdrawn on a target chain
    event Claimed(
        bytes32 submissionId,
        bytes32 indexed debridgeId,
        uint256 amount,
        address indexed receiver,
        uint256 nonce,
        uint256 indexed chainIdFrom,
        bytes autoParams,
        bool isNativeToken
    );

*/

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

export const DEBRIDGE_TOKENS: {
  tokenId: `0x${string}`
  symbol: string
  tokenAddresses: { [chain: string]: Address32 }
}[] = [
  {
    tokenId:
      '0x7a4f5988eb2e00ce51697c543e0163ef96f4ec0dfd6729d29b0a1dd88626f055',
    symbol: 'WETH',
    tokenAddresses: {
      arbitrum: Address32.from('0xcAB86F6Fb6d1C2cBeeB97854A0C023446A075Fe3'), // deBridge WETH
      ethereum: Address32.from('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
    },
  },
]

export const DEBRIDGE_NETWORKS = defineNetworks('debridge', [
  { chainId: '1', chain: 'ethereum' },
  { chainId: '42161', chain: 'arbitrum' },
  { chainId: '8453', chain: 'base' },
  { chainId: '10', chain: 'optimism' },
  // { chainId: '33139', chain: 'apechain' }, // not supported
  { chainId: '137', chain: 'polygonpos' },
  // { chainId: '324', chain: 'zksync2' }, // not supported
  { chainId: '2741', chain: 'abstract' },
])

export const Sent = createInteropEventType<{
  submissionId: `0x${string}`
  amount: bigint
  srcTokenAddress?: Address32
  $dstChain: string
}>('debridge.Sent')

export const Claimed = createInteropEventType<{
  submissionId: `0x${string}`
  amount: bigint
  dstTokenAddress?: Address32
  receiver: EthereumAddress
  $srcChain: string
}>('debridge.Claimed')

export class DeBridgePlugin implements InteropPlugin {
  readonly name = 'debridge'

  capture(input: LogToCapture) {
    const sent = parseSent(input.log, null)
    if (sent) {
      let srcTokenAddress: Address32 | undefined
      if (sent.amount > 0n) {
        srcTokenAddress = findParsedAround(
          input.txLogs,
          input.log.logIndex ?? -1,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (!transfer || !isWithinTolerance(transfer.value, sent.amount)) {
              return
            }
            return Address32.from(log.address)
          },
        )
      }
      return [
        Sent.create(input, {
          submissionId: sent.submissionId,
          srcTokenAddress,
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
      let srcTokenAddress: Address32 | undefined
      if (claimed.amount > 0n) {
        srcTokenAddress = findParsedAround(
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
            return Address32.from(log.address)
          },
        )
      }

      return [
        Claimed.create(input, {
          submissionId: claimed.submissionId,
          amount: claimed.amount,
          dstTokenAddress: srcTokenAddress,
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

    const hasTransfer = BigInt(claimed.args.amount) > 0

    const claimedUnlockBatch = db.findAll(ClaimedUnlock, {
      sameTxBefore: claimed,
    })
    let app = 'unknown'
    if (claimedUnlockBatch.length > 0) {
      app = 'debridge-dln-settlement'
    } else if (hasTransfer) {
      app = 'tokenBridge'
    }

    const results: MatchResult = [
      Result.Message('debridge.Message', {
        app,
        srcEvent: sent,
        dstEvent: claimed,
      }),
    ]
    if (hasTransfer) {
      results.push(
        Result.Transfer('debridge.Transfer', {
          srcEvent: sent,
          srcTokenAddress: sent.args.srcTokenAddress,
          srcAmount: claimed.args.amount,
          dstEvent: claimed,
          dstTokenAddress: claimed.args.dstTokenAddress,
          dstAmount: claimed.args.amount,
        }),
      )
    }
    if (claimedUnlockBatch.length > 0) {
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

        results.push(
          Result.Transfer('debridge-dln-settlement.Transfer', {
            srcEvent: sentOrderUnlock,
            dstEvent: claimedUnlock,
            dstTokenAddress: claimedUnlock.args.giveTokenAddress,
            dstAmount: claimedUnlock.args.giveAmount,
          }),
        )
      }
    }
    return results
  }
}
