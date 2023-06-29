import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { Bridge } from '../../bridges/types'

export const bridge2WithDups: Bridge = {
  type: 'bridge',
  id: ProjectId('bridge2'),
  display: {
    name: 'Bridge2',
    slug: 'bridge2',
    category: 'Token Bridge',
    links: {},
  },
  config: {
    escrows: [],
  },
  technology: {
    destination: ['Dest Chain'],
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e'),
        name: 'Duplicate ForeignAMB Proxy',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          implementation: EthereumAddress(
            '0x82B67a43b69914E611710C62e629dAbB2f7AC6AB',
          ),
        },
      },
      {
        address: EthereumAddress('0x81910675DbaF69deE0fD77570BFD07f8E436386A'),
        name: 'Wrapper',
      },
      {
        address: EthereumAddress('0x250e76987d838a75310c34bf422ea9f1AC4Cc906'),
        name: 'LockProxy 0x250e...',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x8B35064B158634458Fd53A861d68Eb84152E4106'),
          implementation: EthereumAddress(
            '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
          ),
        },
      },
      {
        address: EthereumAddress('0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54'),
        name: 'LockProxyWithLP 0x7b9B...',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57'),
          implementation: EthereumAddress(
            '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
          ),
        },
      },
      {
        address: EthereumAddress('0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035'),
        name: 'LockProxy 0x3Ee7...',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x52D858ef5e0A768C80C38617eB8a7680f4D4d459'),
          implementation: EthereumAddress(
            '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
          ),
        },
      },
      {
        address: EthereumAddress('0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868'),
        name: 'LockProxy 0x53D2...',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0xeF86b2c8740518548ae449c4C3892B4be0475d8c'),
          implementation: EthereumAddress(
            '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
          ),
        },
      },
      {
        address: EthereumAddress('0x14413419452Aaf089762A0c5e95eD2A13bBC488C'),
        name: 'EthCrossChainManager',
      },
      {
        address: EthereumAddress('0xcF2afe102057bA5c16f899271045a0A37fCb10f2'),
        name: 'EthCrossChainData (Unverified source code)',
      },
      {
        address: EthereumAddress('0xcF2afe102057bA5c16f899271045a0A37fCb10f2'),
        name: 'EthCrossChainManagerProxy (Unverified source code)',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Duplicate Layer2a MultiSig',
      accounts: [
        {
          address: EthereumAddress(
            '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          ),
          type: 'MultiSig',
        },
      ],
      description: '',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner and Fee Collector at Wrapper and owner at LockProxyWithLP',
      description:
        'Can add new bridge contracts (Escrows, LockProxy), pause the bridge, and transfer to itself all funds and ERC20 tokens of the Wrapper contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb',
          ),
          type: 'Contract',
        },
      ],
      name: 'Owner of EthCrossChainManager (Unverified source code)',
      description:
        'Unverified contract on Etherscan. Can pause the contracts and update implementation of EthCrossChainData contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x8B35064B158634458Fd53A861d68Eb84152E4106',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner of LockProxy 0x250e',
      description: 'Can update address of EthCrossChainManagerProxy contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x52D858ef5e0A768C80C38617eB8a7680f4D4d459',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner at LockProxy 0x3Ee7...',
      description: 'Can update address of EthCrossChainManagerProxy contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xeF86b2c8740518548ae449c4C3892B4be0475d8c',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner of LockProxy 0x53D2...',
      description: 'Can update address of EthCrossChainManagerProxy contract.',
    },
  ],
}
