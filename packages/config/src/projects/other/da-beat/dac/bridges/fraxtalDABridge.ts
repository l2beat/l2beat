import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { fraxtal } from '../../../../layer2s/fraxtal'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../types/DaRelayerFailureRisk'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('fraxtal')

const sequencerInbox = discovery.getContractValue<string>(
  'SystemConfig',
  'sequencerInbox',
)

export const fraxtalDABridge = {
  id: 'fraxtalDABridge',
  createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
  type: 'NoBridge',
  display: {
    name: 'No Bridge',
    slug: 'da',
    description: `The SequencerInbox only stores IPFS hash commitments posted by the sequencer. It is not possible to verify blob inclusion against the data commitments onchain.
      Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.`,
    links: {
      websites: ['https://redstone.xyz/'],
      apps: ['https://redstone.xyz/deposit'],
      documentation: ['https://redstone.xyz/docs'],
      explorers: ['https://explorer.redstone.xyz/'],
      repositories: ['https://github.com/latticexyz/redstone'],
      socialMedia: [
        'https://twitter.com/redstonexyz',
        'https://discord.com/invite/latticexyz',
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        {
          address: EthereumAddress(sequencerInbox),
          name: 'SequencerInbox',
          description:
            'This address is used to store transaction batch hashes as data availability commitments.',
        },
        discovery.getContractDetails('ProxyAdmin', {
          description:
            'The ProxyAdmin contract is the owner of SystemConfig and can change the address of the SequencerInbox for the system.',
        }),
      ],
    },
    risks: [],
  },
  technology: {
    description: `There is no committee attesting to the availability of the data. For L2 chain derivation, the system relies on sequencer commitments to an L1 onchain inbox. See DA layer technology section for more details.\n`,
  },
  permissions: {
    ethereum: [
      {
        name: 'Sequencer (relayer)',
        accounts: [
          discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
        ],
        description:
          'Central actor allowed to relay DA commitments to the SequencerInbox.',
      },
      {
        name: 'SystemConfig owner',
        description:
          'Account privileged to change System Config parameters such as Sequencer Address and gas limit.',
        accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
      },
    ],
  },
  usedIn: toUsedInProject([fraxtal]),
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.NoBridge,
    upgradeability: DaUpgradeabilityRisk.NoBridge,
    relayerFailure: DaRelayerFailureRisk.NoBridge,
  },
} satisfies DaBridge
