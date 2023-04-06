import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getProxyGovernance } from '../discovery/starkware/getProxyGovernance'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('deversifi')
const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)

export const rhinofi: Layer2 = {
  type: 'layer2',
  id: ProjectId('deversifi'),
  display: {
    name: 'rhino.fi',
    slug: 'rhinofi',
    description:
      'rhino.fi (formerly DeversiFi) claims to be the easiest way to access DeFi opportunities on Ethereum: invest, trade, and send tokens without paying gas fees.',
    purpose: 'Exchange',
    links: {
      websites: ['https://rhino.fi/'],
      apps: ['https://app.rhino.fi/'],
      documentation: [
        'https://docs.rhino.fi/',
        'https://support.rhino.fi/en/',
        'https://docs.starkware.co/starkex-docs-v2/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/rhinofi',
      ],
      socialMedia: [
        'https://rhino.fi/blog',
        'https://twitter.com/rhinofi',
        'https://linkedin.com/company/rhinofi/',
        'https://youtube.com/c/rhinofi',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    associatedTokens: ['DVF'],
    escrows: [
      {
        address: discovery.getContract('StarkExchange').address,
        sinceTimestamp: new UnixTime(1590491810),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'starkex',
      product: 'deversifi',
      sinceTimestamp: new UnixTime(1590491810),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADE_DELAY(delay),
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'Validium',
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
    exitMechanisms: EXITS.STARKEX,
  },
  contracts: {
    addresses: [
      discovery.getMainContractDetails('StarkExchange'),
      discovery.getMainContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      SHARP_VERIFIER_CONTRACT,
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(delay)],
  },
  permissions: [
    {
      name: 'Governors',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade the implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(delay),
    },
    {
      name: 'Data Availability Committee',
      accounts: discovery
        .getConstructorArg<string[]>('Committee', 0)
        .map(discovery.formatPermissionedAccount.bind(discovery)),
      description: `Validity proof must be signed by at least ${discovery.getConstructorArg<string>(
        'Committee',
        1,
      )} of these addresses to approve state update.`,
    },
    {
      name: 'SHARP Verifier Governors',
      accounts: getProxyGovernance(discovery, 'CallProxy'),
      description:
        'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. ' +
        discovery.getDelayStringFromUpgradeability('CallProxy', 'upgradeDelay'),
    },
    discovery.getGnosisSafeDetails(
      'VerifierGovernorMultisig',
      'SHARP Verifier Governor.',
    ),
    {
      name: 'Operators',
      accounts: discovery
        .getContractValue<string[]>('StarkExchange', 'OPERATORS')
        .map(discovery.formatPermissionedAccount.bind(discovery)),
      description:
        'Allowed to update the state of the system. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Rebranding',
      date: '2022-07-13T00:00:00Z',
      link: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi becomes rhino.fi: multi-chain platform gathering DeFi in one place.',
    },
    {
      name: 'DeversiFi Relaunched using Starkware',
      date: '2020-06-03T00:00:00Z',
      link: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi is live, bringing first STARKex Validium for spot trading.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
