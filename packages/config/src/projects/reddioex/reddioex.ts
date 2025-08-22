import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { delayDescriptionFromString } from '../../utils/delayDescription'

const discovery = new ProjectDiscovery('reddioex')

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkExchange',
  'StarkWareDiamond_upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)
const upgradeDelay = formatSeconds(upgradeDelaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const { committeePermission, minSigners } = getCommittee(discovery)

export const reddioex: ScalingProject = {
  type: 'layer2',
  id: ProjectId('reddioex'),
  addedAt: UnixTime(1684838286), // 2023-05-23T10:38:06Z
  archivedAt: UnixTime(1728259200), // 2024-10-07T00:00:00.000Z,
  capability: 'universal',
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.DAC,
    BADGES.Stack.StarkEx,
    BADGES.Infra.SHARP,
  ],
  display: {
    name: 'RedSonic',
    slug: 'redsonic',
    headerWarning:
      'This project was sunset on 2024-09-20 and deposits after that time may not be recoverable.',
    description:
      'RedSonic is a Validium based on the StarkEx technology. Its goal is to power the next generation Web3 apps and games by providing developers with the APIs and SDKs to create digital assets and easily integrate them in-app and in-game.',
    purposes: ['Exchange', 'NFT', 'Gaming'],
    stacks: ['StarkEx'],
    links: {
      websites: ['https://reddio.com/'],
      bridges: [
        'https://reddio.com/explore',
        'https://dashboard.reddio.com',
        'https://bridge.reddio.com',
        'https://reddio.com/redSonic',
        'https://points.reddio.com',
      ],
      documentation: ['https://docs.reddio.com/'],
      explorers: ['https://explorer.reddio.com/'],
      repositories: ['https://github.com/reddio-com/starkex-contracts-source'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
        'https://discord.com/invite/SjNAJ4qkK3',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xB62BcD40A24985f560b5a9745d478791d8F1945C',
        ),
        tokens: ['ETH', 'USDC', 'USDT'],
        description: 'Main StarkEx contract, used also as an escrow.',
      }),
    ],
    /*
    transactionApi: {
      type: 'starkex',
      product: ['reddio'],
      sinceTimestamp: UnixTime(1615389188),
      resyncLastDays: 7,
    },
    */
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  },
  stateValidation: {
    categories: [STATE_VALIDATION.STARKEX_VALIDITY_PROOFS],
  },
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('StarkExchange'),
        discovery.getContractDetails(
          'DACommittee',
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
        ),
        ...getSHARPVerifierContracts(discovery, verifierAddress),
      ],
    },
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Governor',
          getProxyGovernance(discovery, 'StarkExchange'),
          'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromString(upgradeDelay),
        ),
        committeePermission,
        ...getSHARPVerifierGovernors(discovery, verifierAddress),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
          'Allowed to update the state. When the Operator is down the state cannot be updated.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Reddio Announces Mainnet Launch',
      url: 'https://blog.reddio.com/announces-layer2-zkrollup-mainnet-launch/',
      date: '2022-09-29T00:00:00Z',
      description: 'Reddio announces its Validium Mainnet launch.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
