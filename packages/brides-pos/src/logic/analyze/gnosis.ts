import { parseAbi } from 'viem'
import type { ChainInfo } from '../../config/chains'
import type { GnosisBridgeReceive, GnosisBridgeSend } from '../types'
import { type LogWithTimestamp, address, safeDecodeLog } from './common'

const BRIDGE_ETHEREUM = '0x88ad09518695c6c3712ac10a214be5109a655671'
const BRIDGE_GNOSIS = '0xf6a78083ca3e2a662d6dd1703c939c8ace2e268d'

const gnosisAbi = parseAbi([
  'event TokensBridged(address indexed token, address indexed recipient, uint256 value, bytes32 indexed messageId)',
  'event TokensBridgingInitiated(address indexed token, address indexed sender, uint256 value, bytes32 indexed messageId)',
])

export function decodeGnosisBridge(
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
