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

const parseSentOrderCancel = createEventParser(
  'event SentOrderCancel((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, bytes cancelBeneficiary, bytes32 submissionId)',
)

const parseClaimedOrderCancel = createEventParser(
  'event ClaimedOrderCancel(bytes32 orderId, address beneficiary, uint256 paidAmount, address giveTokenAddress)',
)

export const CreatedOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: bigint
  fillAmount: bigint
  $dstChain: string
}>('debridge-dln.CreatedOrder', { direction: 'outgoing' })

const FulfilledOrder = createInteropEventType<{
  orderId: `0x${string}`
  fromToken: Address32
  toToken: Address32
  fromAmount: bigint
  fillAmount: bigint
  $srcChain: string
}>('debridge-dln.FulfilledOrder', { direction: 'incoming' })

export const SentOrderUnlock = createInteropEventType<{
  orderId: `0x${string}`
  beneficiary: Address32
  submissionId: `0x${string}`
}>('debridge-dln.SentOrderUnlock', { direction: 'outgoing' })

export const ClaimedUnlock = createInteropEventType<{
  orderId: `0x${string}`
  beneficiary: Address32
  giveAmount: bigint
  giveTokenAddress: Address32
}>('debridge-dln.ClaimedUnlock', { direction: 'incoming' })

export const SentOrderCancel = createInteropEventType<{
  orderId: `0x${string}`
  submissionId: `0x${string}`
}>('debridge-dln.SentOrderCancel', { direction: 'outgoing' })

export const ClaimedOrderCancel = createInteropEventType<{
  orderId: `0x${string}`
}>('debridge-dln.ClaimedOrderCancel', { direction: 'incoming' })

export class DeBridgeDlnPlugin implements InteropPlugin {
  readonly name = 'debridge-dln'

  capture(input: LogToCapture) {
    const createdOrder = parseCreatedOrder(input.log, null)
    if (createdOrder) {
      const fromToken =
        Address32.from(createdOrder.order.giveTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(createdOrder.order.giveTokenAddress)
      const toToken =
        Address32.from(createdOrder.order.takeTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(createdOrder.order.takeTokenAddress)
      return [
        CreatedOrder.create(input, {
          orderId: createdOrder.orderId,
          fromToken,
          toToken,
          fromAmount: createdOrder.order.giveAmount,
          fillAmount: createdOrder.order.takeAmount,
          $dstChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            createdOrder.order.takeChainId.toString(),
          ),
        }),
      ]
    }

    const fulfilledOrder = parseFulfilledOrder(input.log, null)
    if (fulfilledOrder) {
      const fromToken =
        Address32.from(fulfilledOrder.order.giveTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(fulfilledOrder.order.giveTokenAddress)
      const toToken =
        Address32.from(fulfilledOrder.order.takeTokenAddress) === Address32.ZERO
          ? Address32.NATIVE
          : Address32.from(fulfilledOrder.order.takeTokenAddress)
      return [
        FulfilledOrder.create(input, {
          orderId: fulfilledOrder.orderId,
          fromToken,
          toToken,
          fromAmount: fulfilledOrder.order.giveAmount,
          fillAmount: fulfilledOrder.order.takeAmount,
          $srcChain: findChain(
            DEBRIDGE_NETWORKS,
            (x) => x.chainId,
            fulfilledOrder.order.giveChainId.toString(),
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
          // TODO: token address and amount for settlement src side
          // (could be fetched from the FulfilledOrder event, but that is already consumed)
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

    const sentOrderCancel = parseSentOrderCancel(input.log, null)
    if (sentOrderCancel) {
      return [
        SentOrderCancel.create(input, {
          orderId: sentOrderCancel.orderId,
          submissionId: sentOrderCancel.submissionId,
        }),
      ]
    }

    const claimedOrderCancel = parseClaimedOrderCancel(input.log, null)
    if (claimedOrderCancel) {
      return [
        ClaimedOrderCancel.create(input, {
          orderId: claimedOrderCancel.orderId,
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
          srcWasBurned: false,
          dstEvent: fulfilledOrder_claimedUnlock,
          dstTokenAddress: fulfilledOrder_claimedUnlock.args.toToken,
          dstAmount: fulfilledOrder_claimedUnlock.args.fillAmount,
          dstWasMinted: false,
          bridgeType: 'nonMinting',
        }),
      ]
    }
  }
}
