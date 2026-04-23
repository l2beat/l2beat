import { Address32 } from '@l2beat/shared-pure'
import { findDeBridgeChain } from './debridge'
import {
  createEventParser,
  createInteropEventType,
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

const parseFulfilledOrder1 = createEventParser(
  'event FulfilledOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId, address sender, address unlockAuthority)',
)

const parseFulfilledOrder2 = createEventParser(
  'event FulfilledOrder((uint64 makerOrderNonce, bytes makerSrc, uint256 giveChainId, bytes giveTokenAddress, uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externalCall) order, bytes32 orderId,  uint256 actualFulfillAmount, address sender, address unlockAuthority)',
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

  constructor(private oneSidedChains: string[] = []) {}

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
          $dstChain: findDeBridgeChain(createdOrder.order.takeChainId),
        }),
      ]
    }

    const fulfilledOrder1 = parseFulfilledOrder1(input.log, null)
    const fulfilledOrder2 = parseFulfilledOrder2(input.log, null)
    if (fulfilledOrder1 || fulfilledOrder2) {
      // biome-ignore lint/style/noNonNullAssertion: logically one of them is non-null
      const fulfilledOrder = fulfilledOrder1 ?? fulfilledOrder2!
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
          $srcChain: findDeBridgeChain(fulfilledOrder.order.giveChainId),
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

  matchTypes = [CreatedOrder, FulfilledOrder, ClaimedUnlock]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (FulfilledOrder.checkType(event)) {
      const orderCreated = db.find(CreatedOrder, {
        orderId: event.args.orderId,
      })
      if (!orderCreated) {
        const srcChain = event.args.$srcChain
        if (!this.oneSidedChains.includes(srcChain)) return

        return [
          Result.Transfer('debridge-dln.Transfer', {
            srcChain,
            srcTokenAddress: event.args.fromToken,
            srcAmount: event.args.fromAmount,
            srcWasBurned: false,
            dstEvent: event,
            dstTokenAddress: event.args.toToken,
            dstAmount: event.args.fillAmount,
            dstWasMinted: false,
            bridgeType: 'nonMinting',
          }),
        ]
      }

      return [
        Result.Message('debridge-dln.Message', {
          app: 'debridge-dln',
          srcEvent: orderCreated,
          dstEvent: event,
        }),
        Result.Transfer('debridge-dln.Transfer', {
          srcEvent: orderCreated,
          srcTokenAddress: orderCreated.args.fromToken,
          srcAmount: orderCreated.args.fromAmount,
          srcWasBurned: false,
          dstEvent: event,
          dstTokenAddress: event.args.toToken,
          dstAmount: event.args.fillAmount,
          dstWasMinted: false,
          bridgeType: 'nonMinting',
        }),
      ]
    }

    if (!CreatedOrder.checkType(event)) return

    const fulfilledOrder = db.find(FulfilledOrder, {
      orderId: event.args.orderId,
    })
    if (fulfilledOrder) return

    const dstChain = event.args.$dstChain
    if (!this.oneSidedChains.includes(dstChain)) return

    return [
      Result.Transfer('debridge-dln.Transfer', {
        srcEvent: event,
        srcTokenAddress: event.args.fromToken,
        srcAmount: event.args.fromAmount,
        srcWasBurned: false,
        dstChain,
        dstTokenAddress: event.args.toToken,
        dstAmount: event.args.fillAmount,
        dstWasMinted: false,
        bridgeType: 'nonMinting',
      }),
    ]
  }
}
