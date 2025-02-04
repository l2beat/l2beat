import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const PROJECT_ID = ProjectId('across-v3')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

const finalizationDelay = formatSeconds(
  discovery.getContractValue<number>('HubPool', 'liveness'),
)

const bondAmount = utils.formatEther(
  discovery.getContractValue<number>('HubPool', 'bondAmount'),
)
const bondSymbol = discovery.getContractValue<string>('BondToken', 'symbol')

export const acrossV3: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  addedAt: new UnixTime(1712746402), // 2024-04-10T10:53:22Z
  display: {
    name: 'Across V3',
    slug: 'acrossv3',
    category: 'Liquidity Network',
    links: {
      websites: ['https://across.to/'],
      apps: ['https://app.across.to/bridge'],
      repositories: ['https://github.com/across-protocol/contracts-v2'],
      documentation: ['https://docs.across.to/'],
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
      'Relayers are later reimbursed by providing a proof of their action to an Optimistic Oracle on Ethereum. Relayer reimbursements over a specific block range are bundled and posted onchain as merkle roots which uniquely identify the set of all repayments and rebalance instructions. The architecture leverages a single liquidity pool on Ethereum and separate deposit/reimburse pools on destination chains that are rebalanced using canonical bridges.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda'),
        sinceTimestamp: new UnixTime(1653124620),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5'),
        sinceTimestamp: new UnixTime(1682355155),
        tokens: '*',
      }),
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: EthereumAddress('0x4D9079Bb4165aeb4084c526a32695dCfd2F77381'),
        sinceTimestamp: new UnixTime(1653167083),
        tokens: '*',
        isHistorical: true,
        chain: 'ethereum',
      },
      // multichain bridges from https://docs.across.to/reference/contract-addresses/
      {
        address: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
        sinceTimestamp: new UnixTime(1682355537),
        tokens: '*',
        chain: 'arbitrum',
      },
      {
        address: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
        sinceTimestamp: new UnixTime(1691119103),
        tokens: '*',
        chain: 'base',
      },
      {
        address: EthereumAddress('0x2D509190Ed0172ba588407D4c2df918F955Cc6E1'),
        sinceTimestamp: new UnixTime(1719958375),
        tokens: '*',
        chain: 'blast',
      },
      {
        address: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
        sinceTimestamp: new UnixTime(1709742598),
        tokens: '*',
        chain: 'linea',
      },
      // lisk is not conf'd yet
      // {
      //   address: EthereumAddress('0x9552a0a6624A23B848060AE5901659CDDa1f83f8'),
      //   sinceTimestamp: new UnixTime(1719933465),
      //   tokens: '*',
      //   chain: 'lisk',
      // },
      {
        address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
        sinceTimestamp: new UnixTime(1716253957),
        tokens: '*',
        chain: 'mode',
      },
      {
        address: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
        sinceTimestamp: new UnixTime(1682354696),
        tokens: '*',
        chain: 'optimism',
      },
      // no chainconf yet
      // {
      //   address: EthereumAddress('0x13fDac9F9b4777705db45291bbFF3c972c6d1d97'),
      //   sinceTimestamp: new UnixTime(1723209335),
      //   tokens: '*',
      //   chain: 'redstone',
      // },
      {
        address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
        sinceTimestamp: new UnixTime(1721124038),
        tokens: '*',
        chain: 'scroll',
      },
      {
        address: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
        sinceTimestamp: new UnixTime(1691141266),
        tokens: '*',
        chain: 'zksync2',
      },
      // no chainconf yet
      // {
      //   address: EthereumAddress('0x13fDac9F9b4777705db45291bbFF3c972c6d1d97'),
      //   sinceTimestamp: new UnixTime(1723459573),
      //   tokens: '*',
      //   chain: 'zora',
      // },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description: `Optimistic Oracle on Ethereum is used to assert that an action happened on the destination chain. The timeout used here is ${finalizationDelay}.`,
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: [
      'Optimism',
      'Polygon',
      'Boba',
      'Arbitrum',
      'ZkSync Era',
      'Linea',
      'Base',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `This bridge performs cross-chain swaps by borrowing liquidity from a network of Relayers who are then reimbursed on a chain of their choosing from a common liquidity pool (which consists of user deposits and deposits of independent Liquidity Providers). 
        Specifically, when a user deposits funds for a swap into a dedicated pool on the origin chain, a Relayer first pays the user on the requested destination chain and then shows proof of that deposit to Optimistic Oracle on Ethereum (by proposing a merkle root). 
        If the root remains unchallenged for ${finalizationDelay}, it is optimistically finalized and the Relayer is reimbursed. Liquidity used for reimbursements is rebalanced between a main pool on Ethereum (called Hub Pool) and pools on destination chains (called Spoke Pools) via canonical chain bridges.`,
      references: [
        {
          title: 'Across V3 Architecture',
          url: 'https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-179.md',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'owner pauses the Hub Pool contract, or changes bond, routes, or fees parameters in such a way as to make the escrow inoperable.',
        },
        {
          category: 'Funds can be lost if',
          text: 'owner invokes a "haircut" functionality, dedicated for irrecoverable loss of funds on L2. Calling the haircutReserves() function, the owner can decrease the token utilizedReserves on L1, decreasing the amount of funds in the bridge expected to flow from L2 to L1.',
        },
        {
          category: 'Funds can be lost if',
          text: 'third-party bridge infrastructure is compromised, such as canonical messaging services, Linea USDC bridge, and USDC Cross-Chain Transfer Protocol (CCTP) infrastructure.',
        },
      ],
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
          text: 'a re-org occurs on destination chain after the Optimistic Oracle dispute time passes.',
        },
      ],
      references: [
        {
          title: 'Across V3 Optimistic Oracle documentation',
          url: 'https://docs.across.to/reference/security-model-and-verification',
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
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'HubPool',
          `Escrow contract for ERC20 tokens and administration of other contracts. There is a ${finalizationDelay} delay before a bundle proposal is considered finalized.`,
        ),
        discovery.getContractDetails(
          'BondToken',
          `Token (${bondSymbol}) used to bond the data worker for proposing Relayer refund bundles. It also used as a required bond to dispute a bundle proposal. Currently, the bond amount is set to ${bondAmount} ${bondSymbol}.`,
        ),
        discovery.getContractDetails(
          'UMAOptimisticOracle',
          'UMA Optimistic Oracle smart contract. It registers dispute requests, status of disputes, and dispute settlement.',
        ),
        discovery.getContractDetails(
          'GovernorV2',
          'Owner of the Optimistic Oracle. This contract is used to execute a proposed UMA governance action that has been approved by UMA token holders.',
        ),
        discovery.getContractDetails(
          'VotingToken',
          'Token used to vote on UMA Optimistic Oracle governance proposals.',
        ),
        discovery.getContractDetails(
          'LpTokenFactory',
          'Factory to deploy new LP tokens for L1 tokens, used to represent a liquidity provider position in the HubPool.',
        ),
        discovery.getContractDetails(
          'Finder',
          'Provides addresses of the live contracts implementing certain interfaces, such as the whitelist interface for setting the Bond Token.',
        ),
        discovery.getContractDetails('Arbitrum_Adapter'),
        discovery.getContractDetails('Base_Adapter'),
        discovery.getContractDetails('Boba_Adapter'),
        discovery.getContractDetails('Ethereum_Adapter'),
        discovery.getContractDetails('Linea_Adapter'),
        discovery.getContractDetails('Optimism_Adapter'),
        discovery.getContractDetails('Polygon_Adapter'),
        discovery.getContractDetails('ZkSync_Adapter'),
        discovery.getContractDetails('Lisk_Adapter'),
        discovery.getContractDetails('Scroll_Adapter'),
        discovery.getContractDetails('Redstone_Adapter'),
        discovery.getContractDetails('Zora_Adapter'),
        discovery.getContractDetails('WorldChain_Adapter'),
        discovery.getContractDetails('Alephzero_Adapter'),
        discovery.getContractDetails('Ink_Adapter'),
        discovery.getContractDetails('Soneium_Adapter'),
        discovery.getContractDetails(
          'Ethereum_SpokePool',
          'Contract enabling depositors to transfer assets from Ethereum to L2s, and relayers to fulfill transfer from L2s to Ethereum. Deposit orders are fulfilled by off-chain relayers with the fillV3Relay() function. Relayers are later refunded with destination token out of this contract when the data worker submits a proof that the relayer correctly submitted a relay on this SpokePool.',
        ),
        discovery.getContractDetails(
          'PolygonTokenBridger',
          'Contract deployed on Ethereum and Polygon PoS to facilitate token transfers from Polygon to the HubPool.',
        ),
        discovery.getContractDetails(
          'AcrossConfigStore',
          'Contract storing configurations such as token rate models and minimum transfer thresholds, meant for off-chain consumption.',
        ),
      ],
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'a Spoke Pool contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'HubPool Multisig',
          'Can invoke admin functions of HubPool contract, and by implication of other contracts.',
        ),
        discovery.getPermissionDetails(
          'BondToken transfer proposers',
          discovery.getPermissionedAccounts('BondToken', 'proposers'),
          'Allowed to propose BondToken transfers.',
        ),
      ],
    },
  },
  knowledgeNuggets: [
    {
      title: 'Across deep dive',
      url: 'https://li.fi/knowledge-hub/across-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
