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

const discovery = new ProjectDiscovery('myria')

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

export const myria: Layer2 = {
  type: 'layer2',
  id: ProjectId('myria'),
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
    name: 'Myria',
    slug: 'myria',
    description:
      'Myria is an expansive blockchain gaming ecosystem, comprised of a blockchain gaming hub and Myriaverse metaverse.',
    purposes: ['NFT', 'Exchange', 'Gaming'],
    stack: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://myria.com/'],
      apps: ['https://hub.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@myriagames',
        'https://twitter.com/myria',
        'https://discord.gg/myria',
        'https://t.me/myriaofficialgroup',
        'https://instagram.com/myriagames',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['MYRIA'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7'),
        sinceTimestamp: new UnixTime(1659542607),
        tokens: ['ETH'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: ['myria'],
      sinceTimestamp: new UnixTime(1659542607),
      resyncLastDays: 7,
    },
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
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
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
      title: 'Mainnet Launch',
      date: '2022-08-26T00:00:00Z',
      url: 'https://medium.com/myria-official/myrias-layer-2-launch-has-arrived-6a3c3da9561f',
      description:
        'Layer 2 scaling solution powered by Starware is live on Ethereum.',
      type: 'general',
    },
    {
      title: 'MYRIA Token Airdrop',
      date: '2023-04-06T00:00:00Z',
      url: 'https://medium.com/myria-official/the-myria-token-is-live-c8dd92b876cc',
      description: 'MYRIA token launches.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
  customDa: StarkexDAC({ discovery }),
}
