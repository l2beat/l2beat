import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metal')
const superchainUpgradeability = {
  upgradableBy: ['SuperchainProxyAdmin'],
  upgradeDelay: 'No delay',
}

const livenessInterval = discovery.getContractValue<string>(
  'LivenessModule',
  'livenessInterval',
)

export const metal: Layer2 = opStackL2({
  discovery,
  associatedTokens: ['MTL'],
  badges: [Badge.Infra.Superchain, Badge.RaaS.Conduit],
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
      documentation: ['https://docs.metall2.com'],
      explorers: ['https://explorer.metall2.com'],
      repositories: ['https://github.com/MetalPay'],
      socialMedia: [
        'https://twitter.com/metalpaysme',
        'https://reddit.com/r/metalpay/',
        'https://facebook.com/metalpaysme',
        'https://t.me/metalpaysme',
        'https://linkedin.com/company/metallicus',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.metall2.com',
  genesisTimestamp: new UnixTime(1711567115),
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: new UnixTime(1711567115),
  //   minTimestamp: new UnixTime(1711565399), //first blob: https://etherscan.io/tx/0x24a3a82c9030b664159be27407ba980c663ccb9bc12b1e448b97b1741d8cefc0
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },
  // Set explicitly since finality calculation returns weird results
  finality: undefined,
  isNodeAvailable: 'UnderReview',
  usesBlobs: true,
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig',
      'Designated as the owner of the SystemConfig, meaning it can update the preconfer address, the batch submitter address and the gas configuration of the system.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('SuperchainProxyAdmin'),
      'Admin of the shared SuperchainConfig contract.',
    ),
    ...discovery.getMultisigPermission(
      'SuperchainProxyAdminOwner',
      'Owner of the ProxyAdmin and SuperchainProxyAdmin.',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      'Address allowed to pause withdrawals in case of an emergency. It is controlled by the Security Council multisig, but a deputy module allows the Foundation to act through it. The Security Council can disable the module if the Foundation acts maliciously.',
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_1',
      'Member of the ProxyAdminOwner.',
    ),
    ...discovery.getMultisigPermission(
      'SecurityCouncilMultisig',
      `Member of the ProxyAdminOwner. It implements a LivenessModule used to remove inactive (${livenessInterval}) members while making sure that the threshold remains above 75%. If the number of members falls below 8, the Foundation takes ownership of the Security Council.`,
      [
        {
          text: 'Security Council members - Optimism Collective forum',
          href: 'https://gov.optimism.io/t/security-council-vote-2-initial-member-ratification/7118',
        },
      ],
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_2',
      'Deputy to the GuardianMultisig.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('SuperchainConfig', {
      description:
        'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
      ...superchainUpgradeability,
    }),
    discovery.getContractDetails('DeputyGuardianModule', {
      description:
        'The DeputyGuardianModule is a Gnosis Safe module that allows the OP Foundation to act through the GuardianMultisig, which is owned by the Security Council. It is used to pause withdrawals in case of an emergency, blacklist games, disable the proof system, and update the anchor state. The Security Council can disable the module if the Foundation acts maliciously.',
      ...superchainUpgradeability,
    }),
    discovery.getContractDetails('LivenessModule', {
      description: `The LivenessModule is a Gnosis Safe nodule used to remove Security Council members that have been inactive for ${livenessInterval} while making sure that the threshold remains above 75%. If the number of members falls below 8, the FoundationMultisig_1 takes ownership of the multisig.`,
      ...superchainUpgradeability,
    }),
  ],
})
