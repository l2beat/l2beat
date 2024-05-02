import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metal')
const superchainUpgradeability = {
  upgradableBy: ['SuperchainProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const metal: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is a general-purpose OP stack rollup by Metallicus focused on banking and compliance.',
    purposes: ['Universal'],
    links: {
      websites: ['https://metall2.com/'],
      apps: [
        'https://bridge.metall2.com/',
        'https://dollar.metalx.com/',
        'https://metalpay.com/',
      ],
      documentation: [],
      explorers: ['https://explorer.metall2.com'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.metall2.com',
  genesisTimestamp: new UnixTime(1711567115),
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1711567115),
    minTimestamp: new UnixTime(1711565399), //first blob: https://etherscan.io/tx/0x24a3a82c9030b664159be27407ba980c663ccb9bc12b1e448b97b1741d8cefc0
    l2BlockTimeSeconds: 2,
    lag: 0,
  },
  isNodeAvailable: 'UnderReview',
  usesBlobs: true,
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ProxyAdminOwner',
      'Owner of the ProxyAdmin and the rollup system. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('SuperchainProxyAdmin'),
      'Admin of the shared SuperchainConfig contract.',
    ),
    ...discovery.getMultisigPermission(
      'SuperchainProxyAdminOwner',
      'Owner of the SuperchainProxyAdmin.',
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_1',
      'Member of the SuperchainProxyAdminOwner.',
    ),
    ...discovery.getMultisigPermission(
      'SecurityCouncilMultisig',
      'Member of the SuperchainProxyAdminOwner.',
      [
        {
          text: 'Security Council members - Optimism Collective forum',
          href: 'https://gov.optimism.io/t/security-council-vote-2-initial-member-ratification/7118',
        },
      ],
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_2',
      'This address is designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('SuperchainConfig', {
      description:
        'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
      ...superchainUpgradeability,
    }),
  ],
})
