import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('aptos')

export const aptos: Bridge = {
  type: 'bridge',
  id: ProjectId('aptos'),
  addedAt: UnixTime(1667124468), // 2022-10-30T10:07:48Z
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
      socialMedia: [
        'https://x.com/Aptos',
        'https://discord.com/invite/aptosnetwork',
        'https://linkedin.com/company/aptos-foundation/',
        'https://t.me/aptos',
      ],
    },
    description:
      'Aptos Bridge is built on top of LayerZero protocol and is a token bridge for transferring assets from Ethereum to Aptos. It leverages an oracle and relayer for cross-chain security for the protocol.',
    category: 'Single-chain',
  },
  riskView: {
    validatedBy: {
      value: 'EOA',
      description:
        'Transfers need to be independently confirmed by an oracle attesting to source chain checkpoints and a relayer providing a merkle proof of the transfer event.',
      sentiment: 'bad',
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: 'EOA',
        description:
          'Token Bridge contracts are not upgradable but the owner (EOA) can remove all the funds after 1 week delay. LayerZero contracts are upgradable without delay.',
        sentiment: 'bad',
      },
      pause: {
        value: 'EOA',
        sentiment: 'bad',
        description:
          'Although the globalPause function is restricted to a Multisig, parts of the message bridge are upgradeable by an EOA which can be used to freeze the bridge.',
      },
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
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
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer .',
        },
        {
          category: 'Funds can be stolen if',
          text: 'token bridge owner (currently EOA) enables emergency withdrawal and users do not exit with their funds within a week.',
        },
        {
          category: 'Funds can be stolen if',
          text: "token bridge owner (currently EOA) sets WETH contract address to a malicious contract that will allow the owner to steal user's ETH.",
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907'),
        sinceTimestamp: UnixTime(1666143827),
        tokens: [
          'USDC',
          'USDT',
          'WETH',
          //'USDD'
        ],
        chain: 'ethereum',
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('TokenBridge', 'Aptos Token Bridge.'),
        discovery.getContractDetails('LayerZero Relayer'),
        discovery.getContractDetails('LayerZero Oracle'),
        discovery.getContractDetails(
          'Endpoint',
          'LayerZero Ethereum Endpoint.',
        ),
        discovery.getContractDetails(
          'UltraLightNodeV2',
          'LayerZero UltraLight Node V2. Used by oracles to checkpoint source chain block hashes.',
        ),
        discovery.getContractDetails('TreasuryV2', 'LayerZero Treasury.'),
        discovery.getContractDetails('LayerZero Proof Library'),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Aptos Multisig',
          'Bridge owner, can setup tokens, fees, WETH token address (potentially malicious). Can withdraw all the funds from the Escrow after unlocking emergency withdrawal with 1 week delay.',
        ),
        discovery.getPermissionDetails(
          'LayerZero Relayer',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x902F09715B6303d4173037652FA7377e5b98089E',
            ),
          ]),
          'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
        ),
        discovery.getPermissionDetails(
          'LayerZero Relayer Admin owner',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5',
            ),
          ]),
          'Can upgrade LayerZero relayer contract with no delay.',
        ),
        discovery.getPermissionDetails(
          'LayerZero Oracle Admin owner',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8',
            ),
          ]),
          'Can upgrade LayerZero oracle contract with no delay.',
        ),
        discovery.getMultisigPermission(
          'LayerZero Multisig',
          'The owner of Endpoint, UltraLightNode and Treasury contracts. Can switch to a new UltraLightNode for an Endpoint. Can switch proof library for an UltraLightNode and change Treasury.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
