import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { RISK_VIEW, makeBridgeCompatible } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('sanko', 'arbitrum')

export const sanko: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Sanko',
    slug: 'sanko',
    description:
      'Sanko is an NFT and gaming-focused Orbit stack L3 on Arbitrum with AnyTrust DA and DMT as its native token, created by Sanko GameCorp.',
    purposes: ['Gaming', 'NFT', 'Social'],
    links: {
      websites: ['https://sanko.xyz/'],
      apps: ['https://sanko.xyz/bridge'],
      documentation: ['https://sanko-1.gitbook.io/sanko-mainnet-docs/'],
      explorers: [
        'https://sanko-mainnet.calderaexplorer.xyz/',
        'https://tools.sanko.xyz/',
        'https://explorer.sanko.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://x.com/SankoGameCorp',
        'https://discord.gg/Cnz62Vfa2C',
        'https://t.me/sankogamecorp',
      ],
    },
  },
  nativeToken: 'DMT',
  associatedTokens: ['DMT'],
  rpcUrl: 'https://mainnet.sanko.xyz',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  stackedRiskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: (() => {
      const { membersCount, requiredSignatures } = discovery.getContractValue<{
        membersCount: number
        requiredSignatures: number
      }>('SequencerInbox', 'dacKeyset')
      return RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount,
        requiredSignatures,
      })
    })(),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 86400), // SequencerInbox.maxTimeVariation.delaySeconds
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(172800), // sanko l3 delay + arbitrum l2 delay (48h)
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(1209600), // 14d (2x orbitstack self propose delay)
    validatedBy: RISK_VIEW.VALIDATED_BY_L2(ProjectId('arbitrum')),
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0xb4951c0C41CFceB0D195A95FE66280457A80a990'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'Caldera Multisig',
      'Rollup Owner: Can execute upgrades for the entire rollup system via the UpgradeExecutor.',
    ),
  ],
})
