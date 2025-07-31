import {
  assert,
  EthereumAddress,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import { EXITS, SOA } from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('kinto')

const l2critDelay = 12 * 24 * 60 * 60 // 1) force tx: 0d 2) be sanctioned: 1d 3) sanction expiry/cooldown, force tx: 4d 4) execute forced tx: 5d 5) exit window left: 7d

const contractKeys = [
  'edKintoMultisig2ADMIN',
  'tadKintoAppRegistry',
  'tadKintoID',
  'tadKintoWalletFactory',
]
assert(
  contractKeys.every(
    (key) =>
      l2critDelay === discovery.getContractValue<number>('AccessManager', key),
  ),
  '12d delay in Accessmanager changed, edit gov section',
)
assert(
  l2critDelay ===
    discovery.getContractValue<number>('Kinto Multisig 2', 'RECOVERY_TIME'),
  'recovery time in the KintoWallet is not 12d, malicious recoveries do not provide a 7d exit window.',
)
assert(
  l2critDelay ===
    discovery.getContractValue<number>('KintoID', 'EXIT_WINDOW_PERIOD'),
  'exit window period in the KintoID is not 12d, malicious sanctions do not provide a 7d exit window.',
)

const sanctionExpirySeconds = discovery.getContractValue<number>(
  'KintoID',
  'SANCTION_EXPIRY_PERIOD',
)

// Validators: https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/kinto-validators
// SC: https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/security-council

export const kinto: ScalingProject = orbitStackL2({
  capability: 'appchain',
  addedAt: UnixTime(1716336000), // 2024-05-22T00:00:00Z
  discovery,
  additionalBadges: [BADGES.RaaS.Caldera, BADGES.VM.AppChain],
  overridingPurposes: ['KYC-ed DeFi'],
  display: {
    name: 'Kinto',
    slug: 'kinto',
    architectureImage: 'kinto',
    description:
      'Kinto is an Orbit stack L2 with account abstraction and KYC enabled for all users, supporting both modern financial institutions and decentralized protocols.',
    links: {
      websites: ['https://kinto.xyz'],
      bridges: ['https://engen.kinto.xyz'],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://explorer.kinto.xyz/', 'https://kintoscan.io/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.com/invite/kinto',
        'https://mirror.xyz/kintoxyz.eth',
        'https://medium.com/mamori-finance',
      ],
    },
  },
  associatedTokens: ['K'],
  chainConfig: {
    name: 'kinto',
    chainId: 7887,
    explorerUrl: 'https://explorer.kinto.xyz',
    // this is the full launch of their mainnet, should be negligible socket bridged tvl before
    sinceTimestamp: UnixTime.fromDate(new Date('2024-05-21T00:00:01Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0x2cc0188fA85FD8Ce748C7Df6066873fdcfaD95e9'),
        batchSize: 150,
        sinceBlock: 218561,
        version: '3',
      },
    ],
    apis: [
      { type: 'rpc', url: 'https://rpc.kinto-rpc.com', callsPerMinute: 600 },
      { type: 'blockscout', url: 'https://explorer.kinto.xyz/api' },
    ],
  },
  hasAtLeastFiveExternalChallengers: true,
  isNodeAvailable: true,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  usesEthereumBlobs: true,
  nonTemplateRiskView: {
    exitWindow: {
      value: 'None',
      description:
        'There is no exit window for users to exit in case of unwanted regular upgrades of the L1 as they are initiated by the Security Council with instant upgrade power and without proper notice. Upgrades initiated by actors other than the Security Council (e.g. KYC providers) on Layer 2 guarantee at least a 7d exit window to the user.',
      sentiment: 'bad',
      orderHint: 0, // 0-7 days
    },
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  scopeOfAssessment: {
    inScope: [
      'Ability to deposit, spend, and withdraw the gas token (ETH)',
      SOA.derivationSpec,
      'Upgradability of standard Orbit stack L1 and L2 core contracts',
      'Upgradability of Kinto-specific L2 contracts: KintoAppRegistry, KintoWalletFactory, KintoID, AccessManager, KintoWallet, EntryPoint',
      'Signer policies and recovery process for the KintoWallet',
      'Forced transaction mechanism via L1 through the EntryPoint and the KintoWallet',
    ],
    notInScope: [
      SOA.nonGasTokens,
      SOA.sourceCodeToProgramHash,
      'Upgradability of other whitelisted L2 contracts, including Socket bridge infrastructure',
      'Crosschain DeFi applications',
    ],
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://docs.kinto.xyz/kinto-the-safe-l2/building-on-kinto/running-kinto-nodes',
      securityCouncilReference:
        'https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/security-council',
      additionalConsiderations: {
        short:
          'Kinto enforces the use of smart wallets and KYC by preventing arbitrary calls and new contracts creation. The system ensures that KYC can be revoked only if the Security Council proactively agrees to it. Only whitelisted contracts can be called by users.',
        long: `
Kinto enforces the use of smart wallets and KYC. A valid state transition in Kinto disallows all transactions by EOAs and new contracts creation, unless specifically whitelisted.
This setup effectively enforces smart wallet use because the auxiliary contracts of the standard KintoWallet smart wallet (like the EntryPoint and the KintoWalletFactory) are whitelisted.
The KYC validation is part of the KintoWallet signature verification. Since all users must use the same implementation of this smart wallet, all user transactions on Kinto check for an up-to-date KYC flag, and are dropped in case the check fails.
The system ensures that KYC can be revoked only if the Security Council proactively agrees to a proposed status change by a KYC provider. The Security Council has been historically following KYC provider decisions and it is explicitly tasked to do so.

The KintoWallet implementation supports different signer thresholds with a maximum of 4 signers. The first signer for each users smart wallet though is enforced to be held by Turnkey in a TEE.
Users can make transactions using this first signer only through Kinto's frontend. Authenticated by a passkey, the Turnkey TEE then signs the transaction for them and submits it to the L2.
The user can still choose to not trust Turnkey by adding 2 EOA signers to their wallet and setting their signer policy to 2/3 during wallet creation.

Contracts outside of the ones necessary to interact with the smart wallet and to withdraw the gas token are out of scope for the stage assessment and might present additional risks.`,
      },
    },
  ),
  upgradesAndGovernance: `
All critical system smart contracts are upgradeable (can be arbitrarily changed). This permission is held by the ${discovery.getMultisigStats('Kinto Security Council')} Kinto Security Council on Layer 1 and can be executed without any delay.
On the Kinto Layer 2, critical permissions are mostly guarded by an AccessManager contract, and then passed down with configurable delays to both the Security Council and the ${discovery.getMultisigStats('Kinto Multisig 2')} Kinto Multisig 2.

The Appchain designation of Kinto is mainly due to a modified L2 node, which queries a special censoring contract on L2 (called KintoAppRegistry) for a whitelist to filter transactions.
This makes the KintoAppRegistry contract a critical system contract and any change to its configuration equivalent to an upgrade of the Layer 2 system.
The KintoAppRegistry contract is also governed via the AccessManager by the Security Council or the Kinto Multisig 2 with a ${formatSeconds(l2critDelay)} delay.

Another critical contract on the Appchain is called KintoID. Permissioned actors with the 'KYC provider' role in the KintoID contract can 'sanction' (freeze) user smart wallets, preventing them from transacting.
To protect users from this role which is mostly held by EOAs, a sanction expires if not confirmed by the Security Council within ${formatSeconds(sanctionExpirySeconds)}.
An expired sanction guarantees the user a ${formatSeconds(discovery.getContractValue<number>('KintoID', 'EXIT_WINDOW_PERIOD') - sanctionExpirySeconds)} cooldown window during which they cannot be sanctioned again.

The canonical (enforced) smartwallet for users on Kinto can be upgraded via the KintoWalletFactory, using the same path via the AccessManager.
Additionally, each smart wallet must use a recoverer address custodied by Turnkey. This allows users to reset the wallet signers via their email in case they lose their passkey.
It also necessitates a recovery delay to prevent turnkey from maliciously using their recoverer permission. During this period of ${formatSeconds(discovery.getContractValue<number>('Kinto Multisig 2', 'RECOVERY_TIME'))}, the user can cancel the recovery process with any transaction in their smart wallet.

The permissioned sanctions logic by KYC providers necessitates at least an ${formatSeconds(l2critDelay)} delay on all upgrades that aren't executed by the Security Council, allowing the user at least 7d to exit.`,
  nonTemplateTechnology: {
    otherConsiderations: [
      {
        name: 'Enforced smart wallets and KYC',
        description: `
      The Kinto L2 node is a fork of Arbitrum's geth implementation with notable changes to the state transition function.
      A valid state transition in Kinto [disallows all transactions by EOAs](https://github.com/KintoXYZ/kinto-go-ethereum/blob/7aba9b812a82d9339d29a2345946c3d7030a0377/core/kinto_hardfork_7.go#L58) and new contract creation, unless specifically whitelisted.
      The current whitelist is sourced directly from the KintoAppRegistry smart contract on Kinto L2, and can be modified by the L2 governance.
      This setup effectively enforces smart wallet use because the auxiliary contracts of the standard KintoWallet smart wallet (like the EntryPoint and the KintoWalletFactory) are whitelisted.

      The KYC validation is part of the KintoWallet signature verification. Since all users must use the same implementation of this smart wallet, all user transactions on Kinto check for an up-to-date KYC flag, and are dropped in case the check fails.`,
        risks: [
          {
            category: 'Users can be censored if',
            text: "a KYC provider changes the users' KYC status and the Security Council confirms it.",
          },
          {
            category: 'Funds can be lost if',
            text: 'the user interacts with a compromised whitelisted contract.',
          },
        ],
        references: [
          {
            title: 'User Owned KYC - Kinto documentation',
            url: 'https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/how-does-kinto-solve-it',
          },
        ],
      },
    ],
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic'),
        references: [
          {
            title: 'Transaction lifecycle - Arbitrum documentation',
            url: 'https://developer.offchainlabs.com/tx-lifecycle',
          },
          {
            title: 'L2 to L1 Messages - Arbitrum documentation',
            url: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
          },
          {
            title: 'Mainnet for everyone - Arbitrum Blog',
            url: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
          },
        ],
        risks: [],
      },
      {
        ...EXITS.AUTONOMOUS,
        references: [
          ...EXITS.AUTONOMOUS.references,
          {
            title: 'List of whitelisted Kinto validators',
            url: 'https://docs.kinto.xyz/kinto-the-modular-exchange/security-kyc-aml/kinto-validators',
          },
        ],
      },
    ],
  },
  nonTemplateEscrows: [
    // source for socket superchain vaults https://github.com/KintoXYZ/socket-plugs/blob/feat/autodeploy/deployments/superbridge/prod_kinto_mainnet_addresses.json
    {
      address: EthereumAddress('0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013'),
      sinceTimestamp: UnixTime(1730655983),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['LINK'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xC9a9f47Ae41Fa4287837751AF7325e87a1dE9326'),
      sinceTimestamp: UnixTime(1730656015),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['LINK'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0xbE60CC82A67AC7BBA8F41408B0C6833cE73e0E4D'),
      sinceTimestamp: UnixTime(1730657767),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['cbBTC'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94'),
      sinceTimestamp: UnixTime(1716142367),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['WETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc'),
      sinceTimestamp: UnixTime(1716128303),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x755cD5d147036E11c76F1EeffDd94794fC265f0d'),
      sinceTimestamp: UnixTime(1716142595),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5'),
      sinceTimestamp: UnixTime(1715972567),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['DAI'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd'),
      sinceTimestamp: UnixTime(1716142919),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['ENA'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xdf34E61B6e7B9e348713d528fEB019d504d38c1e'),
      sinceTimestamp: UnixTime(1716143207),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDe'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xdb161cdc9c11892922F7121a409b196f3b00e640'),
      sinceTimestamp: UnixTime(1716143711),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['EIGEN'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xc7a542f73049C11f9719Be6Ff701fCA882D60020'),
      sinceTimestamp: UnixTime(1716143759),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['eETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85'),
      sinceTimestamp: UnixTime(1716143807),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sDAI'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x43b718Aa5e678b08615CA984cbe25f690B085b32'),
      sinceTimestamp: UnixTime(1716143855),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc'),
      sinceTimestamp: UnixTime(1716143903),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wUSDM'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xeB66259d2eBC3ed1d3a98148f6298927d8A36397'),
      sinceTimestamp: UnixTime(1716143951),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x95d60E34aB2E626407d98dF8C240e6174e5D37E5'),
      sinceTimestamp: UnixTime(1716216227),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['ETHFI'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2'),
      sinceTimestamp: UnixTime(1721253827),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['PAXG'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF'),
      sinceTimestamp: UnixTime(1721253935),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['XAUt'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x0fC783f611A888A2cAbC3dA482Add3215334dCc2'),
      sinceTimestamp: UnixTime(1721252735),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['MKR'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8'),
      sinceTimestamp: UnixTime(1725992651),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SOL'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8'),
      sinceTimestamp: UnixTime(1730147723),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SPX'],
      chain: 'ethereum',
    },
    // {
    //   address: EthereumAddress('0x2f87464d5F5356dB350dcb302FE28040986783a7'),
    //   sinceTimestamp: UnixTime(1719239375),
    //   source: 'external',
    //   bridge: {
    //     name: 'Socket bridge',
    //     slug: 'socket',
    //   },
    //   tokens: ['KINTO'],
    //   chain: 'ethereum',
    // },
    {
      address: EthereumAddress('0xfDF267c43c0C868046c66695c1a85c973418CBFb'),
      sinceTimestamp: UnixTime(1716142417),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['WETH'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0xE194f2B41A5dc6Be311aD7811eF391a0ac84687d'),
      sinceTimestamp: UnixTime(1716128411),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0xc7744d1A93c56a6eE12CCF1F2264641F219528fE'),
      sinceTimestamp: UnixTime(1716142647),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0x9354E3822CE6BF77B2761f8922972BB767D771d8'),
      sinceTimestamp: UnixTime(1715972109),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['DAI'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0x8de880ecA6B95214C1ECd1556BF1DB4d23f212B5'),
      sinceTimestamp: UnixTime(1716143999),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0x67c1869c1A105d8117938cFC6597409f59eA9af7'),
      sinceTimestamp: UnixTime(1730154133),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SPX'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x4D585D346DFB27b297C37F480a82d4cAB39491Bb'),
      sinceTimestamp: UnixTime(1716142397),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['WETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x6F855dE562CC9d019757f5F68a15Cd392FF52962'),
      sinceTimestamp: UnixTime(1716128387),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xC88A469B96A62d4DA14Dc5e23BDBC495D2b15C6B'),
      sinceTimestamp: UnixTime(1716142624),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x36E2DBe085eE4d028fD60f70670f662365d0E978'),
      sinceTimestamp: UnixTime(1715972440),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['DAI'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x7C852c2a3e367453Ce3a68A4D12c313BaD0565e3'),
      sinceTimestamp: UnixTime(1716143237),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDe'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x8bD30d8c5d5cBb5e41Af7B9A4bD654b34772e890'),
      sinceTimestamp: UnixTime(1716143980),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x500c8337782a9f82C5376Ea71b66A749cE42b507'),
      sinceTimestamp: UnixTime(1717616624),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wUSDM'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x25a1baC7314Ff40Ee8CD549251924D066D7d5bC6'),
      sinceTimestamp: UnixTime(1718367579),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SolvBTC'],
      chain: 'arbitrum',
    },
  ],
  milestones: [
    {
      title: 'Appchain Stage 1',
      url: 'https://medium.com/mamori-finance/kinto-is-now-a-stage1-appchain-2cf3c81546ea',
      date: '2025-03-27T00:00:00Z',
      description:
        'Users can exit the L2 in case of unwanted upgrades by actors other than the Security Council.',
      type: 'general',
    },
    {
      title: 'Security Council Governance',
      url: 'https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/security-council',
      date: '2024-11-03T00:00:00Z',
      description:
        'Kinto gives the ownership of all L1 system contracts to a Security Council that is properly set up.',
      type: 'general',
    },
    {
      title: 'First ever Challenge on mainnet',
      url: 'https://x.com/vincfurc/status/1853891918037463521',
      date: '2024-10-31T00:00:00Z',
      description:
        'The first correctly resolved fault proof challenge of a mainnet Orbit stack rollup.',
      type: 'general',
    },
    {
      title: 'Mainnet full launch',
      url: 'https://medium.com/mamori-finance/%EF%B8%8F-engen-is-over-kinto-is-launching-d9f2dd49fb2e',
      date: '2024-05-22T00:00:00Z',
      description:
        'Engen mining is completed and locked funds are bridged to the Kinto L2.',
      type: 'general',
    },
    {
      title: 'Kinto Mainnet Genesis',
      url: 'https://medium.com/mamori-finance/%EF%B8%8F-kintos-launch-the-set-up-7eddfbb4bc38',
      date: '2023-12-15T00:00:00Z',
      description: 'Kinto mainnet is launched. Deposits by users are disabled.',
      type: 'general',
    },
  ],
})
