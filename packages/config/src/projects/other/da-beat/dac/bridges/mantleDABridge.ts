import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { mantle } from '../../../../layer2s/mantle'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { toUsedInProject } from '../../utils/to-used-in-project'

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
  id: 'mantleDABridge',
  type: 'DAC',
  display: {
    name: 'Mantle DAC',
    slug: 'dac',
    description: 'MantleDA bridge on Ethereum.',
    links: {
      websites: ['https://mantle.xyz'],
      documentation: [
        'https://docs.mantle.xyz/network/introduction/concepts/data-availability',
      ],
      repositories: ['https://github.com/mantlenetworkio'],
      apps: [],
      explorers: ['https://explorer.mantle.xyz/mantle-da'],
      socialMedia: [
        'https://twitter.com/0xMantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('DataLayrServiceManager', {
        description:
          'This contract is the entry point for data availability commitments. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.',
      }),
      discovery.getContractDetails('RegistryPermission'),
      discovery.getContractDetails('PauserRegistry'),
    ],
    risks: [],
  },
  technology: ` The DA bridge contract is used for storing transaction data headers and confirming the data store by verifying operators signatures.
      The Mantle sequencer posts the data hash as a commitment to the DataLayrServiceManager contract on Ethereum thorugh an InitDataStore() transaction.
      Once the commitment is posted, the sequencer sends the data to the permissioned set of nodes, who sign the data and send back the signatures to the sequencer.
      The sequencer then posts the signatures to the DataLayrServiceManager contract on Ethereum through a confirmDataStore() transaction.
      The confirmDataStore() function verify the signatures and if the quorum is reached, the data is considered available.
    `,
  permissions: [
    ...discovery.getMultisigPermission(
      'Owner2Multisig',
      'The owner of the DA bridge. This entity is responsible for managing the bridge, it can pause the bridge and change various parameters such as the quorum threshold and service fee for node operators.',
    ),
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: threshold,
  totalMembers: committeeMembers,
  usedIn: toUsedInProject([mantle]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(), // no delay
  },
} satisfies DaBridge
