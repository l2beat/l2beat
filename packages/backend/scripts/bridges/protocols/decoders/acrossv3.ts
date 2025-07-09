import { EthereumAddress } from '@l2beat/shared-pure'
import { type Log, decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { BridgeTransfer } from '../../types/BridgeTransfer'
import { extractAddressFromPadded } from '../../utils/viem'

export const ACROSS_V3 = {
  name: 'across_v3',
  decoder: decoder,
}

function decoder(chainName: string, log: Log): BridgeTransfer | undefined {
  const chain = CHAINS.find((c) => c.name === chainName)

  if (!chain || EthereumAddress(log.address) !== chain.bridge) return undefined

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'V3FundsDeposited' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'V3FundsDeposited',
    })

    const destination = CHAINS.find(
      (c) => c.id === +data.args.destinationChainId.toString(),
    )?.name

    return {
      protocol: ACROSS_V3.name,
      chain: chainName,
      origin: chain.name,
      destination: destination ?? data.args.destinationChainId.toString(),
      token: extractAddressFromPadded(data.args.inputToken),
      amount: data.args.inputAmount.toString(),
      sender: log.topics[3]
        ? extractAddressFromPadded(log.topics[3])
        : undefined,
      receiver: extractAddressFromPadded(data.args.recipient),
      txHash: log.transactionHash ?? undefined,
      type: 'V3FundsDeposited',
      matchingId: data.args.depositId.toString(),
    }
  }

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'FilledV3Relay' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'FilledV3Relay',
    })

    const origin = CHAINS.find(
      (c) => c.id === +data.args.originChainId.toString(),
    )?.name

    return {
      protocol: ACROSS_V3.name,
      chain: chainName,
      origin: origin ?? data.args.originChainId.toString(),
      destination: chain.name,
      token: extractAddressFromPadded(data.args.outputToken),
      amount: data.args.inputAmount.toString(),
      sender: extractAddressFromPadded(data.args.depositor),
      receiver: extractAddressFromPadded(data.args.recipient),
      txHash: log.transactionHash ?? undefined,
      type: 'FilledV3Relay',
      matchingId: data.args.depositId.toString(),
    }
  }
  return undefined
}

const ABI = parseAbi([
  'event FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint32 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address indexed relayer, address depositor, address recipient, bytes message, (address updatedRecipient, bytes updatedMessage, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
  'event V3FundsDeposited(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint32 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, address indexed depositor, address recipient, address exclusiveRelayer, bytes message)',
])

const CHAINS = [
  {
    id: 1,
    name: 'ethereum',
    bridge: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
  },
  {
    id: 10,
    name: 'optimism',
    bridge: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
  },
  {
    id: 324,
    name: 'zksync2',
    bridge: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
  },
  {
    id: 8453,
    name: 'base',
    bridge: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
  },
  {
    id: 42161,
    name: 'arbitrum',
    bridge: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
  },
  {
    id: 57073,
    name: 'ink',
    bridge: EthereumAddress('0xeF684C38F94F48775959ECf2012D7E864ffb9dd4'),
  },
  {
    id: 59144,
    name: 'linea',
    bridge: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
  },
  {
    id: 81457,
    name: 'blast',
    bridge: EthereumAddress('0x2D509190Ed0172ba588407D4c2df918F955Cc6E1'),
  },
  {
    id: 534352,
    name: 'scroll',
    bridge: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
  },
  {
    id: 7777777,
    name: 'zora',
    bridge: EthereumAddress('0x13fDac9F9b4777705db45291bbFF3c972c6d1d97'),
  },
]
