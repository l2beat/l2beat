import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('lightlink')

const upgradesLightLink = {
  upgradableBy: ['LightLinkAdmin'],
  upgradeDelay: 'No delay',
}

const CSCowner = discovery.getContractValue<string>(
  'CanonicalStateChain',
  'owner',
)

const LightLinkMultisig = discovery.getContractValue<string>(
  'L1BridgeRegistry',
  'multisig',
)

const validators = discovery.getContractValue<
  { addr: string; power: number }[]
>('L1BridgeRegistry', 'getValidators')

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

const publisher = discovery.getContractValue<string>(
  'CanonicalStateChain',
  'publisher',
)

const daOracle = discovery.getContractValue<string>('ChainOracle', 'daOracle')

/* Initally added as L2, commented out sections are from the original file. Keep em to not do the work again. */

// const CHALLENGE_WINDOW_SECONDS = discovery.getContractValue<number>(
//   'Challenge',
//   'challengeWindow',
// )

// const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
//   'Challenge',
//   'challengePeriod',
// )

// const CHALLENGE_FEE = utils.formatEther(
//   discovery.getContractValue<number>('Challenge', 'challengeFee'),
// )

export const lightlink: Bridge = {
  type: 'bridge',
  id: ProjectId('lightlink'),
  // dataAvailability: addSentimentToDataAvailability({
  //   layers: ['Celestia'],
  //   bridge: { type: 'None' },
  //   mode: 'Transactions data',
  // }),
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is a sidechain that lets dApps and enterprises offer users instant, gasless transactions. It aims at becoming an Ethereum Layer 2.',
    category: 'Token Bridge',
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
    // makeBridgeCompatible({
    //   stateValidation: {
    //     ...RISK_VIEW.STATE_NONE,
    //     secondLine: `${formatSeconds(CHALLENGE_WINDOW_SECONDS)} challenge period`,
    //   },
    //   dataAvailability: {
    //     ...RISK_VIEW.DATA_CELESTIA(false),
    //   },
    //   exitWindow: {
    //     description:
    //       'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
    //     sentiment: 'bad',
    //     value: 'None',
    //   },
    //   sequencerFailure: {
    //     ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    //   },
    //   proposerFailure: {
    //     value: 'Use permissioned escape hatch',
    //     description:
    //       'Users are able to exit by submitting a syncWithdraw() transaction directly on L1. To be accepted, the transaction requires signatures from a permissioned set of validators with enough voting power to reach the required threshold.',
    //     sentiment: 'bad',
    //   },
    validatedBy: {
      value: 'Third Party',
      description: `${validatorThresholdPercentage}% of Validators Voting Power`,
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  },
  // stage: {
  //   stage: 'NotApplicable',
  // },
  technology: {
    destination: ['LightLink'],
    principleOfOperation: {
      name: 'Principle of Operation',
      description: `
      Users can deposit tokens on the LightLink bridge by sending them to the L1BridgeRegistry contract on Ethereum L1. The tokens are then canonically minted on the LightLink chain through the syncDeposit() function.
      Users can withdraw their funds from LightLink by submitting their withdrawal transactions directly to the L1 smart contract. A validator multisig needs to validate the withdrawal based on off-chain validity checks. Users can exit the network once enough validators have signed off on the withdrawal.
      Currently, a minimum of ${minValidatorsForConsensus} validators is required to sign off on a withdrawal.`,
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validators',
      description: `For deposits, messages are verified by the Validators on the LightLink network, which monitor emitted DepositToken events on L1 and authorise syncDeposit transactions on LightLink.
         For withdrawals, the validators multisig on the L1 validates the withdrawal transactions and sign off on them.`,
      references: [],
      risks: [],
    },
    destinationToken: {
      name: 'Destination tokens are upgradable',
      description:
        'Tokens on the destination end up as wrapped ERC20 proxies that are upgradable, using EIP-1967.',
      references: [],
      risks: [],
    },
    //   stateCorrectness: {
    //     name: 'Fraud proofs are in development',
    //     description: `After the challenge window of ${formatSeconds(
    //       CHALLENGE_WINDOW_SECONDS,
    //     )}, the published state root is assumed to be correct. During the challenge window, anyone can challenge a block header against some basic validity checks. The challenge fee required is ${CHALLENGE_FEE} ETH.
    //         Once challenged, the permissioned defender can respond within ${formatSeconds(
    //           CHALLENGE_PERIOD_SECONDS,
    //         )} to the challenge, by providing the L2 header and the previous L2 header. If the defender does not respond,
    //         the block header is considered invalid, the canonical state chain is rolled back to the previous state root, and the challenger can claim back the challenge fee. If the defender successfully responds, the challenger loses the challenge fee to the defender.
    //         Since only the block header can be challenged and not the state transition, the system is vulnerable to invalid state roots.`,
    //     risks: [
    //       {
    //         category: 'Funds can be stolen if',
    //         text: 'an invalid state root is submitted to the system.',
    //         isCritical: true,
    //       },
    //     ],
    //     references: [
    //       {
    //         text: 'LightLink - ChallengeHeader.sol',
    //         href: 'https://etherscan.io/address/0x2785d4af59bf299c1f2dbc5132e72b2ee015b3ac#code',
    //       },
    //     ],
    //   },
    //   dataAvailability: {
    //     ...TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
    //   },
    //   operator: {
    //     ...OPERATOR.CENTRALIZED_OPERATOR,
    //   },
    //   forceTransactions: {
    //     ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    //   },
    //   exitMechanisms: [
    //     {
    //       name: 'Permissioned exit',
    //       description: `Users can withdraw their funds from LightLink by submitting their withdrawal transactions directly to the L1 smart contract. Validator nodes need to validate the withdrawal based on the state of the available data. Users can exit the network once enough validators have signed off on the withdrawal.
    //          Currently, a minimum of ${minValidatorsForConsensus} validators is required to sign off on a withdrawal.`,
    //       references: [
    //         {
    //           text: 'LightLink - L1BridgeRegistry.sol',
    //           href: 'https://etherscan.io/address/0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E',
    //         },
    //       ],
    //       risks: [
    //         {
    //           category: 'Funds can be frozen if',
    //           text: 'the permissioned validator set does not authorise L1 bridge withdrawals.',
    //           isCritical: true,
    //         },
    //       ],
    //     },
    //   ],
  },
  contracts: {
    addresses: [
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
      {
        name: 'DaOracle',
        address: EthereumAddress(daOracle),
        description:
          'The DABridge contract used to verify shares inclusion in the ChainOracle provideShares() function. If not set, data shares cannot be verified and stored in the ChainOracle contract.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Validators',
      description: `Permissioned set of actors that can validate withdrawals from the bridge. Each validators has a voting power assigned that determines the weight of their vote. Currently, the threshold is set to ${validatorThresholdPercentage}% of the total voting power.`,
      accounts: validators.map((validator) => ({
        address: EthereumAddress(validator.addr),
        type: 'EOA',
      })),
    },
    {
      name: 'Proposer',
      accounts: [{ address: EthereumAddress(publisher), type: 'EOA' }],
      description:
        'The proposer ("publisher") is responsible for pushing new state roots to the CanonicalStateChain contract on L1.',
    },
    {
      name: 'LightLinkMultisig',
      accounts: [
        { address: EthereumAddress(LightLinkMultisig), type: 'MultiSig' },
      ],
      description:
        'This address is the admin of the L1BridgeRegistry. It can pause the bridge and upgrade the bridge implementation. It also determines the validators of the bridge and their voting power. It is not a Gnosis Safe multisig, but a custom multisig implementation.',
    },
    {
      name: 'LightLinkAdmin',
      accounts: [{ address: EthereumAddress(CSCowner), type: 'EOA' }],
      description:
        'This address is the owner of all the CanonicalStateChain and Challenge contracts. Can replace the proposer and core system parameters.',
    },
  ],
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
