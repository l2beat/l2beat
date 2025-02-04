import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { Layer2 } from '../../types'
import { delayDescriptionFromString } from '../../utils/delayDescription'
import { Badge } from '../badges'
import { StarkexDAC } from '../da-beat/templates/starkex-template'

const discovery = new ProjectDiscovery('deversifi')
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

export const rhinofi: Layer2 = {
  type: 'layer2',
  id: ProjectId('deversifi'),
  capability: 'appchain',
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    Badge.VM.AppChain,
    Badge.DA.DAC,
    Badge.Stack.StarkEx,
    Badge.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
  display: {
    name: 'rhino.fi',
    slug: 'rhinofi',
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
  config: {
    escrows: [
      {
        address: EthereumAddress('0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b'),
        sinceTimestamp: new UnixTime(1590491810),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    transactionApi: {
      type: 'starkex',
      product: ['rhinofi'],
      sinceTimestamp: new UnixTime(1590491810),
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
    //       sinceTimestampInclusive: new UnixTime(1590491810),
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
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('StarkExchange'),
        discovery.getContractDetails(
          'Committee',
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
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Governors',
          getProxyGovernance(discovery, 'StarkExchange'),
          'Can upgrade the implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromString(upgradeDelay),
        ),
        discovery.getMultisigPermission(
          'GovernanceMultisig',
          'Has full power to upgrade the bridge implementation as a Governor.',
        ),
        committeePermission,
        ...getSHARPVerifierGovernors(discovery, verifierAddress),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
          'Allowed to update the state of the system. When the Operator is down the state cannot be updated.',
        ),
        discovery.contractAsPermissioned(
          // this multisig does not get recognized as such (because of the old proxy?)
          discovery.getContract('DeversiFiTreasuryMultisig'),
          'Is the BlockAdmin: Can add owner keys to a blocklist in the bridge, blocking their withdrawals on L1. After 2 weeks, this multisig can manually withdraw even for blocked actors.',
        ),
      ],
    },
  },
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
  knowledgeNuggets: [...NUGGETS.STARKWARE],
  customDa: StarkexDAC({ discovery }),
}
