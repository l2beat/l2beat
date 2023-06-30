import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const near: Bridge = {
  type: 'bridge',
  id: ProjectId('near'),
  display: {
    name: 'Rainbow Bridge',
    slug: 'near',
    links: {
      websites: ['https://near.org/'],
      explorers: ['https://explorer.near.org/', 'https://aurorascan.dev/'],
      apps: ['https://rainbowbridge.app/'],
      repositories: ['https://github.com/aurora-is-near/rainbow-bridge'],
      socialMedia: ['https://twitter.com/auroraisnear'],
    },
    description:
      'Rainbow bridge is a light client based bridge between NEAR/AURORA and Ethereum that allows for asset and data movement between these chains. For better gas efficiency from NEAR to Ethereum, it leverages optimistic validation, which adds some trust assumption and latency.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['AURORA'],
    escrows: [
      {
        address: EthereumAddress('0x23Ddd3e3692d1861Ed57EDE224608875809e127f'),
        sinceTimestamp: new UnixTime(1615826693),
        tokens: [
          'DAI',
          'USDC',
          'AURORA',
          'USDT',
          'WBTC',
          //'PLY',
          //'OCT',
          //'BSTN',
          'WOO',
          'FRAX',
        ],
      },
      {
        address: EthereumAddress('0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52'),
        sinceTimestamp: new UnixTime(1624579200),
        tokens: ['ETH'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'Transfers out of the bridge are validated using Optimistic Light Client of Near Chain on Ethereum. Transfers into NEAR are validated by Ethereum light client on NEAR side.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Bridge cannot be upgraded but 3/6 Admin Multisig can move all funds out of the bridge via admin functions with no warning.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Tokens minted on AURORA do not appear to be verified on aurorascan.dev.',
      sentiment: 'bad',
    },
  },
  technology: {
    canonical: true,
    destination: ['Near', 'Aurora'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Rainbow is a Token Bridge that allows transferring assets and passing arbitrary messages between Ethereum, NEAR, and Aurora chains. During token transfers, Rainbow Bridge locks tokens in the escrow contracts on Ethereum and mints tokens on the Aurora or NEAR networks. When bridging back to Ethereum, tokens are burned on Aurora / NEAR and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Both inbound and outbound transfers are verified by the light client',
      description:
        'Near Rainbow bridge implements a light client for both inbound and outbound transfers. For inbound transfers, checkpoints of NEAR state are submitted every 4 hours. \
        These are optimistically assumed to be signed by 2/3 of Near Validators. The signatures are not immediately verified by Ethereum due to a different signature scheme \
        used on NEAR and - as a result - very high gas cost on Ethereum. If signatures are found to be invalid, checkpoints can be permissionlessly challenged. \
        Users can withdraw funds by submitting a Merkle proof of a burn event against the checkpoint. \
        For outbound transfers, Ethereum light client is implemented on NEAR and a Merkle proof of a lock event must be presented.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'incorrect checkpoint is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge administrator removes funds from the bridge escrow.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens are not verified',
      description:
        'Tokens transferred end up as ERC20 tokens on AURORA or NEAR and they do not appear to be verified.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x23Ddd3e3692d1861Ed57EDE224608875809e127f'),
        name: 'ERC20Locker',
        description: 'Escrow contract for ERC20 tokens.',
      },
      {
        address: EthereumAddress('0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52'),
        name: 'EthCustodian',
        description: 'Escrow contract for ETH tokens.',
      },
      // {
      //   address: EthereumAddress('0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4'),
      //   name: 'NEAR token',
      //   description: 'Escrow contract for NEAR tokens.',
      // },
      {
        address: EthereumAddress('0x051AD3F020274910065Dcb421629cd2e6E5b46c4'),
        name: 'NearProver',
        description: 'Contract verifying merkle proofs, used for withdrawals.',
      },
      {
        address: EthereumAddress('0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873'), // new near bridge
        name: 'NearBridge (new)',
        description: 'Contract storing Near state checkpoints.',
      },
      {
        address: EthereumAddress('0x3be7Df8dB39996a837041bb8Ee0dAdf60F767038'), // old near bridge
        name: 'NearBridge (old)',
        description: 'Contract storing Near state checkpoints.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'Aurora MultiSig',
      description:
        'Can pause and reconfigure the bridge with no delay, can remove all tokens from Escrow via adminTransfer() method.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x0c406517c7B2f86d5935fB0a78511b7498B94413',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x21458c08e9a0Df8cf18132def9fEA0620962618E',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x2B5948a65BE418a54880501cfaA0969AC3fAb40c',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x8ddFfe05453d3b50774fb3938fD85Ecd1CC5E955',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xC3E34337B6505d503DcA3e99303Ad8BE6DB05984',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xD127323856C3703f94Dc1de18985cdCa2a8bA2b5',
          ),
          type: 'EOA',
        },
      ],
      name: 'MultiSig Participants',
      description: 'Participants of the 3/6 Aurora MultiSig.',
    },
  ],
}
