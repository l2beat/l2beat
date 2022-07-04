import { Address } from '@dethcrypto/eth-sdk'

export const Contracts: Record<string, Address> = {
  upgradeGatekeeper: '0x38A43F4330f24fe920F943409709fc9A6084C939', // extracted from https://ethtx.info/tx/0x21dfeea6c82d47203f91aba30af5e5ef3d623aa8206596fbd8c466a5b1586f02/
  upgradeMaster: '0xE24f4870Ab85DE8E356C5fC56138587206c70d99',
  verifierProxy: '0x5290E9582B4FB706EaDf87BB1c129e897e04d06D',
  mainProxy: '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF',
  governanceProxy: '0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01',
  tokenGovernance: '0x35cc31f63deef017c38d51B038891bAE7d614e86',
  verifier: '0xf7Bd436a05678B647D74a88ffcf4445Efc43BDfC',
  main: '0x59a5E7c08be8356193Cd9F92CA8Ac95C42aB0Bdd',
  governance: '0x934ef5836E78d93125317034f5CF855A97B13f43',
  additional: '0x080812701c94087f1dee425ebd7cbf9efaf878e2', // security council hardcoded in code
}
export const Validators = ['0x18c208921F7a741510a7fc0CfA51E941735DAE54']
export const Upgradeable = [
  Contracts.governanceProxy,
  Contracts.verifierProxy,
  Contracts.mainProxy,
]
export const Treasury = '0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027'
export const UpgradeMasterOwners = [
  '0xA5F3C860441c0EeD02BF8A6472AF32B68884b0FF',
  '0x474D2b82E02D9712A077574E7764dEfA182653D4',
  '0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607',
  '0x9dF8bc0918F357c766A5697E031fF5237c05747A',
  '0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc',
  '0xa265146cA40F52cfC439888D0b4291b5440e6769',
]
export const UpgradeMasterThreshold = 3
export const GovernanceProxyCreationBlock = 10269890
