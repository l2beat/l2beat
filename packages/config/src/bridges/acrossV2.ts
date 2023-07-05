import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const PROJECT_ID = ProjectId('across-v2')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

export const acrossV2: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  display: {
    name: 'Across V2',
    slug: 'acrossv2',
    category: 'Liquidity Network',
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda'),
        sinceTimestamp: new UnixTime(1653124620),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
        sinceTimestamp: new UnixTime(1682355155),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT'],
      }),
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: EthereumAddress('0x4D9079Bb4165aeb4084c526a32695dCfd2F77381'),
        sinceTimestamp: new UnixTime(1653167083),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT'],
        isHistorical: true,
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'Optimistic Oracle on Ethereum is used to assert that an action happened on the destination chain. The timeout used here is 2hrs.',
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
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
      discovery.getContractDetails(
        'HubPool',
        'Escrow contract for ERC20 tokens and administration of other contracts.',
      ),
      discovery.getContractDetails('LpTokenFactory'),
      discovery.getContractDetails('Finder'),
      discovery.getContractDetails('GovernorV2'),
      discovery.getContractDetails('ProposerV2'),
      discovery.getContractDetails('VotingToken'),
      discovery.getContractDetails('Optimism_Adapter'),
      discovery.getContractDetails('Boba_Adapter'),
      discovery.getContractDetails('Arbitrum_Adapter'),
      discovery.getContractDetails('Ethereum_Adapter'),
      discovery.getContractDetails('Ethereum_SpokePool'),
      {
        // TODO: What is this?
        name: 'PolygonTokenBridger',
        address: EthereumAddress('0x48d990AbDA20afa1fD1da713AbC041B60a922c65'),
      },
      discovery.getContractDetails('Polygon_Adapter'),
      {
        // TODO: What is this?
        name: 'AcrossConfigStore',
        address: EthereumAddress('0x3B03509645713718B78951126E0A6de6f10043f5'),
      },
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'HubPool Multisig',
      'Can invoke admin functions of HubPool contract, and by implication of other contracts.',
    ),
  ],
  knowledgeNuggets: [
    {
      title: 'Across deep dive',
      url: 'https://li.fi/knowledge-hub/across-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
