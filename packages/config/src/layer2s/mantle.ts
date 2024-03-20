import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantle')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const regularUpgrades = {
  upgradableBy: ['OwnerMultisig'],
  upgradeDelay: 'No delay',
}

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const threshold =
  discovery.getContractValue<number>(
    'DataLayrServiceManager',
    'quorumThresholdBasisPoints',
  ) / 1000 // Quorum threshold is in basis points, but stake is equal for all members (100k MNT)

export const mantle: Layer2 = opStack({
  daProvider: {
    name: 'MantleDA',
    bridge: {
      type: 'Staked Operators',
      requiredSignatures: threshold,
      membersCount: committeeMembers,
    },
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. MantleDA contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions. DA fraud proof mechanism is not live yet.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. The sequencer posts the transactions data batch root, and then propagates the data to off-chain permissioned nodes to sign. It subsequently posts the nodes signatures on chain to verify they belong to the specified members of the quorum, and that the minimum stake threshold is met.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'DataLayrServiceManager.sol#L389 - Etherscan source code, confirmDataStore function',
          href: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L389',
        },
        {
          text: 'DataLayrServiceManager.sol#L404 - Etherscan source code, signature verification check ',
          href: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L404',
        },
      ],
    },
  },
  discovery,
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is an under development EVM compatible Optimium, based on the OP Stack.',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/', 'https://mantlescan.info'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012',
  ),
  genesisTimestamp: new UnixTime(1687954103),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplateContracts: [
    discovery.getContractDetails('DataLayrServiceManager', {
      description:
        'This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.',
    }),
    discovery.getContractDetails('BLSRegistry', {
      description:
        'This contract strores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.',
    }),
    discovery.getContractDetails('InvestmentManager', {
      description:
        'Contract managing different investment strategies, forked from EigenLayer StrategyManager.',
    }),
    discovery.getContractDetails('MantleFirstStrat', {
      description: 'Basic do-nothing investment strategy.',
    }),
    discovery.getContractDetails('MantleSecondStrat', {
      description: 'Basic do-nothing investment strategy.',
    }),
    discovery.getContractDetails('AddressManager', {
      description:
        'This is a library that stores the mappings between names and their addresses. Changing the values effectively upgrades the system. It is controlled by the OwnerMultisig.',
      ...regularUpgrades,
    }),
    discovery.getContractDetails('PubkeyCompendium'),
    discovery.getContractDetails('RegistryPermission'),
    discovery.getContractDetails('Delegation'),
    discovery.getContractDetails('PauserRegistry'),
    discovery.getContractDetails('PauserRegistry2'),
    discovery.getContractDetails('L1MantleToken', {
      description:
        'Mantle uses Mantle (MNT) as the designated gas token, allowing users to utilize MNT to pay for blockspace.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'This address can upgrade the following contracts: L1CrossDomainMessenger, L1StandardBridge, AddressManager, L1MantleToken, EigenDataLayerChain, SystemConfig.',
    ),
    ...discovery.getMultisigPermission(
      'Owner2Multisig',
      'This address is the owner of the following contracts: EigenDataLayerChain, DataLayrServiceManager, BLSRegistry, Delegation. It is also designated as a Challenger and Guardian of the OptimismPortal, meaning it can halt withdrawals and change incorrect state roots.',
    ),
  ],
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
    },
    {
      name: 'Mainnet v2 Tectonic Upgrade',
      link: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
    },
  ],
  knowledgeNuggets: [],
  nonTemplateEscrows: [],
  nonTemplateOptimismPortalEscrowTokens: ['MNT'],
})
