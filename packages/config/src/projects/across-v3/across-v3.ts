import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('across-v3')

const finalizationDelay = formatSeconds(
  discovery.getContractValue<number>('HubPool', 'liveness'),
)
const hubPoolBondAmt = discovery.getContractValue<number>(
  'HubPool',
  'bondAmountFmt',
)
const umaDelay = discovery.getContractValue<string>('VotingV2', 'delayFmt')

export const acrossV3: Bridge = {
  type: 'bridge',
  id: ProjectId('across-v3'),
  addedAt: UnixTime(1712746402), // 2024-04-10T10:53:22Z
  display: {
    name: 'Across',
    slug: 'across',
    category: 'Liquidity Network',
    links: {
      websites: ['https://across.to/'],
      bridges: ['https://app.across.to/bridge'],
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
      'Across is a multichain optimistic bridge that uses actors called Relayers to fulfill user transfer requests (intents) on the destination chain.',
    detailedDescription:
      'Relayers are later reimbursed by providing an assertion to an optimistic oracle (HubPool) on Ethereum. Relayer reimbursements over a specific block range are bundled and posted on Ethereum as merkle roots which uniquely identify the set of all repayments and rebalance instructions. The architecture leverages a single liquidity pool on Ethereum and separate deposit/reimburse pools on destination chains that are rebalanced using mainly canonical bridges.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda',
        ),
        sinceTimestamp: UnixTime(1653124620),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5',
        ),
        sinceTimestamp: UnixTime(1682355155),
        tokens: '*',
      }),
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: EthereumAddress('0x4D9079Bb4165aeb4084c526a32695dCfd2F77381'),
        sinceTimestamp: UnixTime(1653167083),
        tokens: '*',
        isHistorical: true,
        chain: 'ethereum',
      },
      // multichain bridges from https://docs.across.to/reference/contract-addresses/
      {
        address: EthereumAddress('0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A'),
        sinceTimestamp: UnixTime(1682355537),
        tokens: '*',
        chain: 'arbitrum',
      },
      {
        address: EthereumAddress('0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'),
        sinceTimestamp: UnixTime(1691119103),
        tokens: '*',
        chain: 'base',
      },
      {
        address: EthereumAddress('0x2D509190Ed0172ba588407D4c2df918F955Cc6E1'),
        sinceTimestamp: UnixTime(1719958375),
        tokens: '*',
        chain: 'blast',
      },
      {
        address: EthereumAddress('0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75'),
        sinceTimestamp: UnixTime(1709742598),
        tokens: '*',
        chain: 'linea',
      },
      // lisk is not conf'd yet
      // {
      //   address: EthereumAddress('0x9552a0a6624A23B848060AE5901659CDDa1f83f8'),
      //   sinceTimestamp: UnixTime(1719933465),
      //   tokens: '*',
      //   chain: 'lisk',
      // },
      {
        address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
        sinceTimestamp: UnixTime(1716253957),
        tokens: '*',
        chain: 'mode',
      },
      {
        address: EthereumAddress('0x6f26Bf09B1C792e3228e5467807a900A503c0281'),
        sinceTimestamp: UnixTime(1682354696),
        tokens: '*',
        chain: 'optimism',
      },
      // no chainconf yet
      // {
      //   address: EthereumAddress('0x13fDac9F9b4777705db45291bbFF3c972c6d1d97'),
      //   sinceTimestamp: UnixTime(1723209335),
      //   tokens: '*',
      //   chain: 'redstone',
      // },
      {
        address: EthereumAddress('0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96'),
        sinceTimestamp: UnixTime(1721124038),
        tokens: '*',
        chain: 'scroll',
      },
      {
        address: EthereumAddress('0xE0B015E54d54fc84a6cB9B666099c46adE9335FF'),
        sinceTimestamp: UnixTime(1691141266),
        tokens: '*',
        chain: 'zksync2',
      },
      // no chainconf yet
      // {
      //   address: EthereumAddress('0x13fDac9F9b4777705db45291bbFF3c972c6d1d97'),
      //   sinceTimestamp: UnixTime(1723459573),
      //   tokens: '*',
      //   chain: 'zora',
      // },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description: `Optimistic Oracle on Ethereum is used to assert that an action happened on the destination chain. The timeout for disputes is ${finalizationDelay}. A dispute escalates to the UMA DVM.`,
      sentiment: 'warning',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
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
      description: `This bridge performs cross-chain swaps by borrowing liquidity from a network of Relayers who are later reimbursed from a common liquidity pool (which consists of user deposits and deposits of independent Liquidity Providers).

Specifically, when a user deposits funds into a dedicated pool on the origin chain, a Relayer pays the user on the requested destination chain (fills their intent). On most SpokePools, relayers can also specify a preference for their chain of reimbursement at fill time. A permissioned proposer (or data worker) collects data about fills by relayers and then posts an assertion to the HubPool on Ethereum. This is called a 'root bundle', which contains 3 merkle roots, chiefly a merkle root of all proposed Relayer reimbursements.

A root bundle proposal must be accompanied by a bond of ${hubPoolBondAmt} ABT (an ETH wrapper). It is validated optimistically in the HubPool contract and becomes executable after ${finalizationDelay} (refunding the bond to the proposer) if not challenged. A challenge by anyone posting the same bond amount halts finalization of the root bundle and escalates the dispute to the UMA DVM.

UMA settles disputes by UMA token voting, with a commit- and reveal phase of ${umaDelay} each. A settlement slashes the stake of the losing party and rewards the winning party with both bond amounts minus fees.

On finalization, a rootBundle can be 1) relayed to remote SpokePools and 2) executed. Execution of a relayerRefundLeaf (via a merkle proof) at its specified SpokePool contract refunds the relayer.

Relaying a rootBundle to a SpokePool is either done via canonical bridges or via a zk light client that is proven in the SP1Helios contract (based on the SP1 zkVM and the Helios Ethereum light client).

The permissioned proposer of the root bundle can also propose rebalancing liquidity used for reimbursements between a main pool on Ethereum (called Hub Pool) and pools on destination chains (called Spoke Pools). This is done via canonical chain bridges and other bridges (e.g. Circle CCTP) using adapters. For some chains, liquidity is not rebalanced and relayers are always reimbursed where the user deposited their funds.`,
      references: [
        {
          title: 'Across V4 Architecture',
          url: 'https://docs.across.to/exclusive/what-is-across-v4#across-protocol-v4-architecture',
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
          text: 'third-party bridge infrastructure is compromised, such as canonical messaging services, SP1Helios verifier, and USDC Cross-Chain Transfer Protocol (CCTP) infrastructure.',
        },
      ],
    },
    validation: {
      name: 'Validation via Optimistic Oracle and UMA DVM',
      description: `Money from the liquidity pool is used to reimburse Relayers based on a claim of deposit on a destination chain that is provided to an Optimistic Oracle on Ethereum (can be escalated to the UMA DVM). The assertion can be disputed for ${finalizationDelay}.`,
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
          title: 'Across Optimistic Oracle documentation',
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
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'a Spoke Pool contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Across v4',
      date: '2025-07-02T00:00:00.00Z',
      url: 'https://docs.across.to/exclusive/what-is-across-v4',
      description:
        'Features a new path to relay root bundles to destination chains using zk proofs (uses SP1Helios).',
      type: 'general',
    },
  ],
}
