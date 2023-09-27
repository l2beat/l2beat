export const contractStub = {
  name: 'MockedContract',
  address: '0x0D4C1222f5e839a911e2053860e45F18921D72ac',
  code: 'https://etherscan.deth.net/address/0x0D4C1222f5e839a911e2053860e45F18921D72ac',
  upgradeability: {
    type: 'immutable',
    zeroUpgradeabilityParam: 0,
  },
  values: {
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

export const discoveredJsonStub = {
  name: 'mockedproject',
  blockNumber: 16154924,
  contracts: [
    contractStub,
    {
      name: 'DuplicatedNameContractMock',
      address: '0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      code: 'https://etherscan.deth.net/address/0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      upgradeability: {
        type: 'immutable',
      },
      values: {
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
      address: '0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      code: 'https://etherscan.deth.net/address/0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      upgradeability: {
        type: 'immutable',
      },
      values: {
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
      name: 'TopMultisigMock',
      address: '0x344DddaDd2b96ef51700574204806F25bc9a23C0',
      code: 'https://etherscan.deth.net/address/0x344DddaDd2b96ef51700574204806F25bc9a23C0',
      upgradeability: {
        type: 'gnosis safe',
      },
      values: {
        getThreshold: 3,
        getOwners: [
          '0xA4878f0E143Dad8eB8999f079fDF319988bc6EB2',
          '0x7d2C8AB5bf6F0D72BD255e65cA98cCb0773c2F0b',
          '0x4C6ebdEf6E8B6c9913B3FEb6ACBf8177eFcc92B3',
          '0x4203A72C772ed980694bCEd929D982D5859d34FF',
        ],
      },
    },
    {
      name: 'RecursiveMultisigMock',
      address: '0x4203A72C772ed980694bCEd929D982D5859d34FF',
      code: 'https://etherscan.deth.net/address/0x4203A72C772ed980694bCEd929D982D5859d34FF',
      upgradeability: {
        type: 'gnosis safe',
      },
      values: {
        getThreshold: 2,
        getOwners: [
          '0x690698362E12b370053C0D1cED9aD179115d7fbD',
          '0x344DddaDd2b96ef51700574204806F25bc9a23C0',
        ],
      },
    },
  ],
  eoas: [],
}
