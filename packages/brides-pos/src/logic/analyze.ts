import { type Abi, type Log, decodeEventLog, parseAbi } from 'viem'
import type { ChainInfo } from '../config/chains'
import type {
  Address,
  CrossChainMessage,
  GnosisBridgeReceive,
  GnosisBridgeSend,
  PolygonPosSend
} from './types'

export type LogWithTimestamp = Log & { timestamp: number }

export function analyzeLogs(
  logs: LogWithTimestamp[],
  chain: ChainInfo,
): CrossChainMessage[] {
  const txs: CrossChainMessage[] = []
  for (const log of logs) {
    if (!log.transactionHash || log.removed) {
      continue
    }
    const message = decodeGnosisBridge(log, chain) ?? decodePolygonPosBridge(log, chain)
    if (!message) {
      continue
    }
    txs.push(message)
  }
  return txs
}

function address(chain: ChainInfo | string, unprefixed: `0x${string}`): Address {
  if (typeof chain === "string") {
    return `${chain}:${unprefixed}`
  }
  return `${chain.addressPrefix}:${unprefixed}`
}

const BRIDGE_ETHEREUM = '0x88ad09518695c6c3712ac10a214be5109a655671'
const BRIDGE_GNOSIS = '0xf6a78083ca3e2a662d6dd1703c939c8ace2e268d'

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

  const isGnosis =
    (chain.name === 'ethereum' && log.address === BRIDGE_ETHEREUM) ||
    (chain.name === 'gnosis' && log.address === BRIDGE_GNOSIS)
  if (!isGnosis) {
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



const polygonPosAbi = parseAbi([
  //"event ExitedERC20(address indexed exitor, address indexed rootToken, uint256 amount)",
  "event LockedERC20(address indexed depositor, address indexed depositReceiver, address indexed rootToken, uint256 amount)",
])

const POLYGONPOS_ETHEREUM_ESCROW_1 = '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf'
//const POLYGOONPOS_POLYGON = '0xf6a78083ca3e2a662d6dd1703c939c8ace2e268d'

function decodePolygonPosBridge(
  log: LogWithTimestamp,
  chain: ChainInfo,
): PolygonPosSend | undefined {

  if (!log.transactionHash) {
    return
  }


  const isPolygonPos =
    (chain.name === 'ethereum' && log.address === POLYGONPOS_ETHEREUM_ESCROW_1)
  if (!isPolygonPos) {
    return
  }

  const event = safeDecodeLog(polygonPosAbi, log)

  if (event?.eventName === 'LockedERC20') {
    return {
      timestamp: log.timestamp,
      chain: chain.name,
      txHash: log.transactionHash,
      type: 'PolygonPosSend',
      escrow: address(chain, log.address),
      sourceChain: chain.name,
      destinationChain: chain.name === 'ethereum' ? 'polygon' : 'ethereum',
      sender: address(chain, event.args.depositor),
      recipient: address(chain.name === 'ethereum' ? 'matic' : 'eth', event.args.depositReceiver),
      token: address(chain, event.args.rootToken),
      amount: event.args.amount,
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
