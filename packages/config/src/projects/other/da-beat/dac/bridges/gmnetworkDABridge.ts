import { UnixTime } from '@l2beat/shared-pure'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { IntegratedDacBridge } from '../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'

export const gmnetworkDABridge = {
  createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
  type: 'IntegratedDacBridge',
  technology: {
    description: `Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
      However, there is a mechanism that allows users to challenge unavailability of data. \n`,
  },
  requiredMembers: 0,
  membersCount: 0,
  hideMembers: true,
  transactionDataType: DacTransactionDataType.TransactionData,
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies IntegratedDacBridge
