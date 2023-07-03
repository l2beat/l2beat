import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, NUGGETS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('aptos')

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
    category: 'Token Bridge',
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
        address: EthereumAddress('0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907'),
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
      discovery.getContractDetails('TokenBridge', 'Aptos Token Bridge.'),
      {
        address: EthereumAddress('0x902F09715B6303d4173037652FA7377e5b98089E'),
        name: 'LayerZero Relayer',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9'),
          implementation: EthereumAddress(
            '0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7',
          ),
        },
      },
      {
        address: EthereumAddress('0x5a54fe5234E811466D5366846283323c954310B2'),
        name: 'LayerZero Oracle',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8'),
          implementation: EthereumAddress(
            '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
          ),
        },
      },
      discovery.getContractDetails('Endpoint', 'LayerZero Ethereum Endpoint.'),
      discovery.getContractDetails(
        'UltraLightNodeV2',
        'LayerZero UltraLight Node V2. Used by oracles to checkpoint source chain block hashes.',
      ),
      discovery.getContractDetails('TreasuryV2', 'LayerZero Treasury.'),
      {
        address: EthereumAddress('0x07245eEa05826F5984c7c3C8F478b04892e4df89'),
        name: 'LayerZero Proof Library',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Aptos Multisig',
      'Bridge owner, can setup tokens, fees, WETH token address (potentially malicious). Can withdraw all the funds from the Escrow after unlocking emergency withdrawal with 1 week delay.',
    ),
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x902F09715B6303d4173037652FA7377e5b98089E',
          ),
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
          address: EthereumAddress(
            '0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5',
          ),
          type: 'EOA',
        },
      ],
      name: 'LayerZero Relayer Admin owner',
      description: 'Can upgrade LayerZero relayer contract with no delay.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8',
          ),
          type: 'EOA',
        },
      ],
      name: 'LayerZero Oracle Admin owner',
      description: 'Can upgrade LayerZero oracle contract with no delay.',
    },
    ...discovery.getMultisigPermission(
      'LayerZero Multisig',
      'The owner of Endpoint, UltraLightNode and Treasury contracts. Can switch to a new UltraLightNode for an Endpoint. Can switch proof library for an UltraLightNode and change Treasury.',
    ),
  ],
  knowledgeNuggets: [
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
  ],
}
