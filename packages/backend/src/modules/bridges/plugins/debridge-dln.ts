import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/*
struct Order {
        /// Nonce for each maker.
        uint64 makerOrderNonce;
        /// Order maker address (EOA signer for EVM) in the source chain.
        bytes makerSrc;
        /// Chain ID where the order's was created.
        uint256 giveChainId;
        /// Address of the ERC-20 token that the maker is offering as part of this order.
        /// Use the zero address to indicate that the maker is offering a native blockchain token (such as Ether, Matic, etc.).
        bytes giveTokenAddress;
        /// Amount of tokens the maker is offering.
        uint256 giveAmount;
        // the ID of the chain where an order should be fulfilled.
        uint256 takeChainId;
        /// Address of the ERC-20 token that the maker is willing to accept on the destination chain.
        bytes takeTokenAddress;
        /// Amount of tokens the maker is willing to accept on the destination chain.
        uint256 takeAmount;
        /// Address on the destination chain where funds should be sent upon order fulfillment.
        bytes receiverDst;
        /// Address on the source (current) chain authorized to patch the order by adding more input tokens, making it more attractive to takers.
        bytes givePatchAuthoritySrc;
        /// Address on the destination chain authorized to patch the order by reducing the take amount, making it more attractive to takers,
        /// and can also cancel the order in the take chain.
        bytes orderAuthorityAddressDst;
        // An optional address restricting anyone in the open market from fulfilling
        // this order but the given address. This can be useful if you are creating a order
        // for a specific taker. By default, set to empty bytes array (0x)
        bytes allowedTakerDst;
        // An optional address on the source (current) chain where the given input tokens
        // would be transferred to in case order cancellation is initiated by the orderAuthorityAddressDst
        // on the destination chain. This property can be safely set to an empty bytes array (0x):
        // in this case, tokens would be transferred to the arbitrary address specified
        // by the orderAuthorityAddressDst upon order cancellation
        bytes allowedCancelBeneficiarySrc;
        /// An optional external call data payload.
        bytes externalCall;
    }

        event CreatedOrder(
        DlnOrderLib.Order order,
        bytes32 orderId,
        bytes affiliateFee,
        uint256 nativeFixFee,
        uint256 percentFee,
        uint32 referralCode,
        bytes metadata
    );

        event FulfilledOrder(DlnOrderLib.Order order, bytes32 orderId, address sender, address unlockAuthority);

*/

const parseCreatedOrder = createEventParser(
  'event CreatedOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, bytes affiliateFee, uint256 nativeFixFee, uint256 percentFee, uint32 referralCode, bytes metadata)',
)

const parseFulfilledOrder = createEventParser(
  'event FulfilledOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, address sender, address unlockAuthority)',
)

export const DEBRIDGE_NETWORKS = defineNetworks('debridge', [
  { chainId: '1', chain: 'ethereum' },
  { chainId: '42161', chain: 'arbitrum' },
  { chainId: '8453', chain: 'base' },
])

export const LogCreatedOrder = createBridgeEventType<{
  orderId: `0x${string}`
  fromToken: EthereumAddress
  toToken: EthereumAddress
  fromAmount: string
  fillAmount: string
  $dstChain: string
}>('debridge-dln.CreatedOrder')

export const LogFulfilledOrder = createBridgeEventType<{
  orderId: `0x${string}`
  fromToken: EthereumAddress
  toToken: EthereumAddress
  fromAmount: string
  fillAmount: string
  $srcChain: string
}>('debridge-dln.FulfilledOrder')

export class DeBridgeDlnPlugin implements BridgePlugin {
  name = 'debridge-dln'

  capture(input: LogToCapture) {
    const logOrderCreated = parseCreatedOrder(input.log, null)
    if (logOrderCreated) {
      return LogCreatedOrder.create(input.ctx, {
        orderId: logOrderCreated.orderId,
        fromToken: EthereumAddress(logOrderCreated.order.giveTokenAddress),
        toToken: EthereumAddress(logOrderCreated.order.takeTokenAddress),
        fromAmount: logOrderCreated.order.giveAmount.toString(),
        fillAmount: logOrderCreated.order.takeAmount.toString(),
        $dstChain:
          DEBRIDGE_NETWORKS.find(
            (c) => c.chainId === logOrderCreated.order.takeChainId.toString(),
          )?.chain ?? 'unknown',
      })
    }

    const logOrderFilled = parseFulfilledOrder(input.log, null)
    if (logOrderFilled) {
      return LogFulfilledOrder.create(input.ctx, {
        orderId: logOrderFilled.orderId,
        fromToken: EthereumAddress(logOrderFilled.order.giveTokenAddress),
        toToken: EthereumAddress(logOrderFilled.order.takeTokenAddress),
        fromAmount: logOrderFilled.order.giveAmount.toString(),
        fillAmount: logOrderFilled.order.takeAmount.toString(),
        $srcChain:
          DEBRIDGE_NETWORKS.find(
            (c) => c.chainId === logOrderFilled.order.takeChainId.toString(),
          )?.chain ?? 'unknown',
      })
    }
  }

  /* Matching algorithm:
1. For Each LogOrderFilled on DST
2. Find LogOrderCreated on SRC with the same orderHash
*/
  match(orderFilled: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!LogFulfilledOrder.checkType(orderFilled)) return

    const orderCreated = db.find(LogCreatedOrder, {
      orderId: orderFilled.args.orderId,
    })
    if (!orderCreated) return

    return [
      Result.Transfer('debridge-dln.Swap', {
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
