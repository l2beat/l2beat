import { UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers/lib/ethers'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
} from '../types'
import { DacDaLayer } from '../types/DaLayer'
import { DaRelayerFailureRisk } from '../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

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

const totalStakeArray = discovery.getContractValue<number[]>(
  'BLSRegistry',
  'totalStake',
)

const totalStake = BigNumber.from(totalStakeArray[0])
const requiredStake = totalStake.div(committeeMembers)

const requiredStakeFormatted = parseFloat(
  utils.formatEther(requiredStake),
).toLocaleString()

export const mantleDA: DacDaLayer = {
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'Mantle DA',
    slug: 'mantle-da',
    description:
      'Mantle DA is an independent DA module that is built on top of an early version of EigenDA smart contracts.',
  },
  systemCategory: 'custom',
  technology: {
    description: `
    ## Architecture

    ![MantleDA architecture](/images/da-layer-technology/mantleda/architecture.png#center)

    Mantle DA is an independent DA module that is built on top of an early version of EigenDA smart contracts.
    The system is made up of two main component: onchain smart contracts for storing and verifying data commitments, and an offchain network of permissioned nodes storing the data.
    The permissioned set of nodes is tasked with providing data availability to the Mantle network. 
    They receive Mantle network transaction data, sign it using a BLS signature scheme, and send back signatures to the sequencer to post commitments to the DataLayrServiceManager (DA Bridge) contract on Ethereum.
    The DA DataLayrServiceManager acts as a verifier smart contract,  verifying that the signatures provided by the sequencer are indeed from node operators who have agreed to be in the quorum.
    To become members of the DA network, node operators are required to stake ${requiredStakeFormatted} MNT tokens, and can only be registered by an authorized entity. There is no slashing mechanism in place for misbehaving nodes.
    `,
  },
  bridge: {
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
  },
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('MNT'),
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
