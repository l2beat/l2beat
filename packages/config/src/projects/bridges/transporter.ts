import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('transporter')
const upgradeDelay = discovery.getContractValue<number>(
  'RBACTimelock',
  'getMinDelay',
)
const upgradeDelayString = formatSeconds(upgradeDelay)

export const transporter: Bridge = {
  type: 'bridge',
  id: ProjectId('transporter'),
  display: {
    name: 'Transporter',
    slug: 'transporter',
    category: 'Token Bridge',
    links: {
      websites: ['https://app.transporter.io/'],
      repositories: ['https://docs.chain.link/ccip/architecture'],
      documentation: ['https://docs.chain.link/ccip'],
      socialMedia: ['https://x.com/transporter_io'],
    },
    description: 'Transporter is a Token Bridge based on CCIP network.',
    detailedDescription:
      'Transporter is a hybrid bridge that can work either as a Token Bridge or Liquidity Network depending on the requirements of tokens.\
      It is using Chainlink CCIP standard for cross-chain communication, and it makes use of a secondary network of nodes, called Risk Management Network, responsible for validating the messages or halt the bridge.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Chainlink Oracle network is responsibile for validating cross-chain messages. For additional security it uses off-chain secondary validation network called Risk Management Network.\
        These validators are tasked with monitoring anomalous behavior and can halt the network if necessary.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: `Configuration changes and upgrades to CCIP are executed through the RBACTimelock smart contract. Upgrades to the source contracts can be proposed by Timelock Proposers and executed with a ${upgradeDelayString} delay. Pending timelock operations can be canceled by Timelock Cancellers.`,
      sentiment: 'warning',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description: RISK_VIEW.CANONICAL_OR_WRAPPED.description + ' ',
    },
  },
  technology: {
    destination: [
      'Ethereum',
      'Arbitrum',
      'Base',
      'Optimism',
      'Polygon',
      'Gnosis Chain',
      'Wemix',
      'BNB Chain',
      'Avalanche',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `Transporter is a Token Bridge based on CCIP network. CCIP network is an AMB (Arbitrary Message Bridge) allowing to pass arbitrary messages that are attested by ChainLink Oracles. 
        On each chain it has a singleton Router contract. For each route (”lane”) there is a triple of OnRamp, OffRamp and CommitStore contracts defined. OnRamp is used to send messages to a destination chain, 
        while OffRamp and CommitStore are used to receive messages. The CommitStore is used to store message routes from the Source chain, while OffRamp is used to execute incoming messages. 
        Both OnRamps and OffRamps use TokenPools to escrow tokens, one TokenPool per token. TokenPools - depending on token - may Lock/Release or Mint/Burn tokens. They may also use some custom setup, like e.g. for USDC where TokenPool is a wrapper for Circle’s CCTP bridge.`,
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracle Network',
      description: `Chainlink Oracle network is responsibile for validating cross-chain messages. For additional security it uses off-chain secondary validation network called Risk Management Network.
        Each pathway between a source and a destination blockchain contains two Oracle committees. One committee interacts with the CommitStore contract on the destination chain to store the Merkle root 
        of the finalized messages on the source blockchain. After the Risk Management Network verifies the merkle root and submits a voteToBless() transaction, the second oracle committee can execute the message on the destination chain.`,
      references: [
        {
          text: 'Risk Management Network',
          href: 'https://docs.chain.link/ccip/concepts#risk-management-network',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracle network fails to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracle network is compromised and Risk Management Network fails to halt ("curse") the bridge.',
          isCritical: true,
        },
      ],
    },
  },
  config: {
    // a long list of tokenPools (escrows) extracted from discovered.json with a custom script
    escrows: [
      {
        address: EthereumAddress('0xf0D19c04f04382048fC9ad157C529CeB2c7be823'),
        sinceTimestamp: new UnixTime(1695220139),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x50f6631B377be52E132DF35a2F05eA54fda882ac'),
        sinceTimestamp: new UnixTime(1699020323),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x57D3bb46aF4A9b210FAE046796013090D428475F'),
        sinceTimestamp: new UnixTime(1697125271),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xcd196D3905AfA0eCB4e0e62C2D7d6c52f9C73526'),
        sinceTimestamp: new UnixTime(1697125283),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2dd317E7e36544C5222818F228d607c209517470'),
        sinceTimestamp: new UnixTime(1697125247),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x123ed44f3B863a684437Ebf18F8a744c250Ee5cA'),
        sinceTimestamp: new UnixTime(1697125259),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x55562A08104837FF55E3A66c49A1419b6311c1E6'),
        sinceTimestamp: new UnixTime(1699020311),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA81f4AB595dE5C14759245DE5ce9899D380FeFda'),
        sinceTimestamp: new UnixTime(1702311971),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xc62c311FE64abf19CF33195e15c188Ca6d1AaD3e'),
        sinceTimestamp: new UnixTime(1709226287),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8BcD7e48Dd2104ed83eb1CE0c6E7610604AE9062'),
        sinceTimestamp: new UnixTime(1712847407),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xd1b3015ceFCAC84dB3EFCBB18FBdd50BA5aF49DE'),
        sinceTimestamp: new UnixTime(1714424555),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6dDF2F3f93688dfc9d37DF7078982cE8E6494DB2'),
        sinceTimestamp: new UnixTime(1714424579),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x1580C7d4754f5671626e42f0372D56104B092CFA'),
        sinceTimestamp: new UnixTime(1715365751),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xa17698199466E71bAFC31F226db341B7840701E7'),
        sinceTimestamp: new UnixTime(1715921567),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xBF7cb652A2d5ed3BFc3832Ef8Af33Ffb0cDc0982'),
        sinceTimestamp: new UnixTime(1715921579),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x057152DB365B47851B0A0bd431644b8eE21fE1b4'),
        sinceTimestamp: new UnixTime(1689193655),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x1e28DD4b559a7fF546b1e84691129508b2C9C3D3'),
        sinceTimestamp: new UnixTime(1707776735),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8291a8E8dCF429e2FA7d032bF3E583ee959F3B06'),
        sinceTimestamp: new UnixTime(1708626467),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x69c24c970B65e22Ac26864aF10b2295B7d78f93A'),
        sinceTimestamp: new UnixTime(1709740691),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x619ED9fE2E5CfD9FAE364E703b60eA776Bb5924E'),
        sinceTimestamp: new UnixTime(1711033415),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x0C291Ae31730901515e5C46406A6ba2d88c1f4aA'),
        sinceTimestamp: new UnixTime(1712847371),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xa008534BF96b61d9D33aD64aAD463bc6D300cd91'),
        sinceTimestamp: new UnixTime(1707776747),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xc43c01026128Aa758A65D12dB6a72CE4DD778dF2'),
        sinceTimestamp: new UnixTime(1707776759),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9797E886EDe987AEf6A62885dFD6CcA885D828E6'),
        sinceTimestamp: new UnixTime(1709226347),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6Ff6BF3BF8af2e419DDC7BF038aFa5EB92b6cD7e'),
        sinceTimestamp: new UnixTime(1711033439),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x44622f4604353E4815A4212d5a3dD137A1C7FF14'),
        sinceTimestamp: new UnixTime(1715365763),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x06f9817a91595E1B595F789Fb91529e8651da9B8'),
        sinceTimestamp: new UnixTime(1715365775),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x4C3aEe10334461F1f33c0A8843424de3F8fb7709'),
        sinceTimestamp: new UnixTime(1715921591),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x73aEB5ECA03Ad587B8Fdcc2B61f9fb4D2e3D90c1'),
        sinceTimestamp: new UnixTime(1706130359),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x21377fe476Fb8587CbAFd47155093597Fa4df45E'),
        sinceTimestamp: new UnixTime(1706053451),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xeaE89E53B8317CaB04165F5323285252D5669B73'),
        sinceTimestamp: new UnixTime(1707776771),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xdCa0A2341ed5438E06B9982243808A76B9ADD6d0'),
        sinceTimestamp: new UnixTime(1708626503),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x047204D42d93a6471F7c9Ec94292B4B00E8e0786'),
        sinceTimestamp: new UnixTime(1711574327),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xE2F0dad85D504aa046b9F704a426fD6C5493e366'),
        sinceTimestamp: new UnixTime(1711574303),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xa370CEcd451ecf15c2A01ec47762E967dF7574DA'),
        sinceTimestamp: new UnixTime(1711574291),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8272dbBA30f14900b22b4bfC8DB4E88B02bA413a'),
        sinceTimestamp: new UnixTime(1713203579),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xb854536206EB6C1013b1642b576196E5EF19D7BA'),
        sinceTimestamp: new UnixTime(1713203567),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6ce8b799002BbECc7df94c18BF150B3b0E4A28F4'),
        sinceTimestamp: new UnixTime(1713203591),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8300e89e82A840176eb250EcDA0A7dBDb4a6B12D'),
        sinceTimestamp: new UnixTime(1715921603),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x0DAFed8dAF42040dB2c6227ca2AEB14D9C8B2602'),
        sinceTimestamp: new UnixTime(1716485363),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4'),
        sinceTimestamp: new UnixTime(1689193631),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x1175E4CFd6a73A4c1F1f2c1400a08D88554FA62e'),
        sinceTimestamp: new UnixTime(1709740655),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x78196436aF11b948c7036424B1ceA711fAdAd288'),
        sinceTimestamp: new UnixTime(1709740607),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA82A87a9b6550e89dd8a7C8a1E3e421974eaf858'),
        sinceTimestamp: new UnixTime(1712847419),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2764910B500689BbC9DB16c7AD61c6DD32FDE73B'),
        sinceTimestamp: new UnixTime(1715365739),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  contracts: {
    // this is not a full list of contracts - there would be too many.
    addresses: [
      discovery.getContractDetails(
        'Router',
        `Central contract in CCIP responsible for the configuration of OnRamp, OffRamp and Commit Stores for different chains.
        This is an example Router contract for one of the lanes. There are many more lanes in the system, please check the specific smart contract for the lane you are interested in.`,
      ),
      discovery.getContractDetails(
        'OnRamp1',
        `OnRamp for outgoing messages to Arbitrum.
        This is an example OnRamp contract for one of the lanes. There are many more lanes in the system, please check the specific smart contract for the lane you are interested in.`,
      ),
      discovery.getContractDetails(
        'OffRamp1',
        `OffRamp for incoming messages from Arbitrum.
        This is an example OffRamp contract for one of the lanes. There are many more lanes in the system, please check the specific smart contract for the lane you are interested in.`,
      ),
      discovery.getContractDetails(
        'CommitStore1',
        `CommitStore for storing incoming message roots from Arbitrum.
        This is an example CommitStore contract for one of the lanes. There are many more lanes in the system, please check the specific smart contract for the lane you are interested in.`,
      ),
      discovery.getContractDetails(
        'RBACTimelock',
        (() => {
          return `CCIP contract upgrades have to go through a ${upgradeDelayString} timelock.`
        })(),
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelayString)],
  },
  permissions: [
    {
      name: 'RBACTimelock',
      description: (() => {
        return `Role-based Access Control Timelock (RBACTimelock) smart contract. Onchain security-critical configuration changes and upgrades to the CCIP must pass through this contract. CCIP contract upgrades have to go through a ${upgradeDelayString} timelock.`
      })(),
      accounts: [discovery.getPermissionedAccount('Router', 'owner')],
    },
    {
      name: 'Timelock Admins',
      accounts: (() => {
        const timelockRoles = discovery.getAccessControlField(
          'RBACTimelock',
          'ADMIN_ROLE',
        ).members
        const members = timelockRoles.map((member) =>
          discovery.formatPermissionedAccount(member),
        )
        return members
      })(),
      description:
        'Admins of the RBACTimelock contract. Can modify all other roles.',
    },
    {
      name: 'Timelock Proposers',
      accounts: (() => {
        const timelockRoles = discovery.getAccessControlField(
          'RBACTimelock',
          'PROPOSER_ROLE',
        ).members
        const members = timelockRoles.map((member) =>
          discovery.formatPermissionedAccount(member),
        )
        return members
      })(),
      description:
        'Proposers of the RBACTimelock contract. Can propose upgrades.',
    },
    {
      name: 'Timelock Cancellers',
      accounts: (() => {
        const timelockRoles = discovery.getAccessControlField(
          'RBACTimelock',
          'CANCELLER_ROLE',
        ).members
        const members = timelockRoles.map((member) =>
          discovery.formatPermissionedAccount(member),
        )
        return members
      })(),
      description:
        'Cancellers of the RBACTimelock contract. Can cancel pending upgrades.',
    },
    {
      name: 'Timelock Executors',
      accounts: (() => {
        const timelockRoles = discovery.getAccessControlField(
          'RBACTimelock',
          'EXECUTOR_ROLE',
        ).members
        const members = timelockRoles.map((member) =>
          discovery.formatPermissionedAccount(member),
        )
        return members
      })(),
      description:
        'Contract through which RBACTimelock proposals are executed. Proposals execution can be initiated by anyone.',
    },
  ],
  knowledgeNuggets: [],
}
