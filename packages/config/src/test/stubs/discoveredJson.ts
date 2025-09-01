import type { DiscoveryOutput, EntryParameters } from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
export const contractStub: EntryParameters = {
  type: 'Contract',
  name: 'MockedContract',
  address: ChainSpecificAddress(
    'eth:0x0D4C1222f5e839a911e2053860e45F18921D72ac',
  ),
  proxyType: 'StarkWare diamond',
  receivedPermissions: [
    {
      permission: 'sequence',
      from: ChainSpecificAddress(
        'eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      ),
    },
  ],
  values: {
    $immutable: false,
    $implementation: EthereumAddress.random().toString(),
    StarkWareDiamond_upgradeDelay: 0,
    authority: '0x22405c1782913fb676bc74Ef54a60727B0e1026F',
    CHILD_BLOCK_INTERVAL: 1000,
    childBlockInterval: 1000,
    getMaintainer: '0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21',
    getVersion: '1.0.4+a69c763',
    isChildChainActivated: true,
    isDeposit: [],
    minExitPeriod: 604800,
    nextChildBlock: 5282000,
    nextDeposit: 1,
    nextDepositBlock: 5281001,
    version: '1.0.4+a69c763',
  },
}

export const discoveredJsonStub: DiscoveryOutput = {
  name: 'mockedproject',
  timestamp: 1670682767,
  entries: [
    contractStub,
    {
      type: 'Contract',
      name: 'DuplicatedNameContractMock',
      address: ChainSpecificAddress(
        'eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      ),
      values: {
        $immutable: true,
        BOND_LOWER_BOUND_DIVISOR: 2,
        BOND_UPPER_BOUND_MULTIPLIER: 2,
        INITIAL_BOND_SIZE: '14000000000000000',
        INITIAL_IFE_BOND_SIZE: '37000000000000000',
        INITIAL_PB_BOND_SIZE: '28000000000000000',
        piggybackBondSize: '28000000000000000',
        startIFEBondSize: '37000000000000000',
        startStandardExitBondSize: '14000000000000000',
      },
    },
    {
      type: 'Contract',
      name: 'DuplicatedNameContractMock',
      address: ChainSpecificAddress(
        'arb1:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      ),
      values: {
        $immutable: true,
        BOND_LOWER_BOUND_DIVISOR: 2,
        BOND_UPPER_BOUND_MULTIPLIER: 2,
        INITIAL_BOND_SIZE: '14000000000000000',
        INITIAL_IFE_BOND_SIZE: '37000000000000000',
        INITIAL_PB_BOND_SIZE: '28000000000000000',
        piggybackBondSize: '28000000000000000',
        startIFEBondSize: '37000000000000000',
        startStandardExitBondSize: '14000000000000000',
      },
    },
    {
      type: 'EOA',
      address: ChainSpecificAddress.from('eth', EthereumAddress.from('0xaa11')),
      receivedPermissions: [
        {
          permission: 'validate',
          from: ChainSpecificAddress(
            'eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
          ),
        },
      ],
    },
    {
      type: 'EOA',
      address: ChainSpecificAddress.from('eth', EthereumAddress.from('0xbb22')),
      receivedPermissions: [
        {
          permission: 'sequence',
          from: ChainSpecificAddress(
            'eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
          ),
        },
      ],
    },
  ],
  abis: {},
  configHash: Hash256.random(),
  usedTemplates: {},
  usedBlockNumbers: {},
}
