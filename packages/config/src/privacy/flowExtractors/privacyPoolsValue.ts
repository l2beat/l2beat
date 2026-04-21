import { utils } from 'ethers'
import type { PrivacyFlowExtractor } from '../types'

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed _depositor, uint256 _commitment, uint256 _label, uint256 _value, uint256 _precommitmentHash)',
  'event Withdrawn(address indexed _processooor, uint256 _value, uint256 _spentNullifier, uint256 _newCommitment)',
])

export const privacyPoolsValue: PrivacyFlowExtractor<'privacyPoolsValue'> = ({
  log,
}) => {
  let parsedLog
  try {
    parsedLog = privacyPoolsInterface.parseLog(log)
  } catch (error) {
    throw new Error(
      `Failed to parse Privacy Pools log for ${log.address}: ${String(error)}`,
    )
  }

  const value = parsedLog.args._value
  return {
    count: 1,
    amount: BigInt(value.toString()),
  }
}
