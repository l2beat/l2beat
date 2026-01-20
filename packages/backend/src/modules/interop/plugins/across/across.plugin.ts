import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  createInteropEventType,
  type DataRequest,
  eventDataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  LogWithArgs,
  type MatchResult,
  Result,
} from '../types'
import { AcrossConfig } from './across.config'

const fundsDepositedLog =
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)'

export const AcrossFundsDeposited = createInteropEventType<{
  $dstChain: string
  originChainId: number
  destinationChainId: number
  depositId: bigint
  tokenAddress: Address32
  amount: bigint
}>('across.FundsDeposited', { direction: 'outgoing' })

const filledRelayLog =
  'event FilledRelay(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint256 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 exclusiveRelayer, bytes32 indexed relayer, bytes32 depositor, bytes32 recipient, bytes32 messageHash, (bytes32 updatedRecipient, bytes32 updatedMessageHash, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)'

const filledV3RelayLog =
  'event FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint32 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address indexed relayer, address depositor, address recipient, bytes message, (address updatedRecipient, bytes updatedMessage, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)'

// For both V3 and V4 event capturing
export const AcrossFilledRelay = createInteropEventType<{
  $srcChain: string
  originChainId: number
  destinationChainId: number
  depositId: bigint
  tokenAddress: Address32
  amount: bigint
}>('across.FilledRelay', { direction: 'incoming' })

export class AcrossPlugin implements InteropPluginResyncable {
  readonly name = 'across'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const acrossNetworks = this.configs.get(AcrossConfig) ?? []
    const spokePoolAddresses = acrossNetworks
      // skip solana - non-EVM
      .filter((network) => !['solana'].includes(network.chain))
      .map((network) =>
        ChainSpecificAddress.fromLong(network.chain, network.spokePool),
      )

    const la: LogWithArgs<typeof fundsDepositedLog>
    la.args.
    return [
      eventDataRequest({
        signature: fundsDepositedLog,
        addresses: spokePoolAddresses,
        captureFn: (fundsDeposited, context) => {
          const network = acrossNetworks.find((n) => n.chain === context.chain)
          if (!network) return
          return [
            AcrossFundsDeposited.create(context, {
              $dstChain: findChain(
                acrossNetworks,
                (x) => x.chainId,
                Number(fundsDeposited.destinationChainId),
              ),
              originChainId: network.chainId,
              destinationChainId: Number(fundsDeposited.destinationChainId),
              depositId: fundsDeposited.depositId,
              tokenAddress: Address32.from(fundsDeposited.inputToken),
              amount: fundsDeposited.inputAmount,
            }),
          ]
        },
      }),
      eventDataRequest({
        signature: filledRelayLog,
        addresses: spokePoolAddresses,
        captureFn: (filledRelay, context) => {
          const network = acrossNetworks.find((n) => n.chain === context.chain)
          if (!network) return
          return [
            AcrossFilledRelay.create(context, {
              $srcChain: findChain(
                acrossNetworks,
                (x) => x.chainId,
                Number(filledRelay.originChainId),
              ),
              originChainId: Number(filledRelay.originChainId),
              destinationChainId: network.chainId,
              depositId: filledRelay.depositId,
              tokenAddress: Address32.from(filledRelay.outputToken),
              amount: filledRelay.outputAmount,
            }),
          ]
        },
      }),
      eventDataRequest({
        signature: filledV3RelayLog,
        addresses: spokePoolAddresses,
        captureFn: (filledV3Relay, context) => {
          const network = acrossNetworks.find((n) => n.chain === context.chain)
          if (!network) return
          return [
            AcrossFilledRelay.create(context, {
              $srcChain: findChain(
                acrossNetworks,
                (x) => x.chainId,
                Number(filledV3Relay.originChainId),
              ),
              originChainId: Number(filledV3Relay.originChainId),
              destinationChainId: network.chainId,
              depositId: BigInt(filledV3Relay.depositId),
              tokenAddress: Address32.from(filledV3Relay.outputToken),
              amount: filledV3Relay.outputAmount,
            }),
          ]
        },
      }),
    ]
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
        srcAmount: fundsDeposited.args.amount,
        srcWasBurned: false,
        dstEvent: filledRelay,
        dstTokenAddress: filledRelay.args.tokenAddress,
        dstAmount: filledRelay.args.amount,
        dstWasMinted: false,
      }),
    ]
  }
}
