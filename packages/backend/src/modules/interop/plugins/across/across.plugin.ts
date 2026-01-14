import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  createInteropEventType,
  type DataRequest,
  eventDataRequest,
  eventWithTxLogsDataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  type ParsedEventFromSignature,
  Result,
  type TxEventsContainer,
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

    return [
      eventWithTxLogsDataRequest({
        signature: fundsDepositedLog,
        addresses: spokePoolAddresses,
        includeTxEvents: [filledV3RelayLog],
        captureFn: this.captureFundsDepositedWithTx,
      }),
      eventDataRequest({
        signature: filledRelayLog,
        addresses: spokePoolAddresses,
        captureFn: this.captureFilledRelay,
      }),
      eventDataRequest({
        signature: filledV3RelayLog,
        addresses: spokePoolAddresses,
        captureFn: this.captureFilledV3Relay,
      }),
    ]
  }

  private captureFundsDepositedWithTx = (
    log: ParsedEventFromSignature<typeof fundsDepositedLog>,
    _txEvents: TxEventsContainer<[typeof filledV3RelayLog]>,
    input: LogToCapture,
  ) => {
    const networks = this.configs.get(AcrossConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) return

    return [
      AcrossFundsDeposited.create(input, {
        $dstChain: findChain(
          networks,
          (x) => x.chainId,
          Number(log.destinationChainId),
        ),
        originChainId: network.chainId,
        destinationChainId: Number(log.destinationChainId),
        depositId: log.depositId,
        tokenAddress: Address32.from(log.inputToken),
        amount: log.inputAmount,
      }),
    ]
  }

  private captureFilledRelay = (
    log: ParsedEventFromSignature<typeof filledRelayLog>,
    input: LogToCapture,
  ) => {
    const networks = this.configs.get(AcrossConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) return

    return [
      AcrossFilledRelay.create(input, {
        $srcChain: findChain(
          networks,
          (x) => x.chainId,
          Number(log.originChainId),
        ),
        originChainId: Number(log.originChainId),
        destinationChainId: network.chainId,
        depositId: log.depositId,
        tokenAddress: Address32.from(log.outputToken),
        amount: log.outputAmount,
      }),
    ]
  }

  private captureFilledV3Relay = (
    log: ParsedEventFromSignature<typeof filledV3RelayLog>,
    input: LogToCapture,
  ) => {
    const networks = this.configs.get(AcrossConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) return

    return [
      AcrossFilledRelay.create(input, {
        $srcChain: findChain(
          networks,
          (x) => x.chainId,
          Number(log.originChainId),
        ),
        originChainId: Number(log.originChainId),
        destinationChainId: network.chainId,
        depositId: BigInt(log.depositId),
        tokenAddress: Address32.from(log.outputToken),
        amount: log.outputAmount,
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
