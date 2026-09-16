import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed depositor, uint256 commitment, uint256 label, uint256 value, uint256 precommitmentHash)',
  'event Withdrawn(address indexed processooor, uint256 value, uint256 spentNullifier, uint256 newCommitment)',
])

export interface PrivacyPoolsEvent {
  amount: bigint
  depositor?: EthereumAddress
}

export function extractPrivacyPoolsEvent(
  log: PrivacyRpcLog,
): PrivacyPoolsEvent {
  const parsedLog = privacyPoolsInterface.parseLog(log)

  return {
    amount: BigInt(parsedLog.args.value.toString()),
    ...(parsedLog.name === 'Deposited'
      ? { depositor: EthereumAddress(parsedLog.args.depositor) }
      : {}),
  }
}
