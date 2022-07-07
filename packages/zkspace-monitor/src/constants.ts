import { Address } from '@dethcrypto/eth-sdk'

export const Contracts: Record<string, Address> = {
  upgradeGatekeeper: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
  upgradeMaster: '0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be',
  mainProxy: '0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
  main: '0x467a2B91f231D930F5eeB6B982C7666E81DA8626',
  zkSyncCommitBlock: '0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db',
  zkSyncExit: '0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7',
  zkSea: '0x899A605a3B7A11eA5D928958b77014e763c53426',
  governanceProxy: '0x83Cb1531Ec8447366501aE440478da245EcffB89',
  governance: '0x6659174CdB0c445B897aEd25181f293E468941a5',
  pairManagerProxy: '0xc07f850b60E0EEd49a09E455b01a869C25963735',
  pairManager: '0x5f3bE7846efC473552C5619b929F7d4aa640fb54',
  zkSeaNFTProxy: '0xc632347cc96A4400653E3514eA148630455295b5',
  zkSeaNFT: '0xD06986022EFE62A5BC8258299e4495Bb27567BE0',
  verifierProxy: '0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af',
  verifier: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
  verifierExitProxy: '0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81',
  verifierExit: '0x41455808B3109AD0f79672C44D75933D3529FEaE',
  tokenLister: '0x8aA2C56dca9d59F4317c2fad632c192b18127709',
}
export const Validators = ['0x5bd9404260D2B0D55081E599e4e085BE080141E2']
export const Upgradeable = [
  Contracts.governanceProxy,
  Contracts.zkSeaNFTProxy,
  Contracts.pairManagerProxy,
  Contracts.verifierProxy,
  Contracts.verifierExitProxy,
  Contracts.mainProxy,
]
export const GovernanceProxyCreationBlock = 13809566
