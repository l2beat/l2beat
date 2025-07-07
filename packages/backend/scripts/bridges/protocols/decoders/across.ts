import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type Hex,
  type Log,
  decodeEventLog,
  encodeEventTopics,
  parseAbi,
} from 'viem'
import type { BridgeTransfer } from '../../types/BridgeTransfer'

const ABI = parseAbi([
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
])

export function decodeAcross(
  chain: string,
  log: Log,
): BridgeTransfer | undefined {
  const bridge = CHAIN_IDS.find((c) => c.name === chain)?.bridge

  if (!bridge || EthereumAddress(log.address) !== bridge) return undefined

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'FundsDeposited' })[0]
  ) {
    const data = decodeEventLog({
      abi: parseAbi([
        'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
      ]),
      data: log.data,
      topics: log.topics,
    })

    const destination = CHAIN_IDS.find(
      (c) => c.id === +data.args.destinationChainId.toString(),
    )

    return {
      protocol: 'across',
      source: chain,
      destination: destination?.name ?? data.args.destinationChainId.toString(),
      token: extractAddressFromPaddedBytes32(data.args.inputToken),
      amount: data.args.inputAmount.toString(),
      sender: log.topics[3]
        ? extractAddressFromPaddedBytes32(log.topics[3])
        : undefined,
      receiver: extractAddressFromPaddedBytes32(data.args.recipient),
      txHash: log.transactionHash ?? undefined,
    }
  }

  return undefined
}

export function extractAddressFromPaddedBytes32(bytes32String: Hex): Hex {
  if (!bytes32String.startsWith('0x') || bytes32String.length !== 66) {
    throw new Error(
      `Invalid bytes32 string format. Expected '0x' prefix and 64 hex characters, but got: ${bytes32String}`,
    )
  }

  const addressPart = bytes32String.slice(-40)

  return `0x${addressPart}`
}

const CHAIN_IDS = [
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
