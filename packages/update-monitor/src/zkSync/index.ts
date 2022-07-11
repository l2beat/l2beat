import { providers } from 'ethers'
import { ProjectParameters } from '../types'
import { addresses } from './constants'
import { getGovernance } from './governance'
import { getUpgradeGatekeeper } from './upgradeGatekeeper'

export async function getZkSyncParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: 'zkSync 1.0',
    contracts: [
      await getUpgradeGatekeeper(provider),
      await getGovernance(provider),
    ],
  }
}

// async function getAdditionalAddress(provider: providers.AlchemyProvider) {
//   const additionalAddressPosition = 19 // checked manually in contract code
//   const cellValue: string = await provider.getStorageAt(
//     addresses.mainProxy,
//     additionalAddressPosition,
//   )
//   return '0x' + cellValue.slice(-40)
// }

// export async function run() {
//   dotenv.config()
//   const alchemyApiKey = process.env.ALCHEMY_API_KEY
//   const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)
//   const sdk = getMainnetSdk(provider)

//   const upgradeable = await getUpgradeableContracts(sdk.upgradeGatekeeper)
//   assert.deepEqual(upgradeable, Upgradeable)
//   assert.equal(await sdk.upgradeGatekeeper.getMaster(), addresses.upgradeMaster)
//   assert.equal(await sdk.upgradeGatekeeper.mainContract(), addresses.mainProxy)

//   assert.equal(await sdk.governanceProxy.getTarget(), addresses.governance)
//   const governanceProxyMaster = await sdk.governanceProxy.getMaster()
//   assert.equal(governanceProxyMaster, addresses.upgradeGatekeeper)

//   assert.equal(await sdk.verifierProxy.getTarget(), addresses.verifier)
//   assert.equal(await sdk.verifierProxy.getMaster(), addresses.upgradeGatekeeper)

//   assert.equal(await sdk.mainProxy.getTarget(), addresses.main)
//   assert.equal(await sdk.mainProxy.getMaster(), addresses.upgradeGatekeeper)

//   const networkGovernor = await sdk.governanceProxy.networkGovernor()
//   assert.equal(networkGovernor, addresses.upgradeMaster)

//   const tokenGovernance = await sdk.governanceProxy.tokenGovernance()
//   assert.equal(tokenGovernance, addresses.tokenGovernance)

//   assert.deepEqual(await getActiveValidators(sdk.governanceProxy), Validators)

//   assert.equal(await sdk.tokenGovernance.treasury(), Treasury)

//   assert.deepEqual(await sdk.upgradeMaster.getOwners(), UpgradeMasterOwners)
//   assert.equal(await sdk.upgradeMaster.getThreshold(), UpgradeMasterThreshold)

//   assert.equal(
//     await getAdditionalAddress(provider),
//     addresses.additional,
//     'Additional contract differs - this might mean security council has changed!',
//   )
// }
