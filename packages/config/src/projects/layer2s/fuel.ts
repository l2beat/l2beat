import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { Layer2 } from './types'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { formatEther } from 'ethers/lib/utils'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('fuel')
const depositLimitGlobal = formatEther(
  discovery.getContractValue<number>('FuelMessagePortal', 'depositLimitGlobal'),
)
const isErc20whitelistActive = discovery.getContractValue<boolean>(
  'FuelERC20Gateway',
  'whitelistRequired',
)

export const fuel: Layer2 = {
  id: ProjectId('fuel'),
  display: {
    name: 'Fuel',
    slug: 'fuel',
    description:
      'Fuel plans to build the fastest execution layer for the modular blockchain stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://fuel.network/'],
      apps: ['https://alpha.fuel.network/ecosystem/'],
      documentation: ['https://docs.fuel.network/'],
      explorers: ['https://fuellabs.github.io/block-explorer-v2/beta-4/#/'],
      repositories: ['https://github.com/FuelLabs/'],
      socialMedia: [
        'https://twitter.com/fuel_network',
        'https://discord.com/invite/fuelnetwork',
        'https://forum.fuel.network/',
      ],
    },
  },
  type: 'layer2',
  config: {
    escrows: [],
  },
  riskView: {
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: false,
      fraudProofSystemAtLeast5Outsiders: null,
      usersCanExitWithoutCooperation: false,
      usersHave7DaysToExit: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
      proofSystemOverriddenOnlyInCaseOfABug: false,
    },
  }),
  technology: {},
  permissions: [
    {
      name: 'ERC20Gateway pausers',
      description: 'Whitelisted addresses that can pause the ERC20Gateway.',
      accounts: discovery.getAccessControlRolePermission(
        'ERC20Gateway',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'FuelMessagePortal pausers',
      description:
        'Whitelisted addresses that can pause the FuelMessagePortal and blacklist L2->L1 messages.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelMessagePortal',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'FuelChainState pausers',
      description: 'Whitelisted addresses that can pause the FuelChainState.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelChainState',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'Sequencer',
      description: 'Permissioned address submitting tx data as blobs.',
      accounts: [
        {
          address: EthereumAddress(
            '0xEA0337EFC12e98AB118948dA570C07691E8E4b37', // hardcoded in the node
          ),
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Proposer',
      description: 'Permissioned address that can propose new state roots.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelChainState',
        'COMMITTER_ROLE',
      ),
    },
    ...discovery.getMultisigPermission(
      'FuelMultisig',
      'Can upgrade the FuelERC20Gateway, FuelMessagePortal and FuelChainState contracts, potentially gaining access to all funds. It can unpause contracts and remove L2->L1 messages from the blacklist. It can also limit the tokens that can be bridged to L2.',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('FuelERC20Gateway', {
        description: `Standard gateway to deposit and withdraw ERC20 tokens. It implements rate limits and a whitelist for tokens. The whitelist is currently ${isErc20whitelistActive ? 'active' : 'inactive'}.`,
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
      discovery.getContractDetails('FuelMessagePortal', {
        description: `Contract that allows to send and receive arbitrary messages to and from L2. It implements a max deposit limit for ETH, currently set to ${depositLimitGlobal} ETH, and rate limits withdrawals. Pausers are allowed to blacklist L2->L1 messages.`,
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
      discovery.getContractDetails('FuelChainState', {
        description: '',
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
    ],
    risks: [],
  },
}
