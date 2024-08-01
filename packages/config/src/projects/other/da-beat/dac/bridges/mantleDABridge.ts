import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { mantle } from '../../../../layer2s/mantle'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('mantle')

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const operatorsList = discovery.getContractValue<string[]>(
  'BLSRegistry',
  'operatorList',
)

const threshold =
  discovery.getContractValue<number>(
    'DataLayrServiceManager',
    'quorumThresholdBasisPoints',
  ) / 1000 // Quorum threshold is in basis points, but stake is equal for all members (100k MNT)

const dataStorePermissionList = discovery.getContractValue<string[]>(
  'RegistryPermission',
  'dataStorePermission',
)

const registerOperatorPermissionList = discovery.getContractValue<string[]>(
  'RegistryPermission',
  'registerOperatorPermission',
)

export const mantleDABridge = {
  id: 'mantleDABridge',
  type: 'DAC',
  display: {
    name: 'Mantle DAC',
    slug: 'dac',
    description:
      'There is a Mantle DA bridge on Ethereum storing data availability commitments.',
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
      discovery.getContractDetails('BLSRegistry', {
        description:
          'This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.',
      }),
      discovery.getContractDetails('RegistryPermission', {
        description:
          'This contract is used to manage permissions for the BLSRegistry contract.',
      }),
      discovery.getContractDetails('PauserRegistry', {
        description:
          'This contract is used to manage permissions for the DataLayrServiceManager contract.',
      }),
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
      'MantleEngineeringMultisig',
      'The owner of the DA bridge. This entity is responsible for managing the bridge, it can pause the bridge and change various parameters such as the quorum threshold and service fee for node operators.',
    ),
    {
      name: 'Permissioned Operators',
      description: `List of addresses authorized to sign data commitments for the DA bridge.`,
      accounts: operatorsList.map((operator) => ({
        address: EthereumAddress(operator),
        type: 'EOA',
      })),
    },
    {
      name: 'Permission Data Store',
      description: `List of addresses authorized to post data commitments to the DA bridge.`,
      accounts: dataStorePermissionList.map((permissionedAddress) => ({
        address: EthereumAddress(permissionedAddress),
        type: 'EOA',
      })),
    },
    {
      name: 'Permissioned Register Operator',
      description: `List of addresses authorized to register or change status of DA node operators.`,
      accounts: registerOperatorPermissionList.map((permissionedAddress) => ({
        address: EthereumAddress(permissionedAddress),
        type: 'EOA',
      })),
    },
  ],
  chain: ChainId.ETHEREUM,
  transactionDataType: DacTransactionDataType.TransactionData,
  members: {
    type: 'unknown',
  },
  requiredMembers: threshold,
  totalMembers: committeeMembers,
  usedIn: toUsedInProject([mantle]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(), // no delay
  },
} satisfies DaBridge
