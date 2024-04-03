import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { utils } from 'ethers'

import { NUGGETS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const PROJECT_ID = ProjectId('across-v3')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

const finalizationDelay = formatSeconds(discovery.getContractValue<number>(
  'HubPool',
  'liveness',
))

const bondAmount = utils.formatEther(discovery.getContractValue<number>('HubPool', 'bondAmount'));

export const acrossV3: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  display: {
    name: 'Across V3',
    slug: 'acrossv3',
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
      'Across V3 is a cross-chain optimistic bridge that uses actors called Relayers to fulfill user transfer requests on the destination chain.',
    detailedDescription:
      'Relayers are later reimbursed by providing a proof of their action to an Optimistic Oracle on Ethereum. Relayer reimbursements over a specific block range are bundled and posted on-chain as merkle roots which uniquely identify the set of all repayments and rebalance instructions. The architecture leverages a single liquidity pool on Ethereum and separate deposit/reimburse pools on destination chains that are rebalanced using canonical bridges.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda'),
        sinceTimestamp: new UnixTime(1653124620),
        tokens: ['USDC', 'WETH', 'WBTC', 'DAI', 'BAL', 'UMA', 'BOBA', 'USDT', 'ACX'],
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
        `Optimistic Oracle on Ethereum is used to assert that an action happened on the destination chain. The timeout used here is ${finalizationDelay}.`,
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Optimism', 'Polygon', 'Boba', 'Arbitrum', 'ZkSync Era', 'Linea', 'Polygon zkEVM', 'Scroll'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This bridge performs cross-chain swaps by borrowing liquidity from a network of Relayers who are then reimbursed on a chain of their choosing from a common liquidity pool (which consists of user deposits and deposits of independent Liquidity Providers). Specifically, when a user deposits funds for a swap into a dedicated pool on origin chain, a Relayer first pays the user on the requested destination chain and then shows proof of that deposit to Optimistic Oracle on Ethereum to be reimbursed. Liquidity used for reimbursements is rebalanced between a main pool on Ethereum (called Hub Pool) and pools on destination chains (called Spoke Pools) via native chain bridges.',
      references: [
        {
          text: 'Across V3 Architecture',
          href: 'https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-179.md',
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
        'Money from the liquidity pool is used to reimburse Relayers based on a proof of deposit on a destination chain that is provided to an Optimistic Oracle on Ethereum. The proof can be disputed in a configured time period.',
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
          text: 'Across V3 Optimistic Oracle documentation',
          href: 'https://docs.across.to/how-across-works/security-model',
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
        `Escrow contract for ERC20 tokens and administration of other contracts. There is a ${
          finalizationDelay} delay before a bundle proposal is considered finalized.`,
      ),
      discovery.getContractDetails(
        'BondToken',
        `Token (ABT) used to bond the data worker for proposing Relayer refund bundles. It also used as a required bond to dispute a bundle proposal. Currently, the bond amount is set to ${bondAmount} ABT.`,
      ),
      discovery.getContractDetails('LpTokenFactory',
        'Factory to deploy new LP tokens for L1 tokens, used to represent a liquidity provider position in the HubPool.'
      ),
      discovery.getContractDetails('Finder',
        'Provides addresses of the live contracts implementing certain interfaces.'
      ),
      discovery.getContractDetails('GovernorV2',
        'Owner of the Optimistic Oracle. This contract is used to execute a proposed UMA governance action that has been approved by UMA token holders.'
      ),
      discovery.getContractDetails('VotingToken',
        'Token used to vote on UMA Optimistic Oracle governance proposals.'
      ),
      discovery.getContractDetails('Optimism_Adapter'),
      discovery.getContractDetails('Boba_Adapter'),
      discovery.getContractDetails('Arbitrum_Adapter'),
      discovery.getContractDetails('ZkSync_Adapter'),
      discovery.getContractDetails('Base_Adapter'),
      discovery.getContractDetails('Polygon_Adapter'),
      discovery.getContractDetails('Ethereum_Adapter'),
      discovery.getContractDetails('Ethereum_SpokePool',
        'Contract enabling depositors to transfer assets from Ethereum to L2s, and relayers to fulfill transfer from L2s to Ethereum. Deposit orders are fulfilled by off-chain relayers with the fillV3Relay() function. Relayers are later refunded with destination token out of this contract when the data worker submits a proof that the relayer correctly submitted a relay on this SpokePool.'
      ),
      {
        name: 'PolygonTokenBridger',
        address: EthereumAddress('0x48d990AbDA20afa1fD1da713AbC041B60a922c65'),
        description: 'Contract deployed on Ethereum and Polygon PoS to facilitate token transfers from Polygon to the HubPool.',
      },
      {
        name: 'AcrossConfigStore',
        address: EthereumAddress('0x3B03509645713718B78951126E0A6de6f10043f5'),
        description: 'Contract storing configurations such as token rate models and minimum transfer thresholds, meant for off-chain consumption.',
      },
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'HubPool Multisig',
      'Can invoke admin functions of HubPool contract, and by implication of other contracts.',
    ),
    {
      name: 'BondToken transfer proposers',
      accounts: discovery.getPermissionedAccounts('BondToken', 'proposers'),
      description: 'Allowed to propose BondToken transfers.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Across deep dive',
      url: 'https://li.fi/knowledge-hub/across-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
