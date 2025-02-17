import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { DA_BRIDGES, DA_LAYERS, DA_MODES } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'

const discovery = new ProjectDiscovery('lightlink')

const upgradesLightLink = {
  upgradableBy: [{ name: 'LightLinkAdmin', delay: 'no' }],
}

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

export const lightlink: Layer2 = {
  type: 'layer2',
  id: ProjectId('lightlink'),
  capability: 'universal',
  addedAt: new UnixTime(1718443080), // 2024-06-15T09:18:00Z
  badges: [Badge.VM.EVM, Badge.DA.Celestia],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is a project that lets dApps and enterprises offer users instant, gasless transactions. It aims at becoming an Ethereum Layer 2.',
    category: 'Other',
    purposes: ['Universal'],
    links: {
      websites: ['https://lightlink.io'],
      apps: ['https://phoenix.lightlink.io/apps'],
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
        address: EthereumAddress('0x3ca373F5ecB92ac762f9876f6e773082A4589995'),
        sinceTimestamp: new UnixTime(1692181067),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x63105ee97bfb22dfe23033b3b14a4f8fed121ee9'),
        sinceTimestamp: new UnixTime(1692185219),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://replicator.phoenix.lightlink.io/rpc/v1',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.CELESTIA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  // chainConfig: {
  //   name: 'lightlink',
  //   chainId: 1890,
  //   explorerUrl: 'https://phoenix.lightlink.io',
  //   explorerApi: {
  //     url: 'https://phoenix.lightlink.io/api',
  //     type: 'blockscout',
  //   },
  //   minTimestampForTvl: new UnixTime(1692181067),
  // },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        RISK_VIEW.STATE_NONE.description +
        ` State updates must be signed by at least ${validatorThresholdPercentage}% of validators, which corresponds to a minimum of ${minValidatorsForConsensus} validators.`,
    },
    dataAvailability: RISK_VIEW.DATA_CELESTIA(false),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, CHALLENGE_WINDOW_SECONDS),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    stateCorrectness: {
      name: 'No state validation',
      description: `
      LightLink chain state roots are periodically posted to Ethereum through a CanonicalStateChain contract on L1. After the challenge window of ${formatSeconds(
        CHALLENGE_WINDOW_SECONDS,
      )}, the published state root is assumed to be correct. During the challenge window, anyone can challenge a block header against some basic validity checks. The challenge fee required is ${CHALLENGE_FEE} ETH.
      Once challenged, the permissioned defender can respond within ${formatSeconds(
        CHALLENGE_PERIOD_SECONDS,
      )} to the challenge, by providing the L2 header and the previous L2 header. If the defender does not respond,
      the block header is considered invalid, the canonical state chain is rolled back to the previous state root, and the challenger can claim back the challenge fee. If the defender successfully responds, the challenger loses the challenge fee to the defender.
      Since only the block header can be challenged and not the state transition, the system is vulnerable to invalid state roots. Moreover, state roots are not used for L1 bridge withdrawals.
      Users can deposit tokens on the LightLink chain by sending them to the L1BridgeRegistry contract on Ethereum L1. On the LightLink chain, token minting is then authorized by a permissioned set of signers providing signatures as input to the syncDeposit() function on the L2ERC20Predicate contract.
      Users can withdraw their funds by submitting a withdraw() transaction to the L2ERC20Predicate contract, which will burn the tokens on the LightLink chain. To then unlock tokens from the bridge on L1, a validator multisig needs to validate the withdrawal based on off-chain validity checks. 
      Users can exit the network once enough validators have signed off on the withdrawal.
      Currently, a minimum of ${minValidatorsForConsensus} validators is required to sign off on a withdrawal.`,
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
      ],
    },
    otherConsiderations: [
      {
        name: 'Destination tokens are upgradable',
        description:
          'Tokens on the destination end up as wrapped ERC20 proxies that are upgradable by the LightLinkMultisig, using EIP-1967.',
        references: [
          {
            title: 'Token Implementation - requireMultisig()',
            url: 'https://phoenix.lightlink.io/address/0x468b89D930ca7974196D7195033600B658011756?tab=contract',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'destination token contract is maliciously upgraded.',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('CanonicalStateChain', {
          description:
            'The Canonical State Chain (CSC) contract is the main contract of the LightLink network. It stores the state roots of the LightLink chain on Ethereum L1.',
          ...upgradesLightLink,
        }),
        discovery.getContractDetails('Challenge', {
          description:
            'The Challenge contract is used to challenge block headers on the LightLink chain. Currently, data availability challenges and execution challenges are not enabled.',
          ...upgradesLightLink,
        }),
        discovery.getContractDetails('L1BridgeRegistry', {
          description:
            'The L1BridgeRegistry contract is used to store the address of the LightLink multisig and the address and voting power of the validators managing the bridge.',
        }),
        discovery.getContractDetails('ChainOracle', {
          description:
            'If the DAOracle is set, this contract enables any user to directly upload valid Layer 2 blocks from the data availability layer to the L1.',
          ...upgradesLightLink,
        }),
      ],
    },
    risks: [],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Validators',
          discovery.formatPermissionedAccounts(validatorAddresses),
          `Permissioned set of actors that can validate withdrawals from the bridge. Each validators has a voting power assigned that determines the weight of their vote. Currently, the threshold is set to ${validatorThresholdPercentage}% of the total voting power.`,
        ),
        discovery.getPermissionDetails(
          'Proposer',
          discovery.getPermissionedAccounts('CanonicalStateChain', 'publisher'),
          'The proposer ("publisher") is responsible for pushing new state roots to the CanonicalStateChain contract on L1.',
        ),
        discovery.getPermissionDetails(
          'LightLinkMultisig',
          discovery.getPermissionedAccounts('L1BridgeRegistry', 'multisig'),
          'This address is the admin of the L1BridgeRegistry. It can pause the bridge and upgrade the bridge implementation. It also determines the validators of the bridge and their voting power. It is not a Gnosis Safe multisig, but a custom multisig implementation.',
        ),
        discovery.getPermissionDetails(
          'LightLinkAdmin',
          discovery.getPermissionedAccounts('CanonicalStateChain', 'owner'),
          'This address is the owner of all the CanonicalStateChain and Challenge contracts. Can replace the proposer and core system parameters.',
        ),
      ],
    },
  },
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
