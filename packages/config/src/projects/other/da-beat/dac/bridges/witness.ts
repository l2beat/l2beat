import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { witness } from '../../../../layer2s/witness'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('witness')

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

const membersCountDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'WitnessValidiumDAC',
  'members',
)

export const witnessDac = {
  id: 'witness-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Witness DAC',
    slug: 'dac',
    description: 'Witness DAC on Ethereum.',
    links: {
      websites: ['https://witnesschain.com/'],
      apps: ['https://witnesschain-bridge.eu-north-2.gateway.fm'],
      documentation: ['https://docs.witnesschain.com/'],
      explorers: ['https://witnesschain-blockscout.eu-north-2.gateway.fm/'],
      repositories: ['https://github.com/witnesschain-com'],
      socialMedia: [
        'https://twitter.com/witnesschain',
        'https://discord.gg/HwnzU5CYDp',
        'https://docs.witnesschain.com/resources/technical-papers',
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('WitnessValidium', {
        description: `The main contract of the WitnessValidium. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
      }),
      discovery.getContractDetails('WitnessValidiumDAC', {
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
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('WitnessValidium', 'admin'),
        ),
      ],
      description:
        'Admin of the WitnessValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions and update the DA mode.',
    },
    {
      name: 'DACProxyAdminOwner',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('ProxyAdmin', 'owner'),
        ),
      ],
      description:
        "Owner of the WitnessValidiumDAC's ProxyAdmin. Can upgrade the contract.",
    },
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignaturesDAC,
  totalMembers: membersCountDAC,
  transactionDataType: DacTransactionDataType.TransactionData,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([witness]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
