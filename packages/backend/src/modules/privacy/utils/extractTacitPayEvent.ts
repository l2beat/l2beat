import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'

// One event serves every Tacit Pay action. A positive extAmount is a deposit,
// a negative one pays -extAmount to the recipient, and zero is a private
// transfer. The relayer's fee is paid out of the pool on top of either.
const tacitPayInterface = new utils.Interface([
  'event Transact(bytes32 indexed nf0, bytes32 indexed nf1, bytes32 outLeaf0, bytes32 outLeaf1, uint256 firstIndex, bytes32 newRoot, address recipient, int256 extAmount, address relayer, uint256 fee, bytes memo0, bytes memo1)',
])

export const TACIT_PAY_TRANSACT_TOPIC =
  tacitPayInterface.getEventTopic('Transact')

export interface TacitPayTransact {
  recipient: EthereumAddress
  extAmount: bigint
  relayer: EthereumAddress
  fee: bigint
}

export function extractTacitPayTransact(log: PrivacyRpcLog): TacitPayTransact {
  const { args } = tacitPayInterface.parseLog(log)
  return {
    recipient: EthereumAddress(args.recipient),
    extAmount: BigInt(args.extAmount.toString()),
    relayer: EthereumAddress(args.relayer),
    fee: BigInt(args.fee.toString()),
  }
}
