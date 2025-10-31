/* in deBridge messaing protocol allows for token transfers. The only difference between message and token transfer is that
the latter requires a token address and amount to be specified. In case of token transfer, the tokens are locked in the deBridgeGate contract on the source chain
and minted (or released if the native token is bridged) on the destination chain. */

import { EthereumAddress } from '@l2beat/shared-pure'
import {
  Address32,
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
])

export const Sent = createInteropEventType<{
  submissionId: `0x${string}`
  debridgeId: `0x${string}`
  amount: string
  $dstChain: string
}>('debridge.Sent')

export const Claimed = createInteropEventType<{
  submissionId: `0x${string}`
  debridgeId: `0x${string}`
  amount: string
  receiver: EthereumAddress
  $srcChain: string
}>('debridge.Claimed')

export class DeBridgePlugin implements InteropPlugin {
  name = 'debridge'

  capture(input: LogToCapture) {
    const sent = parseSent(input.log, null)
    if (sent) {
      return [
        Sent.create(input.ctx, {
          submissionId: sent.submissionId,
          debridgeId: sent.debridgeId,
          amount: sent.amount.toString(),
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
      return [
        Claimed.create(input.ctx, {
          submissionId: claimed.submissionId,
          debridgeId: claimed.debridgeId,
          amount: claimed.amount.toString(),
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

  /* Matching alogrithm:
    1. For Each Claimed on DST
    2. Find Sent on SRC with the same submissionId
    3. Create Message
    4. If amount > 0 create Transfer
  */
  matchTypes = [Claimed]
  match(claimed: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!Claimed.checkType(claimed)) return
    const sent = db.find(Sent, {
      submissionId: claimed.args.submissionId,
    })
    if (!sent) return

    const hasTransfer = BigInt(claimed.args.amount) > 0
    const results: MatchResult = [
      Result.Message('debridge.Message', {
        app: hasTransfer ? 'debridge' : 'unknown',
        srcEvent: sent,
        dstEvent: claimed,
      }),
    ]
    if (hasTransfer) {
      results.push(
        Result.Transfer('debridge.Transfer', {
          srcEvent: sent,
          srcTokenAddress:
            DEBRIDGE_TOKENS.find((t) => t.tokenId === sent.args.debridgeId)
              ?.tokenAddresses[sent.ctx.chain] ?? Address32.ZERO,
          srcAmount: BigInt(claimed.args.amount),
          dstEvent: claimed,
          dstTokenAddress:
            DEBRIDGE_TOKENS.find((t) => t.tokenId === claimed.args.debridgeId)
              ?.tokenAddresses[claimed.ctx.chain] ?? Address32.ZERO,
          dstAmount: BigInt(claimed.args.amount),
        }),
      )
    }
    return results
  }
}
