import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { xlayer } from '../../../../layer2s/xlayer'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('xlayer')

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

const membersCountDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'XLayerValidiumDAC',
  'members',
)

export const xlayerDac = {
  id: 'xlayer-dac-bridge',
  type: 'DAC',
  display: {
    name: 'X Layer DAC',
    slug: 'dac',
    description: 'X Layer DAC on Ethereum.',
    links: {
      websites: ['https://okx.com/x1'],
      apps: [],
      documentation: ['https://okx.com/xlayer/docs'],
      explorers: ['https://okx.com/explorer/xlayer'],
      repositories: [],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('XLayerValidium', {
        description: `The main contract of the XLayerValidium. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
      }),
      discovery.getContractDetails('XLayerValidiumDAC', {
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
          discovery.getContractValue('XLayerValidium', 'admin'),
        ),
      ],
      description:
        'Admin of the XLayerValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions and update the DA mode.',
    },
    {
      name: 'DACProxyAdminOwner',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('ProxyAdmin', 'owner'),
        ),
      ],
      description:
        "Owner of the XLayerValidiumDAC's ProxyAdmin. Can upgrade the contract.",
    },
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignaturesDAC,
  totalMembers: membersCountDAC,
  transactionDataType: DacTransactionDataType.TransactionData,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([xlayer]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
