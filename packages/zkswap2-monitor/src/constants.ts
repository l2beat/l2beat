import { Address } from '@dethcrypto/eth-sdk'

export const Contracts: Record<string, Address> = {
  upgradeGatekeeper: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7', // extracted from https://ethtx.info/mainnet/0x88d1ab73c6f4b447a4411eaf4bbc1f4d8dbd3409fdcf4baef5209b665aa545df/
  governanceProxy: '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
  governance: '0x95269f9E76540459c797089034dc74b48dF780a2',
  pairManagerProxy: '0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D',
  pairManager: '0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89',
  verifierProxy: '0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef',
  verifier: '0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829',
  verifierExitProxy: '0xb56878d21F6b101f48bb55f1AA9D3F624f04E513',
  verifierExit: '0x17e51B3659884d70a306906B5BDD73D1c64a3892',
  mainProxy: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
  main: '0xf2c351f22b148A9fF583a0F81701471a74E7338e',
  upgradeMaster: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
  zkSyncCommitBlock: '0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4',
  zkSyncExit: '0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0',
  tokenLister: '0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E',
}
export const Validators = ['0x38101ae98196C8BCf7dF1835Bf3983B384272ae4']
export const Upgradeable = [
  Contracts.governanceProxy,
  Contracts.pairManagerProxy,
  Contracts.verifierProxy,
  Contracts.verifierExitProxy,
  Contracts.mainProxy,
]
export const GovernanceProxyCreationBlock = 12810001
