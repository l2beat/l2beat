import { EthereumAddress } from '@l2beat/shared-pure'
import {
  Address32,
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseFundsDeposited = createEventParser(
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
)
export const AcrossFundsDeposited = createBridgeEventType<{
  $dstChain: string
  originChainId: number
  destinationChainId: number
  depositId: number
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
export const AcrossFilledRelay = createBridgeEventType<{
  $srcChain: string
  originChainId: number
  depositId: number
  tokenAddress: Address32
  amount: string
}>('across.FilledRelay')

const ACROSS_NETWORKS = defineNetworks('across', [
  {
    chain: 'ethereum',
    chainId: 1,
    address: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
  },
  {
    chain: 'arbitrum',
    chainId: 42161,
    address: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
  },
  {
    chain: 'optimism',
    chainId: 10,
    address: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
  },
  {
    chain: 'zksync2',
    chainId: 324,
    address: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
  },
  {
    chain: 'base',
    chainId: 8453,
    address: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
  },
  {
    chain: 'ink',
    chainId: 57073,
    address: EthereumAddress('0xeF684C38F94F48775959ECf2012D7E864ffb9dd4'),
  },
  {
    chain: 'linea',
    chainId: 59144,
    address: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
  },
  {
    chain: 'scroll',
    chainId: 534352,
    address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
  },
])

export class AcrossPlugin implements BridgePlugin {
  name = 'across'

  capture(input: LogToCapture) {
    const network = ACROSS_NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    const fundsDeposited = parseFundsDeposited(input.log, [network.address])
    if (fundsDeposited) {
      return AcrossFundsDeposited.create(input.ctx, {
        $dstChain: findChain(
          ACROSS_NETWORKS,
          (x) => x.chainId,
          Number(fundsDeposited.destinationChainId),
        ),
        originChainId: network.chainId,
        destinationChainId: Number(fundsDeposited.destinationChainId),
        depositId: Number(fundsDeposited.depositId),
        tokenAddress: Address32.from(fundsDeposited.inputToken),
        amount: fundsDeposited.inputAmount.toString(),
      })
    }

    const filledRelay = parseFilledRelay(input.log, [network.address])
    if (filledRelay) {
      return AcrossFilledRelay.create(input.ctx, {
        $srcChain: findChain(
          ACROSS_NETWORKS,
          (x) => x.chainId,
          Number(filledRelay.originChainId),
        ),
        originChainId: Number(filledRelay.originChainId),
        depositId: Number(filledRelay.depositId),
        tokenAddress: Address32.from(filledRelay.outputToken),
        amount: filledRelay.outputAmount.toString(),
      })
    }

    const filledV3Relay = parseFilledV3Relay(input.log, [network.address])
    if (filledV3Relay) {
      return AcrossFilledRelay.create(input.ctx, {
        $srcChain: findChain(
          ACROSS_NETWORKS,
          (x) => x.chainId,
          Number(filledV3Relay.originChainId),
        ),
        originChainId: Number(filledV3Relay.originChainId),
        depositId: Number(filledV3Relay.depositId),
        tokenAddress: Address32.from(filledV3Relay.outputToken),
        amount: filledV3Relay.outputAmount.toString(),
      })
    }
  }

  matchTypes = [AcrossFilledRelay]
  match(filledRelay: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!AcrossFilledRelay.checkType(filledRelay)) return

    const fundsDeposited = db.find(AcrossFundsDeposited, {
      originChainId: filledRelay.args.originChainId,
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
        dstEvent: filledRelay,
        dstTokenAddress: filledRelay.args.tokenAddress,
        dstAmount: filledRelay.args.amount,
      }),
    ]
  }
}
