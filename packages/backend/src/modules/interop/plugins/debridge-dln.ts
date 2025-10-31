import { DEBRIDGE_NETWORKS } from './debridge'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
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

export const LogCreatedOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: string
  fillAmount: string
  $dstChain: string
}>('debridge-dln.CreatedOrder')

export const LogFulfilledOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: string
  fillAmount: string
  $srcChain: string
}>('debridge-dln.FulfilledOrder')

export class DeBridgeDlnPlugin implements InteropPlugin {
  name = 'debridge-dln'

  capture(input: LogToCapture) {
    const logOrderCreated = parseCreatedOrder(input.log, null)
    if (logOrderCreated) {
      return [
        LogCreatedOrder.create(input.ctx, {
          orderId: logOrderCreated.orderId,
          fromToken: Address32.from(logOrderCreated.order.giveTokenAddress),
          toToken: Address32.from(logOrderCreated.order.takeTokenAddress),
          fromAmount: logOrderCreated.order.giveAmount.toString(),
          fillAmount: logOrderCreated.order.takeAmount.toString(),
          $dstChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            logOrderCreated.order.takeChainId.toString(),
          ),
        }),
      ]
    }

    const logOrderFilled = parseFulfilledOrder(input.log, null)
    if (logOrderFilled) {
      return [
        LogFulfilledOrder.create(input.ctx, {
          orderId: logOrderFilled.orderId,
          fromToken: Address32.from(logOrderFilled.order.giveTokenAddress),
          toToken: Address32.from(logOrderFilled.order.takeTokenAddress),
          fromAmount: logOrderFilled.order.giveAmount.toString(),
          fillAmount: logOrderFilled.order.takeAmount.toString(),
          $srcChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            logOrderFilled.order.giveChainId.toString(),
          ),
        }),
      ]
    }
  }

  /* Matching algorithm:
    1. For Each LogOrderFilled on DST
    2. Find LogOrderCreated on SRC with the same orderHash
  */
  matchTypes = [LogFulfilledOrder]
  match(
    orderFilled: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!LogFulfilledOrder.checkType(orderFilled)) return

    const orderCreated = db.find(LogCreatedOrder, {
      orderId: orderFilled.args.orderId,
    })
    if (!orderCreated) return

    return [
      Result.Message('debridge-dln.Message', {
        app: 'debridge-dln',
        srcEvent: orderCreated,
        dstEvent: orderFilled,
      }),
      Result.Transfer('debridge-dln.Transfer', {
        srcEvent: orderCreated,
        srcTokenAddress: orderCreated.args.fromToken,
        srcAmount: BigInt(orderCreated.args.fromAmount),
        dstEvent: orderFilled,
        dstTokenAddress: orderFilled.args.toToken,
        dstAmount: BigInt(orderFilled.args.fillAmount),
      }),
    ]
  }
}
