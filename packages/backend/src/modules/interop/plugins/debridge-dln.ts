import { Address32 } from '@l2beat/shared-pure'
import { DEBRIDGE_NETWORKS } from './debridge'
import {
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

const parseCreatedOrder = createEventParser(
  'event CreatedOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, bytes affiliateFee, uint256 nativeFixFee, uint256 percentFee, uint32 referralCode, bytes metadata)',
)

const parseFulfilledOrder = createEventParser(
  'event FulfilledOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, address sender, address unlockAuthority)',
)

const parseSentOrderUnlock = createEventParser(
  'event SentOrderUnlock(bytes32 orderId, bytes beneficiary, bytes32 submissionId)',
)

const parseClaimedUnlock = createEventParser(
  'event ClaimedUnlock(bytes32 orderId, address beneficiary, uint256 giveAmount, address giveTokenAddress)',
)

const CreatedOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: bigint
  fillAmount: bigint
  $dstChain: string
}>('debridge-dln.CreatedOrder')

const FulfilledOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: bigint
  fillAmount: bigint
  $srcChain: string
}>('debridge-dln.FulfilledOrder')

export const SentOrderUnlock = createInteropEventType<{
  orderId: `0x${string}`
  beneficiary: Address32
  submissionId: `0x${string}`
}>('debridge-dln.SentOrderUnlock')

export const ClaimedUnlock = createInteropEventType<{
  orderId: `0x${string}`
  beneficiary: Address32
  giveAmount: bigint
  giveTokenAddress: Address32
}>('debridge-dln.ClaimedUnlock')

export class DeBridgeDlnPlugin implements InteropPlugin {
  readonly name = 'debridge-dln'

  capture(input: LogToCapture) {
    const logOrderCreated = parseCreatedOrder(input.log, null)
    if (logOrderCreated) {
      const fromToken =
        Address32.from(logOrderCreated.order.giveTokenAddress) ===
        Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(logOrderCreated.order.giveTokenAddress)
      const toToken =
        Address32.from(logOrderCreated.order.takeTokenAddress) ===
        Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(logOrderCreated.order.takeTokenAddress)
      return [
        CreatedOrder.create(input, {
          orderId: logOrderCreated.orderId,
          fromToken,
          toToken,
          fromAmount: logOrderCreated.order.giveAmount,
          fillAmount: logOrderCreated.order.takeAmount,
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
      const fromToken =
        Address32.from(logOrderFilled.order.giveTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(logOrderFilled.order.giveTokenAddress)
      const toToken =
        Address32.from(logOrderFilled.order.takeTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(logOrderFilled.order.takeTokenAddress)
      return [
        FulfilledOrder.create(input, {
          orderId: logOrderFilled.orderId,
          fromToken,
          toToken,
          fromAmount: logOrderFilled.order.giveAmount,
          fillAmount: logOrderFilled.order.takeAmount,
          $srcChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            logOrderFilled.order.giveChainId.toString(),
          ),
        }),
      ]
    }

    const sentOrderUnlock = parseSentOrderUnlock(input.log, null)
    if (sentOrderUnlock) {
      return [
        SentOrderUnlock.create(input, {
          orderId: sentOrderUnlock.orderId,
          beneficiary: Address32.from(sentOrderUnlock.beneficiary),
          submissionId: sentOrderUnlock.submissionId,
          // TODO: token address and amount
        }),
      ]
    }

    const claimedUnlock = parseClaimedUnlock(input.log, null)
    if (claimedUnlock) {
      const giveTokenAddress =
        Address32.from(claimedUnlock.giveTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(claimedUnlock.giveTokenAddress)

      return [
        ClaimedUnlock.create(input, {
          orderId: claimedUnlock.orderId,
          beneficiary: Address32.from(claimedUnlock.beneficiary),
          giveAmount: claimedUnlock.giveAmount,
          giveTokenAddress,
        }),
      ]
    }
  }

  matchTypes = [FulfilledOrder, ClaimedUnlock]
  match(
    fulfilledOrder_claimedUnlock: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (FulfilledOrder.checkType(fulfilledOrder_claimedUnlock)) {
      const orderCreated = db.find(CreatedOrder, {
        orderId: fulfilledOrder_claimedUnlock.args.orderId,
      })
      if (!orderCreated) return

      return [
        Result.Message('debridge-dln.Message', {
          app: 'debridge-dln',
          srcEvent: orderCreated,
          dstEvent: fulfilledOrder_claimedUnlock,
        }),
        Result.Transfer('debridge-dln.Transfer', {
          srcEvent: orderCreated,
          srcTokenAddress: orderCreated.args.fromToken,
          srcAmount: orderCreated.args.fromAmount,
          dstEvent: fulfilledOrder_claimedUnlock,
          dstTokenAddress: fulfilledOrder_claimedUnlock.args.toToken,
          dstAmount: fulfilledOrder_claimedUnlock.args.fillAmount,
        }),
      ]
    }
    if (ClaimedUnlock.checkType(fulfilledOrder_claimedUnlock)) {
      const sentOrderUnlock = db.find(SentOrderUnlock, {
        orderId: fulfilledOrder_claimedUnlock.args.orderId,
      })
      if (!sentOrderUnlock) return
      return [
        Result.Message('debridge.Message', {
          app: 'debridge-dln-settlement',
          srcEvent: sentOrderUnlock,
          dstEvent: fulfilledOrder_claimedUnlock,
        }),
        Result.Transfer('debridge-dln.Transfer', {
          srcEvent: sentOrderUnlock,
          srcTokenAddress: fulfilledOrder_claimedUnlock.args.giveTokenAddress,
          srcAmount: fulfilledOrder_claimedUnlock.args.giveAmount,
          dstEvent: fulfilledOrder_claimedUnlock,
          dstTokenAddress: fulfilledOrder_claimedUnlock.args.giveTokenAddress,
          dstAmount: fulfilledOrder_claimedUnlock.args.giveAmount,
        }),
      ]
    }
  }
}
