import { parseAbi } from 'viem'
import type { ChainInfo } from '../../config/chains'
import type { PolygonPosSend } from '../types'
import { type LogWithTimestamp, address, safeDecodeLog } from './common'

const polygonPosAbi = parseAbi([
  //"event ExitedERC20(address indexed exitor, address indexed rootToken, uint256 amount)",
  'event LockedERC20(address indexed depositor, address indexed depositReceiver, address indexed rootToken, uint256 amount)',
])

const POLYGONPOS_ETHEREUM_ESCROW_1 =
  '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf'
//const POLYGOONPOS_POLYGON = '0xf6a78083ca3e2a662d6dd1703c939c8ace2e268d'

export function decodePolygonPosBridge(
  log: LogWithTimestamp,
  chain: ChainInfo,
): PolygonPosSend | undefined {
  if (!log.transactionHash) {
    return
  }

  const isPolygonPos =
    chain.name === 'ethereum' && log.address === POLYGONPOS_ETHEREUM_ESCROW_1
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
      recipient: address(
        chain.name === 'ethereum' ? 'matic' : 'eth',
        event.args.depositReceiver,
      ),
      token: address(chain, event.args.rootToken),
      amount: event.args.amount,
    }
  }

  return undefined
}
