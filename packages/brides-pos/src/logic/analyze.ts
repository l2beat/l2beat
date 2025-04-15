import { type Abi, type Log, decodeEventLog, parseAbi } from 'viem'
import type { ChainInfo } from '../config/chains'
import type {
  Address,
  CrossChainMessage,
  GnosisBridgeReceive,
  GnosisBridgeSend,
} from './types'

export type LogWithTimestamp = Log & { timestamp: number }

export function analyzeLogs(
  logs: LogWithTimestamp[],
  chain: ChainInfo,
): CrossChainMessage[] {
  const txs: CrossChainMessage[] = []
  for (const log of logs) {
    if (!log.transactionHash) {
      continue
    }
    const message = decodeGnosisBridge(log, chain)
    if (!message) {
      continue
    }
    txs.push(message)
  }
  return txs
}

function address(chain: ChainInfo, unprefixed: `0x${string}`): Address {
  return `${chain.addressPrefix}:${unprefixed}`
}

const BRIDGE_ETHEREUM = '0x88ad09518695c6c3712AC10a214bE5109a655671'
const BRIDGE_GNOSIS = '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d'

const gnosisAbi = parseAbi([
  'event TokensBridged(address indexed token, address indexed recipient, uint256 value, bytes32 indexed messageId)',
  'event TokensBridgingInitiated(address indexed token, address indexed sender, uint256 value, bytes32 indexed messageId)',
])

function decodeGnosisBridge(
  log: LogWithTimestamp,
  chain: ChainInfo,
): GnosisBridgeSend | GnosisBridgeReceive | undefined {
  if (!log.transactionHash) {
    return
  }
  if (
    (chain.name !== 'ethereum' || log.address !== BRIDGE_ETHEREUM) &&
    (chain.name !== 'gnosis' || log.address !== BRIDGE_GNOSIS)
  ) {
    return
  }
  const event = safeDecodeLog(gnosisAbi, log)

  if (event?.eventName === 'TokensBridgingInitiated') {
    return {
      timestamp: log.timestamp,
      chain: chain.name,
      txHash: log.transactionHash,
      type: 'GnosisBridgeSend',
      messageId: event.args.messageId,
      sourceChain: chain.name,
      destinationChain: chain.name === 'ethereum' ? 'gnosis' : 'ethereum',
      sender: address(chain, event.args.sender),
      token: address(chain, event.args.token),
      amount: event.args.value,
    }
  }

  if (event?.eventName === 'TokensBridged') {
    return {
      timestamp: log.timestamp,
      chain: chain.name,
      txHash: log.transactionHash,
      type: 'GnosisBridgeReceive',
      messageId: event.args.messageId,
      sourceChain: chain.name === 'ethereum' ? 'gnosis' : 'ethereum',
      destinationChain: chain.name,
      recipient: address(chain, event.args.recipient),
      token: address(chain, event.args.token),
      amount: event.args.value,
    }
  }

  return undefined
}

function safeDecodeLog<A extends Abi>(abi: A, log: Log) {
  try {
    return decodeEventLog({ abi, ...log })
  } catch {
    return undefined
  }
}
