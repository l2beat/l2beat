import { parseAbi } from 'viem'
import type { ChainInfo } from '../../config/chains'
import type { PolygonPosReceive, PolygonPosSend } from '../types'
import { type LogWithTimestamp, address, safeDecodeLog } from './common'

/*
On the polygon pos side state is received through a system tx from NULL to NULL.
Internally it (probably) has a loop calling 
  NULL
    -> StateReceiver.commitState(uint256, bytes)
       0x0000000000000000000000000000000000001001
    -> ChildChainManager.onStateReceive(uint256, bytes)
       0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa

The manager then sends the tokens after mapping the token addresses.

When sending tokens back to Ethereum we'd have to:
- look for burn event on Polygon and remember the block number & timestamp
- check address aliasing
- for VOLUME: look for ERC20 Bridge .ExitedERC20 event on Ethereum
- for DURATION: listen for NewHeaderBlock events and check when the polygon block
  was committed to Ethereum

 */

const STATE_SENDER_ETHEREUM = '0x28e4f3a7f651294b9564800b2d01f35189a5bfbe'
const STATE_RECEIVER_POLYGONPOS = '0x0000000000000000000000000000000000001001'

const CCM_POLYGONPOS = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'

const abi = parseAbi([
  'event StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)',
  'event StateCommitted(uint256 indexed stateId, bool success)',
])

export function decodePolygonPosBridge(
  log: LogWithTimestamp,
  chain: ChainInfo,
): PolygonPosSend | PolygonPosReceive | undefined {
  if (!log.transactionHash) {
    return
  }

  const isPolygonPos =
    (chain.name === 'ethereum' && log.address === STATE_SENDER_ETHEREUM) ||
    (chain.name === 'polygonpos' && log.address === STATE_RECEIVER_POLYGONPOS)
  if (!isPolygonPos) {
    return
  }

  const event = safeDecodeLog(abi, log)

  if (
    event?.eventName === 'StateSynced' &&
    event.args.contractAddress === CCM_POLYGONPOS
  ) {
    const send = decodeSend(event.args.data)
    if (!send) {
      console.log('Not send')
      return
    }

    return {
      timestamp: log.timestamp,
      chain: chain.name,
      txHash: log.transactionHash,
      type: 'PolygonPosSend',
      sourceChain: 'ethereum',
      destinationChain: 'polygon',
      stateId: event.args.id,
      recipient: address(chain, send.recipient),
      token: address(chain, send.rootToken),
      amount: send.amount,
    }
  }

  if (event?.eventName === 'StateCommitted' && event.args.success) {
    return {
      timestamp: log.timestamp,
      chain: chain.name,
      txHash: log.transactionHash,
      type: 'PolygonPosReceive',
      sourceChain: 'polygon',
      destinationChain: 'ethereum',
      stateId: event.args.stateId,
    }
  }

  return undefined
}

function decodeSend(data: `0x${string}`) {
  const no0x = data.slice(2)
  if (no0x.length !== 512) {
    return
  }
  // keccak("DEPOSIT")
  if (
    !no0x.startsWith(
      '87a7811f4bfedea3d341ad165680ae306b01aaeacc205d227629cf157dd9f821',
    )
  ) {
    return
  }

  const recipient: `0x${string}` = `0x${no0x.slice(3 * 64 + 24, 3 * 64 + 24 + 40)}`
  const rootToken: `0x${string}` = `0x${no0x.slice(4 * 64 + 24, 4 * 64 + 24 + 40)}`
  const amount = BigInt('0x' + no0x.slice(-64))

  return {
    recipient,
    rootToken,
    amount,
  }
}
