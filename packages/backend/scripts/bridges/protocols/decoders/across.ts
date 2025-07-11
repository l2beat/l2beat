import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { type Log, decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Receive } from '../../types/Receive'
import type { Send } from '../../types/Send'
import { extractAddressFromPadded } from '../../utils/viem'

export const ACROSS = {
  name: 'across',
  decoder: decoder,
}

function decoder(chain: Chain, log: Log): Send | Receive | undefined {
  const bridge = BRIDGES.find((b) => b.chainShortName === chain.shortName)

  if (!bridge || EthereumAddress(log.address) !== bridge.address)
    return undefined

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'FundsDeposited' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'FundsDeposited',
    })

    const destination = BRIDGES.find(
      (b) => b.chainId === +data.args.destinationChainId.toString(),
    )

    return {
      direction: 'send',
      protocol: ACROSS.name,
      token: ChainSpecificAddress(
        `${chain.shortName}:${extractAddressFromPadded(data.args.inputToken)}`,
      ),
      amount: data.args.inputAmount,
      destination: destination
        ? destination.chainShortName
        : data.args.destinationChainId.toString(),
      blockNumber: log.blockNumber ?? undefined,
      txHash: log.transactionHash ?? undefined,
      type: 'FundsDeposited',
      matchingId: data.args.depositId.toString(),
    }
  }

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'FilledRelay' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'FilledRelay',
    })

    const origin = BRIDGES.find(
      (c) => c.chainId === +data.args.originChainId.toString(),
    )

    return {
      direction: 'receive',
      protocol: ACROSS.name,
      token: ChainSpecificAddress(
        `${chain.shortName}:${extractAddressFromPadded(data.args.outputToken)}`,
      ),
      amount: data.args.inputAmount,
      origin: origin
        ? origin.chainShortName
        : data.args.originChainId.toString(),
      blockNumber: log.blockNumber ?? undefined,
      txHash: log.transactionHash ?? undefined,
      type: 'FilledRelay',
      matchingId: data.args.depositId.toString(),
    }
  }

  return undefined
}

const ABI = parseAbi([
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
  'event FilledRelay(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint256 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 exclusiveRelayer, bytes32 indexed relayer, bytes32 depositor, bytes32 recipient, bytes32 messageHash, (bytes32 updatedRecipient, bytes32 updatedMessageHash, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
])

const BRIDGES = [
  {
    chainId: 1,
    chainShortName: 'eth',
    address: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
  },
  {
    chainId: 42161,
    chainShortName: 'arb1',
    address: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
  },
  {
    chainId: 10,
    chainShortName: 'oeth',
    address: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
  },
  {
    chainId: 324,
    chainShortName: 'zksync',
    address: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
  },
  {
    chainId: 8453,
    chainShortName: 'base',
    address: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
  },

  {
    chainId: 57073,
    chainShortName: 'ink',
    address: EthereumAddress('0xeF684C38F94F48775959ECf2012D7E864ffb9dd4'),
  },
  {
    chainId: 59144,
    chainShortName: 'linea',
    address: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
  },
  {
    chainId: 534352,
    chainShortName: 'scr',
    address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
  },
]
