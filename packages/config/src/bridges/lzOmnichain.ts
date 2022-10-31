import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const lzOmnichain: Bridge = {
  type: 'bridge',
  id: ProjectId('lzOmnichain'),
  display: {
    name: 'Omnichain (LayerZero)',
    slug: 'lzOmnichain',
    links: {
      websites: ['https://layerzero.network/'],
      repositories: [
        'https://github.com/LayerZero-Labs/',
        'https://github.com/stargate-protocol',
      ],
      socialMedia: ['https://twitter.com/StargateFinance'],
    },
    description:
      'Omnichain tokens are built on top of LayerZero AMB protocol. They inherit its security and add on top of it their own additional security assumptions.',
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
        "Omnichain tokens can be individually upgradable and it's security assumptions must be individually assessed for each individual token.",
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Various'],
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Omnichain tokens are tokenized Token Bridges. One chain is designated as main and acts as an token escrow. Transfers from the main chain are done using typical lock-mint model. Transfers between\
        other (non-main) chains are made using burn-mint model. The implementation details may vary between each individual omnichain token and must be individually assessed.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracles and Relayers',
      description:
        'Omnichain tokens are built on top of LayerZero protocol. LayerZero relies on Oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, Relayers can provide the merkle proof for the transfers. Omnichain token owner can withdraw all funds from the bridge escrow\
        by changing Oracle/Relayer pair.',
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
          text: 'omnichain token owner changes Oracle/Relayer pair for their own.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
        sinceTimestamp: new UnixTime(1647504559),
        tokens: ['STG'],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
        name: 'StargateToken',
        description: 'StarGate (STG) omnichain token.',
      },
      {
        address: '0x902F09715B6303d4173037652FA7377e5b98089E',
        name: 'Layer Zero default Relayer (Implementation not Verified)',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
          implementation: '0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7',
        },
        description: '???.',
      },
      {
        address: '0x5a54fe5234E811466D5366846283323c954310B2',
        name: 'Layer Zero default Oracle (Implementation not Verified)',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8',
          implementation: '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
        },
        description: '???.',
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
        address: '0x902F09715B6303d4173037652FA7377e5b98089E',
        name: 'ILayerZeroLayerV2 (Implementation Not Verified)',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
          implementation: '0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7',
        },
        description: '???.',
      },
      {
        address: '0x5a54fe5234E811466D5366846283323c954310B2',
        name: 'ILayerZeroOracleV2 (Implementation Not Verified)',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8',
          implementation: '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
        },
        description: '???.',
      },
      {
        address: '0x07245eEa05826F5984c7c3C8F478b04892e4df89',
        name: 'Layer Zero Proof Library (Not Verified)',
        description: '???.',
      },
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK, CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: [
        {
          address: '0x902F09715B6303d4173037652FA7377e5b98089E ',
          type: 'Contract',
        },
      ],
      name: 'Omnichain Tokens Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
    },
    {
      accounts: [
        {
          address: '0x65bb797c2B9830d891D87288F029ed8dACc19705 ',
          type: 'MultiSig',
        },
      ],
      name: 'StarGate STG owner',
      description:
        'Can pause STG token, can configure Oracle/Relayer of Layer Zero AMB bridge, can set/change destination address of STG token for any chain.',
    },
  ],
}
