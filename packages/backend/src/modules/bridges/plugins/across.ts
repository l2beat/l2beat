import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'

const parseFundsDeposited = createEventParser(
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
)

const parseFilledRelay = createEventParser(
  'event FilledRelay(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint256 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 exclusiveRelayer, bytes32 indexed relayer, bytes32 depositor, bytes32 recipient, bytes32 messageHash, (bytes32 updatedRecipient, bytes32 updatedMessageHash, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
)

const parseFilledV3Relay = createEventParser(
  'event FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint32 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address indexed relayer, address depositor, address recipient, bytes message, (address updatedRecipient, bytes updatedMessage, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
)

export const AcrossFundsDeposited = createBridgeEventType<{
  originChainId: number
  destinationChainId: number
  depositId: number
  tokenAddress: EthereumAddress
  amount: string
}>('across.FundsDeposited')

// For both V3 and V4 event capturing
export const AcrossFilledRelay = createBridgeEventType<{
  originChainId: number
  depositId: number
  tokenAddress: EthereumAddress
  amount: string
}>('across.Filled')

const NETWORKS = [
  {
    chain: 'ethereum',
    address: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
  },
  {
    chain: 'arbitrum',
    address: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
  },
  {
    chain: 'optimism',
    address: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
  },
  {
    chain: 'zksyncera',
    address: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
  },
  {
    chain: 'base',
    address: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
  },
  {
    chain: 'ink',
    address: EthereumAddress('0xeF684C38F94F48775959ECf2012D7E864ffb9dd4'),
  },
  {
    chain: 'linea',
    address: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
  },
  {
    chain: 'scroll',
    address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
  },
]

const CHAIN_ID_BY_SLUG: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  ink: 57073,
  linea: 59144,
  scroll: 534352,
  zksyncera: 324,
}

export class AcrossPlugin implements BridgePlugin {
  name = 'across'
  chains = NETWORKS.map((n) => n.chain)

  capture(input: LogToCapture) {
    const network = NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    const fd = parseFundsDeposited(input.log, [network.address])
    if (fd) {
      const originChainId = CHAIN_ID_BY_SLUG[input.ctx.chain]
      return AcrossFundsDeposited.create(input.ctx, {
        originChainId,
        destinationChainId: Number(fd.destinationChainId),
        depositId: Number(fd.depositId),
        tokenAddress: EthereumAddress(
          new BinaryReader(fd.outputToken).readAddress(),
        ),
        amount: fd.outputAmount.toString(),
      })
    }

    const fr = parseFilledRelay(input.log, [network.address])
    if (fr) {
      return AcrossFilledRelay.create(input.ctx, {
        originChainId: Number(fr.originChainId),
        depositId: Number(fr.depositId),
        tokenAddress: EthereumAddress(
          new BinaryReader(fr.outputToken).readAddress(),
        ),
        amount: fr.outputAmount.toString(),
      })
    }

    const fr3 = parseFilledV3Relay(input.log, [network.address])
    if (fr3) {
      return AcrossFilledRelay.create(input.ctx, {
        originChainId: Number(fr3.originChainId),
        depositId: Number(fr3.depositId),
        tokenAddress: EthereumAddress(fr3.outputToken),
        amount: fr3.outputAmount.toString(),
      })
    }
  }

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!AcrossFilledRelay.checkType(event)) return

    const { originChainId, depositId, tokenAddress, amount } = event.args
    const fd = db.find(AcrossFundsDeposited, {
      originChainId,
      depositId,
    })
    if (!fd) return

    return {
      messages: [
        {
          type: 'across.Message',
          outbound: fd,
          inbound: event,
        },
      ],
      transfers: [
        {
          type: 'across.App',
          events: [fd, event], // FIX: is it okay to consume twice? (the message consumes the same events)
          outbound: {
            tx: fd.ctx,
            tokenAddress: fd.args.tokenAddress,
            amount: fd.args.amount,
          },
          inbound: {
            tx: event.ctx,
            tokenAddress,
            amount,
          },
        },
      ],
    }
  }
}
