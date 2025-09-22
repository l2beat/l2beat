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
        description: `
      LightLink chain state roots are periodically posted to Ethereum through a CanonicalStateChain contract on L1 as block headers that also contain Celestia data pointers. After the challenge window of ${formatSeconds(
        CHALLENGE_WINDOW_SECONDS,
      )}, the published state root is assumed to be correct. During the challenge window, anyone can challenge a block header against some basic validity checks. The challenge fee required is ${CHALLENGE_FEE} ETH.
      Once challenged, the permissioned defender can respond within ${formatSeconds(
        CHALLENGE_PERIOD_SECONDS,
      )} to the challenge, by providing the L2 header and the previous L2 header. If the defender does not respond,
      the block header is considered invalid, the canonical state chain is rolled back to the previous state root, and the challenger can claim back the challenge fee. If the defender successfully responds, the challenger loses the challenge fee to the defender.
      Since only the block header can be challenged and not the state transition, the system is vulnerable to invalid state roots. Moreover, state roots are not used for ERC20 withdrawals from the LightLinkERC20Bridge.
      Users can deposit tokens on the LightLink chain by sending them to the L1BridgeRegistry contract on Ethereum L1. On the LightLink chain, ERC20 token minting is then authorized by a permissioned set of signers providing signatures as input to the syncDeposit() function on the L2ERC20Predicate contract.
      Users can withdraw their funds by submitting a withdraw() transaction to the L2ERC20Predicate contract, which will burn the tokens on the LightLink chain. To then unlock tokens from the bridge on L1, a validator multisig needs to validate the withdrawal based on off-chain validity checks. 
      Users can exit the network once enough validators have signed off on the withdrawal.
      Currently, a minimum of ${minValidatorsForConsensus} validators is required to sign off on a withdrawal. To deposit the gas token, i.e. ETH, the LightLinkPortal is used which uses the CanonicalStateChain as the source for the state root, and withdrawals follow the usual OP stack process.`,
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
  technology: {},
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
