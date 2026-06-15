import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('lightlink')

const validators = discovery.getContractValue<
  { addr: string; power: number }[]
>('L1BridgeRegistry', 'getValidators')
const validatorAddresses = validators.map((v) => v.addr)

const totalVotingPower = validators
  .map((validator) => validator.power)
  .reduce((a, b) => a + b, 0)

const validatorThreshold = discovery.getContractValue<number>(
  'L1BridgeRegistry',
  'consensusPowerThreshold',
)
const validatorThresholdPercentage = (
  (validatorThreshold / totalVotingPower) *
  100
).toFixed(2)
const minValidatorsForConsensus = getMinValidatorsForConsensus(
  validators,
  validatorThreshold,
)

/* Initially added as L2, commented out sections are from the original file. */

const CHALLENGE_WINDOW_SECONDS = discovery.getContractValue<number>(
  'Challenge',
  'challengeWindow',
)

const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
  'Challenge',
  'challengePeriod',
)

const CHALLENGE_FEE = utils.formatEther(
  discovery.getContractValue<number>('Challenge', 'challengeFee'),
)

export const lightlink: ScalingProject = {
  type: 'layer2',
  id: ProjectId('lightlink'),
  capability: 'universal',
  addedAt: UnixTime(1718443080), // 2024-06-15T09:18:00Z
  badges: [BADGES.VM.EVM, BADGES.DA.Celestia],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  proofSystem: undefined,
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is a project that lets dApps and enterprises offer users instant, gasless transactions.',
    purposes: ['Universal'],
    links: {
      websites: ['https://lightlink.io'],
      bridges: ['https://phoenix.lightlink.io/apps'],
      documentation: ['https://docs.lightlink.io'],
      explorers: ['https://phoenix.lightlink.io'],
      repositories: ['https://github.com/lightlink-network'],
      socialMedia: [
        'https://twitter.com/lightlinkchain',
        'https://discord.com/invite/lightlinkchain',
        'https://t.me/lightlinkll',
        'https://linkedin.com/company/lightlinkchain',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['LL'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xB1Fb5A59A738c2df565d79572b0D6f348aE7cADE',
        ),
        sinceTimestamp: UnixTime(1725540839),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x63105ee97bfb22dfe23033b3b14a4f8fed121ee9',
        ),
        sinceTimestamp: UnixTime(1692185219),
        tokens: '*',
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.CELESTIA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  chainConfig: {
    name: 'lightlink',
    chainId: 1890,
    explorerUrl: 'https://phoenix.lightlink.io',
    sinceTimestamp: UnixTime(1692181067),
    apis: [
      {
        type: 'rpc',
        url: 'https://replicator.phoenix.lightlink.io/rpc/v1',
        callsPerMinute: 300,
      },
      { type: 'blockscout', url: 'https://phoenix.lightlink.io/api' },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_CELESTIA(false),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, CHALLENGE_WINDOW_SECONDS),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
      HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
    ),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    description:
      'The project implements an incomplete and non-functional proof system.',
    categories: [
      {
        title: 'Challenges',
        description: readProjectMarkdown(
          'lightlink',
          'stateValidationChallenges',
          {
            CHALLENGE_WINDOW_SECONDS: formatSeconds(CHALLENGE_WINDOW_SECONDS),
            CHALLENGE_FEE,
            CHALLENGE_PERIOD_SECONDS: formatSeconds(CHALLENGE_PERIOD_SECONDS),
            minValidatorsForConsensus,
          },
        ),
        references: [
          {
            title: 'LightLink L2 syncDeposit() - L2ERC20Predicate.sol',
            url: 'https://phoenix.lightlink.io/address/0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9?tab=contract_code',
          },
          {
            title: 'LightLink L1 syncWithdraw()- L1ERC20Predicate.sol',
            url: 'https://etherscan.io/address/0xa8372d6ff00d48a25baa1af16d6a86c936708f4e#code',
          },
        ],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'validators decide to not mint tokens after observing an event on Ethereum.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          },
          {
            category: 'Funds can be stolen if',
            text: "validators relay a withdraw request that wasn't originated on the source chain.",
          },
          {
            category: 'Funds can be stolen if',
            text: 'the publisher posts an invalid block header on Ethereum.',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [],
  },
  permissions: {
    ...discovery.getDiscoveredPermissions(),
    ethereum: {
      ...discovery.getDiscoveredPermissions()['ethereum'],
      roles: [
        discovery.getPermissionDetails(
          'Validators',
          discovery.formatPermissionedAccounts(validatorAddresses),
          `Permissioned set of actors that can validate withdrawals from the bridge. Each validators has a voting power assigned that determines the weight of their vote. Currently, the threshold is set to ${validatorThresholdPercentage}% of the total voting power.`,
        ),
      ],
    },
  },
  technology: {
    dataAvailability: {
      name: 'Data is posted to Celestia',
      description: `
LightLink uses Celestia for data availability. Transaction data is posted to Celestia, and block headers containing Celestia data pointers are posted to the CanonicalStateChain contract on Ethereum L1.

There is no automatic fallback mechanism to Ethereum for data availability. If Celestia becomes unavailable, the chain relies entirely on Celestia for transaction data recovery.`,
      references: [
        {
          title: 'LightLink Celestia Integration',
          url: 'https://docs.lightlink.io/lightlink-protocol/achitecture-and-design/lightlink-protocol-deep-dive#id-2-data-availability-layer',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'celestia becomes unavailable and transaction data cannot be retrieved.',
        },
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}

function getMinValidatorsForConsensus(
  validators: { addr: string; power: number }[],
  consensusThreshold: number,
) {
  // Sort validators by power in descending order
  validators.sort((a, b) => b.power - a.power)
  let totalPower = 0
  let minValidators = 0

  // Iterate over validators
  for (const validator of validators) {
    totalPower += validator.power
    minValidators++
    // If total power is greater than or equal to consensus threshold, break the loop
    if (totalPower >= consensusThreshold) {
      break
    }
  }

  return minValidators
}
