import type { EVMLog } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { BridgeTransfer } from '../cli'

const ABI = new utils.Interface([
  'event FundsDeposited(bytes32 inputToken, bytes32 outputToken, uint256 inputAmount, uint256 outputAmount, uint256 indexed destinationChainId, uint256 indexed depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes32 indexed depositor, bytes32 recipient, bytes32 exclusiveRelayer, bytes message)',
])

export function decodeAcross(
  chain: string,
  log: EVMLog,
): BridgeTransfer | undefined {
  if (
    EthereumAddress(log.address) !==
    EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5')
  )
    return undefined

  if (log.topics[0] === ABI.getEventTopic('FundsDeposited')) {
    const data = ABI.decodeEventLog('FundsDeposited', log.data)

    console.log(data)

    return {
      protocol: 'across',
      source: chain,
      destination: log.topics[1],
      token: data[0],
      amount: JSON.parse(data[2]),
      sender: log.topics[3],
      receiver: data[10],
      txHash: log.transactionHash,
    }
  }

  return undefined
}
