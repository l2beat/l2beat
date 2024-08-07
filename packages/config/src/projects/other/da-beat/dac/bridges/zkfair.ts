import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { zkfair } from '../../../../layer2s/zkfair'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('zkfair')

const upgradeability = {
  upgradableBy: ['ZKFairAdmin'],
  upgradeDelay: 'None',
}

const membersCountDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'ZKFairValidiumDAC',
  'members',
)

export const zkfairDac = {
  id: 'zkfair-dac-bridge',
  type: 'DAC',
  display: {
    name: 'ZKFair DAC',
    slug: 'dac',
    description: 'zkfair DAC on Ethereum.',
    links: {
      websites: ['https://zkfair.io/'],
      apps: ['https://wallet.zkfair.io/'],
      documentation: ['https://docs.zkfair.io/'],
      explorers: ['https://scan.zkfair.io/'],
      repositories: ['https://github.com/ZKFair'],
      socialMedia: ['https://twitter.com/ZKFCommunity'],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('ZKFairValidium', {
        description: `The main contract of ZKFair. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
      }),
      discovery.getContractDetails('ZKFairValidiumDAC', {
        description:
          'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
        ...upgradeability,
      }),
    ],
    risks: [],
  },
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${requiredSignaturesDAC}/${membersCountDAC} threshold of signatures to be met before the data commitment is accepted.
  `,
  permissions: [
    {
      name: 'Committee Members',
      description: `List of addresses authorized to sign data commitments for the DA bridge.`,
      accounts: members.map((operator) => ({
        address: EthereumAddress(operator[1]),
        type: 'EOA',
      })),
    },
    ...discovery.getMultisigPermission(
      'ZKFairAdmin',
      'Admin of the ZKFairValidiumDAC contract, can set core system parameters like timeouts, sequencer, activate forced transactions, update the DA mode and upgrade the ZKFairValidiumDAC contract',
    ),
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignaturesDAC,
  totalMembers: membersCountDAC,
  transactionDataType: DacTransactionDataType.StateDiffs,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([zkfair]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
