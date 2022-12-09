import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const acrossV2: Bridge = {
  type: 'bridge',
  id: ProjectId('across-v2'),
  display: {
    name: 'Across V2',
    slug: 'acrossv2',
    links: {
      websites: ['https://across.to/'],
      apps: ['https://across.to/'],
      repositories: ['https://github.com/across-protocol/contracts-v2'],
      socialMedia: [
        'https://twitter.com/AcrossProtocol',
        'https://discord.gg/across',
        'https://medium.com/across-protocol',
        'https://forum.across.to/',
      ],
    },
    description:
      'Across V2 is a cross-chain optimistic bridge that uses actors called Relayers to fulfill user transfer requests on the destination chain. Relayers are later reimbursed by providing a proof of their action to an Optimistic Oracle on Ethereum. The architecture leverages a single liquidity pool on Ethereum and separate deposit/reimburse pools on destination chains that are rebalanced using canonical bridges.',
  },
  config: {
    escrows: [
      {
        // Hub Pool:
        address: '0xc186fA914353c44b2E33eBE05f21846F1048bEda',
        sinceTimestamp: new UnixTime(1653124620),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT'],
      },
      {
        // Ethereum Spoke pool:
        address: '0x4D9079Bb4165aeb4084c526a32695dCfd2F77381',
        sinceTimestamp: new UnixTime(1653167083),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'Optimistic Oracle on Ethereum is used to assert that an action happened on the destination chain.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'No',
      description: 'The code that secures the system can never change.',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Optimism', 'Polygon', 'Boba', 'Arbitrum'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This bridge performs cross-chain swaps by borrowing liquidity from a network of Relayers who are then reimbursed on a chain of their choosing from a common liquidity pool (which consists of user deposits and deposits of independent Liquidity Providers). Specifically, when a user deposits funds for a swap into a dedicated pool on origin chain, a Relayer first pays the user on the requested destination chain and then shows proof of that deposit to Optimistic Oracle on Ethereum to be reimbursed. Liquidity used for reimbursements is rebalanced between a main pool on Ethereum (called Hub Pool) and pools on destination chains (called Spoke Pools) via native chain bridges.',
      references: [
        {
          text: 'Across V2 Architecture',
          href: 'https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-157.md',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'owner pauses the contract.',
        },
        {
          category: 'Funds can be lost if',
          text: 'owner invokes a "haircut" functionality, dedicated for irrecoverable loss of funds on L2.',
        },
      ],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation via Optimistic Oracle',
      description:
        'Money from the liquidity pool is used to reimburse Relayers based on a proof of deposit on destination chain that is provided to Optimistic Oracle on Ethereum. The proof can be disputed in a configured time period.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'a false claim to the Optimistic Oracle is not disputed in time.',
        },
        {
          category: 'Funds can be lost if',
          text: 'a re-org occurs on destination chain after Optimistic Oracle dispute time passes.',
        },
      ],
      references: [
        {
          text: 'Across V2 Optimistic Oracle documentation',
          href: 'https://docs.across.to/v2/how-does-across-work/optimistic-oracle',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Only tokens that have been bridged using native chain bridges are supported.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      {
        address: '0xc186fA914353c44b2E33eBE05f21846F1048bEda',
        name: 'HubPool',
        description:
          'Escrow contract for ERC20 tokens and administration of other contracts.',
      },
      {
        address: '0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d',
        name: 'LpTokenFactory',
      },
      {
        address: '0x40f941E48A552bF496B154Af6bf55725f18D77c3',
        name: 'Finder',
      },
      {
        address: '0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc',
        name: 'Governor',
      },
      {
        address: '0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5',
        name: 'Proposer',
      },
      {
        address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
        name: 'VotingToken',
      },
      {
        address: '0x22eD83A9eE26236486F57cE8385A247E5bFB71fF',
        name: 'Optimism_Adapter',
      },
      {
        address: '0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3',
        name: 'Boba_Adapter',
      },
      {
        address: '0x937958992799bF4A9a656E6596FD10d7Da5c2216',
        name: 'Arbitrum_Adapter',
      },
      {
        address: '0x527E872a5c3f0C7c24Fe33F2593cFB890a285084',
        name: 'Ethereum_Adapter',
      },
      {
        address: '0x4D9079Bb4165aeb4084c526a32695dCfd2F77381',
        name: 'Ethereum_SpokePool',
      },
      {
        address: '0x48d990AbDA20afa1fD1da713AbC041B60a922c65',
        name: 'PolygonTokenBridger',
      },
      {
        address: '0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A',
        name: 'Polygon_Adapter',
      },
      {
        address: '0x3B03509645713718B78951126E0A6de6f10043f5',
        name: 'AcrossConfigStore',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [
        {
          address: '0xB524735356985D2f267FA010D681f061DfF03715',
          type: 'MultiSig',
        },
      ],
      name: 'HubPool Owner MultiSig',
      description:
        'Can invoke admin functions of HubPool contract, and by implication of other contracts.',
    },
    {
      accounts: [
        { address: '0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05', type: 'EOA' },
        { address: '0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe', type: 'EOA' },
        { address: '0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9', type: 'EOA' },
        { address: '0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d', type: 'EOA' },
        { address: '0x1f11D8B72fc1B534448436BA60B4B371276DAb33', type: 'EOA' },
      ],
      name: 'MultiSig Participants',
      description: 'Participants of 3/5 MultiSig',
    },
  ],
}
