import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('transporter')
const upgradeDelay = discovery.getContractValue<number>(
  'RBACTimelock',
  'getMinDelay',
)
const upgradeDelayString = formatSeconds(upgradeDelay)

const onRamps = Object.values(
  discovery.getContractValue<Record<string, string>>('Router', 'onRamps'),
)
const allTokenPools = onRamps.flatMap((onRamp) =>
  discovery.getContractValue<string[]>(onRamp, 'tokenPools'),
)
const tokenPools = [...new Set(allTokenPools)]

export const transporter: Bridge = {
  type: 'bridge',
  id: ProjectId('transporter'),
  createdAt: new UnixTime(1718781548), // 2024-06-19T07:19:08Z
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
    description:
      'Transporter is a Token Bridge based on Chainlink’s Cross-Chain Interoperability Protocol (CCIP) network.',
    detailedDescription:
      'Transporter is a hybrid bridge that can work either as a Token Bridge or Liquidity Network depending on the requirements of tokens.\
      It is using Chainlink CCIP standard for cross-chain communication, and it makes use of a secondary network of nodes, called Risk Management Network, responsible for validating the messages or halt the bridge.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Chainlink Oracle network is responsible for validating cross-chain messages. For additional security it uses off-chain secondary validation network called Risk Management Network.\
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
      description: `Transporter is a Token Bridge based on the CCIP network. The CCIP network is an AMB (Arbitrary Message Bridge) that enables the cross-chain transfer of arbitrary messages that are attested by ChainLink Oracles as well as a separate Risk Management Network. 
        On each chain it has a singleton Router contract. For each route (”lane”) there is a triplet of OnRamp, OffRamp and CommitStore contracts defined. OnRamp is used to send messages to a destination chain, 
        while OffRamp and CommitStore are used to receive messages. The CommitStore is used to store Merkle roots of CCIP messages sent from the Source chain, while OffRamp is used to verify and execute incoming messages. 
        Both OnRamps and OffRamps use TokenPools to escrow tokens, one TokenPool per token. TokenPools - depending on token - may Lock/Release or Mint/Burn tokens. They may also use some custom setup, like e.g. for USDC where TokenPool is a wrapper for Circle’s CCTP bridge.`,
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracle Network',
      description: `Chainlink Oracle network is responsibile for validating cross-chain messages. For additional security, CCIP uses an off-chain secondary validation network called Risk Management Network.
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
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracle network is compromised and Risk Management Network fails to halt ("curse") the bridge. Both networks would need to be separately compromised.',
        },
      ],
    },
  },
  config: {
    escrows: tokenPools.map((tokenPool) =>
      discovery.getEscrowDetails({
        address: EthereumAddress(tokenPool),
        tokens: '*',
      }),
    ),
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
        'ARMProxy',
        'The contract that manages the Risk Management Network, allowing blessing (validation) of messages and cursing (halting) the chain.',
      ),
      discovery.getContractDetails(
        'RBACTimelock',
        (() => {
          return `CCIP contract upgrades have to go through a ${upgradeDelayString} timelock.`
        })(),
      ),
    ],
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `a contract receives a malicious code upgrade. There is a ${upgradeDelayString} delay on code upgrades, during which designated Cancellers can veto the upgrade.`,
      },
    ],
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
