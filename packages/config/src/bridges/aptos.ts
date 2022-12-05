import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const aptos: Bridge = {
  type: 'bridge',
  id: ProjectId('aptos'),
  display: {
    name: 'Aptos (LayerZero)',
    slug: 'aptos',
    links: {
      websites: [
        'https://theaptosbridge.com/bridge',
        'https://layerzero.network/',
      ],
      repositories: [
        'https://github.com/LayerZero-Labs/LayerZero-Aptos-Contract',
        'https://github.com/aptos-labs',
      ],
      socialMedia: ['https://twitter.com/Aptos_Network'],
    },
    description:
      'Aptos Bridge is built on top of LayerZero protocol and is a token bridge for transferring assets from Ethereum to Aptos. It leverages an oracle and relayer for cross-chain security for the protocol.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Token Bridge contracts are not upgradable but the owner (EOA) can remove all the funds after 1 week delay. LayerZero contracts are upgradable without delay.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Aptos'],
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Aptos Bridge is a Token Bridge. It locks tokens in Ethereum escrow and mints tokens on Aptos.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Oracles and Relayers',
      description:
        'Aptos Bridge is built on top of LayerZero protocol. LayerZero relies on Oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, Relayers can provide the merkle proof for the transfers. Token Bridge owner can withdraw all funds from the bridge escrow\
        after placing the bridge in an emergency withdrawal mode that will allow them to transfer all tokens out after 1 week delay.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracles or relayers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer .',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'token bridge owner (currently EOA) enables emergency withdrawal and users do not exit with their funds within a week.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: "token bridge owner (currently EOA) sets WETH contract address to a malicious contract that will allow the owner to steal user's ETH.",
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: '0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907',
        sinceTimestamp: new UnixTime(1666143827),
        tokens: [
          'USDC',
          'USDT',
          'WETH',
          //'USDD'
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: '0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907',
        name: 'TokenBridge',
        description: 'Aptos Token Bridge.',
      },
      {
        address: '0x902F09715B6303d4173037652FA7377e5b98089E',
        name: 'LayerZero Relayer',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
          implementation: '0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7',
        },
      },
      {
        address: '0x5a54fe5234E811466D5366846283323c954310B2',
        name: 'LayerZero Oracle',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8',
          implementation: '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
        },
      },
      {
        address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
        name: 'Endpoint',
        description: 'LayerZero Ethereum Endpoint.',
      },
      {
        address: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
        name: 'UltraLightNodeV2',
        description:
          'LayerZero UltraLight Node V2. Used by oracles to checkpoint source chain block hashes.',
      },
      {
        address: '0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d',
        name: 'TreasuryV2',
        description: 'LayerZero Treasury V2.',
      },
      {
        address: '0x07245eEa05826F5984c7c3C8F478b04892e4df89',
        name: 'LayerZero Proof Library',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: [
        {
          address: '0x971016EF5Bd9C71fA4ff34D731974d03cEFf5F05',
          type: 'MultiSig',
        },
      ],
      name: 'Aptos Multisig',
      description:
        'Bridge owner, can setup tokens, fees, WETH token address (potentially malicious). Can withdraw all the funds from the Escrow after unlocking emergency withdrawal with 1 week delay.',
    },
    {
      accounts: [
        { address: '0xB9539A3CfeC8B6cE1953245204efDd0d8eF8244e', type: 'EOA' },
        { address: '0x7a69957582661D2e1b0102D00Bc22a44ffe8c5AB', type: 'EOA' },
        { address: '0x0e1B8B9714830DcC8bBA324eDC5D0F500a78f3b7', type: 'EOA' },
        { address: '0x9134Ff6E5F2D42ADf0E8Cb7462616f18A8dEF6DC', type: 'EOA' },
      ],
      name: 'Aptos MultiSig Participants',
      description: 'Participants of the 2/4 Aptos MultiSig.',
    },
    {
      accounts: [
        {
          address: '0x902F09715B6303d4173037652FA7377e5b98089E',
          type: 'Contract',
        },
      ],
      name: 'LayerZero Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
    },
    {
      accounts: [
        {
          address: '0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5',
          type: 'EOA',
        },
      ],
      name: 'LayerZero Relayer Admin owner',
      description: 'Can upgrade LayerZero relayer contract with no delay.',
    },
    {
      accounts: [
        {
          address: '0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8',
          type: 'EOA',
        },
      ],
      name: 'LayerZero Oracle Admin owner',
      description: 'Can upgrade LayerZero oracle contract with no delay.',
    },
    {
      accounts: [
        {
          address: '0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92',
          type: 'MultiSig',
        },
      ],
      name: 'LayerZero Multisig',
      description:
        'The owner of Endpoint, UltraLightNode and Treasury contracts. Can switch to a new UltraLightNode for an Endpoint. Can switch proof library for an UltraLightNode and change Treasury.',
    },
    {
      accounts: [
        { address: '0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327', type: 'EOA' },
        { address: '0xe095F2590eF1Ab39601445025847Ed8E4B40D687', type: 'EOA' },
        { address: '0xBb6633cc267951E938F9B6421E4F54aa5b2c1936', type: 'EOA' },
        { address: '0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e', type: 'EOA' },
        { address: '0x67FC8c432448f9a8d541C17579EF7a142378d5aD', type: 'EOA' },
      ],
      name: 'LayerZero MultiSig Participants',
      description: 'Participants of the 2/5 LayerZero MultiSig.',
    },
  ],
}
