import { ContractParameters, DiscoveryOutput } from '@l2beat/discovery-types'
import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'

export const contractStub: ContractParameters = {
  name: 'MockedContract',
  address: EthereumAddress('0x0D4C1222f5e839a911e2053860e45F18921D72ac'),
  proxyType: 'StarkWare diamond',
  receivedPermissions: [
    {
      permission: 'sequence',
      from: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
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
  chain: 'ethereum',
  blockNumber: 16154924,
  contracts: [
    contractStub,
    {
      name: 'DuplicatedNameContractMock',
      address: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
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
      name: 'DuplicatedNameContractMock',
      address: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
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
  ],
  eoas: [
    {
      address: EthereumAddress.from('0xaa11'),
      receivedPermissions: [
        {
          permission: 'validate',
          from: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
        },
      ],
    },
    {
      address: EthereumAddress.from('0xbb22'),
      receivedPermissions: [
        {
          permission: 'sequence',
          from: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
        },
      ],
    },
  ],
  abis: {},
  configHash: Hash256.random(),
  usedTemplates: {},
}

export const discoveredOpStackJsonStub: DiscoveryOutput = {
  name: 'mockedopstackproject',
  chain: 'optimism',
  blockNumber: 16154924,
  contracts: [
    {
      name: 'ProxyAdmin',
      address: EthereumAddress('0x543bA4AADBAb8f9025686Bd03993043599c6fB04'),
      values: {
        $immutable: true,
      },
    },
    {
      name: 'MockPortal',
      address: EthereumAddress('0x0a2CCDbBD00f61724C485518B940Ab25abe832aA'),
      proxyType: 'EIP1967 proxy',
      values: {
        $implementation: '0x1b927019071A2a9C2b852Fd36f7238D2376B82FA',
        $admin: '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
      },
    },
    {
      name: 'L2OutputOracle',
      address: EthereumAddress('0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3'),
      proxyType: 'EIP1967 proxy',
      values: {
        $implementation: '0x29510c3ac0248bBE92FDb57bd2cBAF7216cC217a',

        $admin: '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
      },
    },
    {
      name: 'L1CrossDomainMessenger',
      address: EthereumAddress('0x17bFa0561d9Ae73e05EcEAEB6663aDc85fA1d3E2'),
      proxyType: 'resolved delegate proxy',
      values: {
        ResolvedDelegateProxy_addressManager:
          '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
        ResolvedDelegateProxy_implementationName: 'OVM_L1CrossDomainMessenger',
        $implementation: '0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43',
      },
    },
    {
      name: 'SystemConfig',
      address: EthereumAddress('0x6Dda3a70B9946fA8C015904d9E2BEC86ecE4E745'),
      proxyType: 'EIP1967 proxy',
      values: {
        $implementation: '0xeba2dc4CC210e885F60b5feA41FDEab0C6527fdc',
        $admin: '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
      },
    },
    {
      name: 'L1StandardBridge',
      address: EthereumAddress('0xeBec795c9c8bBD61FFc14A6662944748F299cAcf'),
      proxyType: 'EIP1967 proxy',
      values: {
        $implementation: '0xC70dcb11c0673b0BBE2F415105fA2B15Ac58339f',
        $admin: '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
      },
    },
  ],
  eoas: [],
  abis: {},
  configHash: Hash256.random(),
  usedTemplates: {},
}
