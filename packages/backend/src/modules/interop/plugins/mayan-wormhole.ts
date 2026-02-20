import type { EthereumAddress } from '@l2beat/shared-pure'
import type { Log } from 'viem'
import {
  forwardedERC20Log,
  forwardedEthLog,
  logToProtocolData,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from './mayan-forwarder'
import { MAYAN_CIRCLE, MAYAN_SWIFT } from './mayan-shared'
import type {
  InteropEvent,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from './types'

export const MAYAN_FORWARDER_TX_EVENT_SIGNATURES = [
  forwardedEthLog,
  forwardedERC20Log,
  swapAndForwardedEthLog,
  swapAndForwardedERC20Log,
]

// Only these methods are accompanied by Wormhole LogMessagePublished on source side.
export const MAYAN_CIRCLE_WORMHOLE_EMITTING_METHODS = new Set([
  '0x2072197f', // mayanCircle.bridgeWithFee
  '0x1c59b7fc', // mayanCircle.createOrder (legacy)
])

export function isMayanSwiftSender(sender: EthereumAddress): boolean {
  return sender === MAYAN_SWIFT
}

export function isMayanCircleSender(sender: EthereumAddress): boolean {
  return sender === MAYAN_CIRCLE
}

export function findMayanCircleDestinationChain(
  txLogs: Log[],
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
): string | undefined {
  for (const candidateLog of txLogs) {
    const decoded = logToProtocolData(candidateLog, wormholeNetworks)
    if (decoded) return decoded.dstChain
  }
}

export function findWrappedMayanWormholeLog<
  T extends { sender: EthereumAddress },
>(
  db: InteropEventDb,
  mayanForwarded: InteropEvent<{ methodSignature: `0x${string}` }>,
  logMessagePublishedType: InteropEventType<T>,
): InteropEvent<T> | undefined {
  if (
    !MAYAN_CIRCLE_WORMHOLE_EMITTING_METHODS.has(
      mayanForwarded.args.methodSignature,
    )
  ) {
    return undefined
  }

  const candidates = db
    .findAll(logMessagePublishedType, {
      sender: MAYAN_CIRCLE,
      ctx: { txHash: mayanForwarded.ctx.txHash },
    } as InteropEventQuery<T>)
    .filter((event) => event.ctx.chain === mayanForwarded.ctx.chain)

  if (candidates.length === 0) return undefined

  // If there are multiple candidates in the same tx, pick the nearest to the forwarder event.
  return candidates.sort((a, b) => {
    const aDistance = Math.abs(a.ctx.logIndex - mayanForwarded.ctx.logIndex)
    const bDistance = Math.abs(b.ctx.logIndex - mayanForwarded.ctx.logIndex)
    if (aDistance !== bDistance) return aDistance - bDistance
    return a.ctx.logIndex - b.ctx.logIndex
  })[0]
}
