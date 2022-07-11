import { Address } from '@dethcrypto/eth-sdk'

export const Contracts: Record<string, Address> = {
  upgradeGatekeeper: '0x714B2D10210f2A3a7AA614F949259C87613689aB', // extracted from https://ethtx.info/mainnet/0x88d1ab73c6f4b447a4411eaf4bbc1f4d8dbd3409fdcf4baef5209b665aa545df/
  governanceProxy: '0x02ecef526f806f06357659fFD14834fe82Ef4B04',
  governance: '0x9d3fdf9b4782753d12f6262bf22B6322608962b8',
  pairManagerProxy: '0x661121AE41edE3f6FECDed922c59acC19A3ea9B3',
  pairManager: '0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8',
  verifierProxy: '0x27C229937745d697d28FC7853d1bFEA7331Edf56',
  verifier: '0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F',
  verifierExitProxy: '0x961369d347EF7A6896BDD39cBE2B89e3911f521f',
  verifierExit: '0xd12F4D8329584F36aEd67f807F42D9a02bEb9534',
  mainProxy: '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad',
  main: '0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f',
  upgradeMaster: '0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037',
  zkSyncCommitBlock: '0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157',
  zkSyncExit: '0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5',
}
export const Validators = ['0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3']
export const Upgradeable = [
  Contracts.governanceProxy,
  Contracts.pairManagerProxy,
  Contracts.verifierProxy,
  Contracts.verifierExitProxy,
  Contracts.mainProxy,
]
export const Treasury = '0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027'
export const GovernanceProxyCreationBlock = 11841962
