import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/*
    event OrderCreated(bytes32 indexed orderHash, Order order);
    event OrderFilled(bytes32 indexed orderHash, Order order);
    event SettlementForwarded(bytes32 indexed orderHash);
    event TokensReleased(bytes32 indexed orderHash);
    struct Order {
        // Address that will supply the fromAmount of fromToken on the fromChain.
        address fromAddress;
        // Address to receive the fillAmount of toToken on the toChain.
        address toAddress;
        // Address that will fill the Order on the toChain.
        address filler;
        // Address of the ERC20 token being supplied on the fromChain.
        // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE in case of native token.
        address fromToken;
        // Address of the ERC20 token being supplied on the toChain.
        // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE in case of native token.
        address toToken;
        // Expiration in UNIX for the Order to be created on the fromChain.
        uint256 expiry;
        // Amount of fromToken to be provided by the fromAddress.
        uint256 fromAmount;
        // Amount of toToken to be provided by the filler.
        uint256 fillAmount;
        // Protocol fees are taken out of the fromAmount and are calculated within the Spoke.sol
        // contract for single chain orders or on the Hub for cross chain orders. 
        // The following formula determines the amount of fromToken reserved as fees:
        // fee = (fromAmount * feeRate) / 1000000
        uint256 feeRate;
        // Chain ID of the chain the Order will be created on.
        uint256 fromChain;
        // Chain ID of the chain the Order will be filled on.
        uint256 toChain;
        // Keccak256 hash of the abi.encoded ISquidMulticall.Call[] calldata calls that should be provided
        // at the time of filling the order.
        bytes32 postHookHash;
    }
*/

const parseOrderCreated = createEventParser(
  'event OrderCreated(bytes32 indexed orderHash, (address fromAddress, address toAddress, address filler, address fromToken, address toToken, uint256 expiry, uint256 fromAmount, uint256 fillAmount, uint256 feeRate, uint256 fromChain, uint256 toChain, bytes32 postHookHash) order)',
)

const parseOrderFilled = createEventParser(
  'event OrderFilled(bytes32 indexed orderHash, (address fromAddress, address toAddress, address filler, address fromToken, address toToken, uint256 expiry, uint256 fromAmount, uint256 fillAmount, uint256 feeRate, uint256 fromChain, uint256 toChain, bytes32 postHookHash) order)',
)

export const CHAIN_IDS = [
  { chainId: '1', chain: 'ethereum' },
  { chainId: '42161', chain: 'arbitrum' },
  { chainId: '8453', chain: 'base' },
]

export const LogOrderCreated = createBridgeEventType<{
  orderHash: `0x${string}`
  fromToken: EthereumAddress
  toToken: EthereumAddress
  fromAmount: string
  fillAmount: string
  $dstChain: string
}>('squid-coral.LogOrderCreated')

export const LogOrderFilled = createBridgeEventType<{
  orderHash: `0x${string}`
  fromToken: EthereumAddress
  toToken: EthereumAddress
  fromAmount: string
  fillAmount: string
  $srcChain: string
}>('squid-coral.LogOrderFilled')

export class SquidCoralPlugin implements BridgePlugin {
  name = 'squid-coral'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const logOrderCreated = parseOrderCreated(input.log, null)
    if (logOrderCreated) {
      return LogOrderCreated.create(input.ctx, {
        orderHash: logOrderCreated.orderHash,
        fromToken: EthereumAddress(logOrderCreated.order.fromToken),
        toToken: EthereumAddress(logOrderCreated.order.toToken),
        fromAmount: logOrderCreated.order.fromAmount.toString(),
        fillAmount: logOrderCreated.order.fillAmount.toString(),
        $dstChain:
          CHAIN_IDS.find(
            (c) => c.chainId === logOrderCreated.order.toChain.toString(),
          )?.chain ?? 'unknown',
      })
    }

    const logOrderFilled = parseOrderFilled(input.log, null)
    if (logOrderFilled) {
      return LogOrderFilled.create(input.ctx, {
        orderHash: logOrderFilled.orderHash,
        fromToken: EthereumAddress(logOrderFilled.order.fromToken),
        toToken: EthereumAddress(logOrderFilled.order.toToken),
        fromAmount: logOrderFilled.order.fromAmount.toString(),
        fillAmount: logOrderFilled.order.fillAmount.toString(),
        $srcChain:
          CHAIN_IDS.find(
            (c) => c.chainId === logOrderFilled.order.fromChain.toString(),
          )?.chain ?? 'unknown',
      })
    }
  }

  /* Matching alogrithm:
1. For Each LogOrderFilled on DST
2. Find LogOrderCreated on SRC with the same orderHash
*/
  match(orderFilled: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!LogOrderFilled.checkType(orderFilled)) return

    const orderCreated = db.find(LogOrderCreated, {
      orderHash: orderFilled.args.orderHash,
    })
    if (!orderCreated) return

    return [
      Result.Transfer('squid-coral.Swap', {
        srcEvent: orderCreated,
        srcTokenAddress: orderCreated.args.fromToken,
        srcAmount: orderCreated.args.fromAmount,
        dstEvent: orderFilled,
        dstTokenAddress: orderFilled.args.toToken,
        dstAmount: orderFilled.args.fillAmount,
      }),
    ]
  }
}
