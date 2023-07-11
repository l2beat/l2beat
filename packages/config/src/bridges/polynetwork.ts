import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('polynetwork')

const isPaused = discovery.getContractValue<boolean>(
  'EthCrossChainManager',
  'paused',
)
const warningText = isPaused
  ? 'The bridge is currently paused due to an attack occurred on July 2nd, resulting from stolen or misused private keys. For more information, read the postmortem here: https://dedaub.com/blog/poly-chain-hack-postmortem'
  : ''

export const polynetwork: Bridge = {
  type: 'bridge',
  id: ProjectId('polynetwork'),
  display: {
    name: 'Poly Bridge',
    slug: 'polynetwork',
    warning: warningText,
    links: {
      websites: ['https://bridge.poly.network/', 'https://poly.network/'],
      apps: ['https://bridge.poly.network/'],
      socialMedia: [
        'https://twitter.com/PolyNetwork2',
        'https://polynetwork.medium.com/',
        'https://youtube.com/channel/UC4vFRyVgvK7RnlkkLDmp23w',
        'https://discord.gg/y6MuEnq',
      ],
      repositories: ['https://github.com/polynetwork'],
      documentation: [
        'https://dev-docs.poly.network/',
        'https://github.com/polynetwork/docs',
        'https://github.com/polynetwork/docs/blob/master/eth/README.md',
      ],
    },
    description:
      'Poly Bridge allows users to transfer assets between different blockchains using Lock-Mint swap. It uses a PolyNetwork chain to verify and coordinate message passing between Relayers on supported chains. Each chain has a set of Relayers, while PolyNetwork chain has a set of Keepers that sign cross-chain messages. Chains integrated with Poly Bridge need to support light client verification, since validation of cross-chain messages includes verifying block headers and transactions via Merkle proofs. Some of the smart contracts used by the bridge infrastructure are not verified on Etherscan.',
    category: 'Token Bridge',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      // Fetch current Keeper's count and public keys via
      // $ cast call 0xcF2afe102057bA5c16f899271045a0A37fCb10f2 "getCurEpochConPubKeyBytes()"
      // Parse result via:
      // $ cast --calldata-decode "deserializeKeepers(bytes)" 0x0ddf7259<OUTPUT WITHOUT 0x>
      // First 8 bytes is the number of keepers (int).
      // The formula for number of signatures is taken from EthCrossChainManager contract:
      // EthCrossChainManager.sol#1467
      // n - (n - 1) / 3 (n = keepers count)
      description: '3/4 MultiSig of PolyNetwork Keepers',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts can be upgraded',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.WRAPPED,
      description: RISK_VIEW.WRAPPED.description,
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x250e76987d838a75310c34bf422ea9f1AC4Cc906'),
        sinceTimestamp: new UnixTime(1599099893),
        tokens: '*',
      },
      {
        // This new Escrow address has been added on 20 Oct 2022.
        address: EthereumAddress('0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868'),
        sinceTimestamp: new UnixTime(1666256303),
        tokens: ['ETH'],
      },
    ],
  },
  technology: {
    destination: ['Various'], // Careful, on UI, the destination options change based on selected asset
    // e.g. ETH supports only some niche chains, while FEI supports e.g. BNB.
    canonical: false,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Poly Bridge operation is centered around PolyNetwork chain that acts as a type of a light client for all supported chains. Each supported chain has a set or Relayers that transmit successive block headers to the PolyNetwork chain, as well as lock or burn events. Those events, after passing verification on PolyNetwork chain, are relayed to the destination chain by Relayers that are responsible for the destination chain. Relayers on the destination chain pass messages to appropriate contracts that mint or release corresponding tokens to the user after verifying validity of the message.',
      references: [
        {
          text: 'PolyNetwork docs from source code',
          href: 'https://github.com/polynetwork/docs',
        },
        {
          text: 'Ethereum-related PolyNetwork docs from source code',
          href: 'https://github.com/polynetwork/docs/blob/master/eth/README.md',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'contract Owner pauses one of the bridge contracts.',
        },
      ],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation of cross-chain transactions',
      description:
        'Each supported chain has a set of Relayers that are responsible for sending successive block headers since pre-specified origin to the PolyNetwork chain, which stores these blocks after validating their aspects, such as structure, difficulty, consistency with previous blocks, etc. When user locks or burns an asset for a cross-chain swap, an event is relayed by Relayer to the PolyNetwork chain with a Merkle proof of that transaction being included in a block. The PolyNetwork chain is able to verify Merkle proof using block headers that it keeps. PolyNetwork chain itself uses a set of Keepers to sign transactions after checking their validity. Once a cross-chain transaction is verified on PolyNetwork, an event is emitted that is picked by Relayers on the destination chain. The block header and Merkle proof for a transaction on a source chain is validated by a contract on the destination chain (if it supports such verification) and the asset is minted or released to the recipient.',
      references: [
        {
          text: 'Header verification source code',
          href: 'https://github.com/polynetwork/poly/blob/master/native/service/header_sync/eth/header_sync.go#L99',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'chain Relayers decide to not pass certain transactions to the destination chain.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'a fake block header is relayed through the PolyNetwork chain that allows to prove a burn/mint transaction that never occurred on the source chain.',
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: "chain Relayers don't relay messages.",
        },
        {
          category: 'Funds can be frozen if',
          text: "the PolyNetwork Keepers don't sign messages.",
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'PolyWrapper',
        'Entrypoint contract for the bridge. It proxies requests to LockProxy.',
      ),
      discovery.getContractDetails(
        'Lock Proxy 1',
        'Escrow and proxy contract for the Bridge.',
      ),
      discovery.getContractDetails(
        'Lock Proxy 2',
        'Escrow and proxy contract for the Bridge.',
      ),
      discovery.getContractDetails(
        'Lock Proxy 3',
        'Escrow and proxy contract for the Bridge.',
      ),
      discovery.getContractDetails(
        'Lock Proxy 4',
        'Escrow and proxy contract for the Bridge.',
      ),
      discovery.getContractDetails(
        'Lock Proxy 5',
        'Escrow and proxy contract for the Bridge.',
      ),
      discovery.getContractDetails('EthCrossChainManager', {
        description:
          'Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.',
        pausable: {
          paused: discovery.getContractValue('EthCrossChainManager', 'paused'),
          pausableBy: ['EthCrossChainManager'],
        },
      }),
      discovery.getContractDetails(
        'EthCrossChainData',
        "Used to store Keepers' signatures and other parameters used by EthCrossChainManager.",
      ),
      discovery.getContractDetails('EthCrossChainManagerProxy', {
        description:
          'Used to proxy requests from LockProxy to EthCrossChainManager.',
        pausable: {
          paused: discovery.getContractValue(
            'EthCrossChainManagerProxy',
            'paused',
          ),
          pausableBy: ['EthCrossChainManager'],
        },
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [discovery.getPermissionedAccount('PolyWrapper', 'owner')],
      name: 'Owner and Fee Collector at PolyWrapper and owner at LockProxyWithLP',
      description:
        'Can add new bridge contracts (Escrows, LockProxy), pause the bridge, and transfer to itself all funds and ERC20 tokens of the PolyWrapper contract.',
    },
    {
      accounts: [
        discovery.getPermissionedAccount('EthCrossChainManager', 'owner'),
      ],
      name: 'Owner of EthCrossChainManager',
      description:
        'Can pause the contracts and update implementation of EthCrossChainData contract.',
    },
    {
      accounts: [
        discovery.getPermissionedAccount('Lock Proxy 1', 'owner'),
        discovery.getPermissionedAccount('Lock Proxy 2', 'owner'),
        discovery.getPermissionedAccount('Lock Proxy 3', 'owner'),
        discovery.getPermissionedAccount('Lock Proxy 4', 'owner'),
        discovery.getPermissionedAccount('Lock Proxy 5', 'owner'),
      ],
      name: 'Lock Proxy owners',
      description: 'Can update address of EthCrossChainManagerProxy contract.',
    },
  ],
  milestones: [
    {
      name: 'Contracts hacked for $611M',
      date: '2021-08-10T00:00:00.00Z',
      link: 'https://en.wikipedia.org/wiki/Poly_Network_exploit',
    },
    {
      name: 'Compromised multisig steals funds',
      date: '2023-07-03T00:00:00.00Z',
      link: 'https://rekt.news/poly-network-rekt2/',
    },
  ],
}
