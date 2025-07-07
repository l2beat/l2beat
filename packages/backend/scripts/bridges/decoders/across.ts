import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type Hex,
  type Log,
  decodeEventLog,
  encodeEventTopics,
  parseAbi,
} from 'viem'
import type { BridgeTransfer } from '../types/BridgeTransfer'

const ABI = parseAbi([
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
])

const CHAIN_IDS = [
  { id: 1, name: 'ethereum' },
  { id: 10, name: 'optimism' },
  { id: 137, name: 'polygon' },
  { id: 8453, name: 'base' },
  { id: 42161, name: 'arbitrum' },
  { id: 57073, name: 'ink' },
  { id: 59144, name: 'linea' },
  { id: 81457, name: 'blast' },
  { id: 534352, name: 'scroll' },
  { id: 7777777, name: 'zora' },
]

export function decodeAcross(
  chain: string,
  log: Log,
): BridgeTransfer | undefined {
  if (
    EthereumAddress(log.address) !==
    EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5')
  )
    return undefined

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
