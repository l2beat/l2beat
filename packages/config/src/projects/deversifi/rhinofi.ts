import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { StarkexDAC } from '../../templates/starkex-template'

const discovery = new ProjectDiscovery('deversifi')
const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkExchange',
  'StarkWareDiamond_upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const { committeePermission, minSigners } = getCommittee(discovery)

export const rhinofi: ScalingProject = {
  type: 'layer2',
  id: ProjectId('deversifi'),
  capability: 'appchain',
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.DAC,
    BADGES.Stack.StarkEx,
    BADGES.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
  display: {
    architectureImage: 'starkex',
    name: 'rhino.fi',
    slug: 'rhinofi',
    headerWarning:
      'The [RhinoFi StarkEx Validium is being deprecated](https://support.rhino.fi/en/article/important-upgrade-rhino-revamp-is-coming-cuks7m/). The RhinofiAdminMultisig upgraded the implementation of the core contract and subsequently [withdrew all funds](https://etherscan.io/tx/0x9c1692398b107161c7af2c1c02316d449bdf03b15e84b69170373b2864dba754). The Validium is no longer operational and funds are currently held in a multisig on Ethereum (2025/03/10).',
    description: 'rhino.fi is a Validium based on the StarkEx technology.',
    purposes: ['Exchange'],
    stack: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://rhino.fi/'],
      apps: ['https://app.rhino.fi/'],
      documentation: [
        'https://docs.rhino.fi/',
        'https://support.rhino.fi/en/',
        'https://docs.starkware.co/starkex/index.html',
      ],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/rhinofi',
      ],
      socialMedia: [
        'https://rhino.fi/blog',
        'https://twitter.com/rhinofi',
        'https://linkedin.com/company/rhinofi/',
        'https://youtube.com/c/rhinofi',
        'https://discord.com/invite/26sXx2KAhy',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'deversifi',
    chainId: undefined,
    apis: [{ type: 'starkex', product: ['rhinofi'] }],
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b'),
        sinceTimestamp: UnixTime(1590491810),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1590491810),
      resyncLastDays: 7,
    },
    // trackedTxs: [
    //   {
    //     uses: [
    //       { type: 'liveness', subtype: 'stateUpdates' },
    //       { type: 'l2costs', subtype: 'stateUpdates' },
    //     ],
    //     query: {
    //       formula: 'functionCall',
    //       address: EthereumAddress(
    //         '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
    //       ),
    //       selector: '0x538f9406',
    //       functionSignature:
    //         'function updateState(uint256[] publicInput, uint256[] applicationData)',
    //       sinceTimestampInclusive: UnixTime(1590491810),
    //     },
    //   },
    // ],
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
      { existsBlocklist: true },
    ),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: [...EXITS.STARKEX_PERPETUAL, EXITS.STARKEX_BLOCKLIST],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Rebranding',
      date: '2022-07-13T00:00:00Z',
      url: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi becomes rhino.fi: multi-chain platform gathering DeFi in one place.',
      type: 'general',
    },
    {
      title: 'DeversiFi Relaunched using Starkware',
      date: '2020-06-03T00:00:00Z',
      url: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi is live, bringing first STARKex Validium for spot trading.',
      type: 'general',
    },
  ],
  customDa: StarkexDAC({ discovery }),
}
