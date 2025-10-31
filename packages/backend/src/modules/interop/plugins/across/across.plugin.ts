import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
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
} from '../types'
import { AcrossConfig } from './across.config'

const parseFundsDeposited = createEventParser(
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
)
export const AcrossFundsDeposited = createInteropEventType<{
  $dstChain: string
  originChainId: number
  destinationChainId: number
  depositId: string
  tokenAddress: Address32
  amount: string
}>('across.FundsDeposited')

const parseFilledRelay = createEventParser(
  'event FilledRelay(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint256 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 exclusiveRelayer, bytes32 indexed relayer, bytes32 depositor, bytes32 recipient, bytes32 messageHash, (bytes32 updatedRecipient, bytes32 updatedMessageHash, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
)
const parseFilledV3Relay = createEventParser(
  'event FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint32 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address indexed relayer, address depositor, address recipient, bytes message, (address updatedRecipient, bytes updatedMessage, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
)
// For both V3 and V4 event capturing
export const AcrossFilledRelay = createInteropEventType<{
  $srcChain: string
  originChainId: number
  destinationChainId: number
  depositId: string
  tokenAddress: Address32
  amount: string
}>('across.FilledRelay')

export class AcrossPlugin implements InteropPlugin {
  name = 'across'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const networks = this.configs.get(AcrossConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    const fundsDeposited = parseFundsDeposited(input.log, [network.spokePool])
    if (fundsDeposited) {
      return [
        AcrossFundsDeposited.create(input.ctx, {
          $dstChain: findChain(
            networks,
            (x) => x.chainId,
            Number(fundsDeposited.destinationChainId),
          ),
          originChainId: network.chainId,
          destinationChainId: Number(fundsDeposited.destinationChainId),
          depositId: fundsDeposited.depositId.toString(),
          tokenAddress: Address32.from(fundsDeposited.inputToken),
          amount: fundsDeposited.inputAmount.toString(),
        }),
      ]
    }

    const filledRelay = parseFilledRelay(input.log, [network.spokePool])
    if (filledRelay) {
      return [
        AcrossFilledRelay.create(input.ctx, {
          $srcChain: findChain(
            networks,
            (x) => x.chainId,
            Number(filledRelay.originChainId),
          ),
          originChainId: Number(filledRelay.originChainId),
          destinationChainId: network.chainId,
          depositId: filledRelay.depositId.toString(),
          tokenAddress: Address32.from(filledRelay.outputToken),
          amount: filledRelay.outputAmount.toString(),
        }),
      ]
    }

    const filledV3Relay = parseFilledV3Relay(input.log, [network.spokePool])
    if (filledV3Relay) {
      return [
        AcrossFilledRelay.create(input.ctx, {
          $srcChain: findChain(
            networks,
            (x) => x.chainId,
            Number(filledV3Relay.originChainId),
          ),
          originChainId: Number(filledV3Relay.originChainId),
          destinationChainId: network.chainId,
          depositId: filledV3Relay.depositId.toString(),
          tokenAddress: Address32.from(filledV3Relay.outputToken),
          amount: filledV3Relay.outputAmount.toString(),
        }),
      ]
    }
  }

  matchTypes = [AcrossFilledRelay]
  match(
    filledRelay: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!AcrossFilledRelay.checkType(filledRelay)) return

    const fundsDeposited = db.find(AcrossFundsDeposited, {
      originChainId: filledRelay.args.originChainId,
      destinationChainId: filledRelay.args.destinationChainId,
      depositId: filledRelay.args.depositId,
    })
    if (!fundsDeposited) return

    return [
      // TODO: Should there be a message at all?
      Result.Message('across.Message', {
        app: 'across',
        srcEvent: fundsDeposited,
        dstEvent: filledRelay,
      }),
      // TODO: What about the final settlement?
      Result.Transfer('across.Transfer', {
        srcEvent: fundsDeposited,
        srcTokenAddress: fundsDeposited.args.tokenAddress,
        srcAmount: BigInt(fundsDeposited.args.amount),
        dstEvent: filledRelay,
        dstTokenAddress: filledRelay.args.tokenAddress,
        dstAmount: BigInt(filledRelay.args.amount),
      }),
    ]
  }
}
