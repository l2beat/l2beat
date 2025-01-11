import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { IntegratedDacBridge } from '../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('mantle')

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const threshold =
  discovery.getContractValue<number>(
    'DataLayrServiceManager',
    'quorumThresholdBasisPoints',
  ) / 1000 // Quorum threshold is in basis points, but stake is equal for all members (100k MNT)

export const mantleDABridge = {
  createdAt: new UnixTime(1723022143), // 2024-08-07T09:15:43Z
  type: 'IntegratedDacBridge',
  technology: {
    description: ` 
    ![MantleDA bridge](/images/da-bridge-technology/mantleda/architecture.png#center)

    The DA bridge contract is used for storing transaction data headers and confirming the data store by verifying operators signatures.
      The Mantle sequencer posts the data hash as a commitment to the DataLayrServiceManager contract on Ethereum through an InitDataStore() transaction.
      Once the commitment is posted, the sequencer sends the data to the permissioned set of nodes, who sign the data and send back the signatures to the sequencer.
      The sequencer then posts the signatures to the DataLayrServiceManager contract on Ethereum through a confirmDataStore() transaction.
      The confirmDataStore() function verify the signatures and if the quorum is reached, the data is considered available.
    `,
  },
  transactionDataType: DacTransactionDataType.TransactionData,
  requiredMembers: threshold,
  membersCount: committeeMembers,
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.NoDiversityCommitteeSecurity(
      `${threshold}/${committeeMembers}`,
    ),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies IntegratedDacBridge
