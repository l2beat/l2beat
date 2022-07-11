import { providers } from 'ethers'

import { ProjectParameters } from '../types'
import { getGovernance } from './contracts/governance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getVerifier } from './contracts/verifier'

export async function getZkSyncParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: 'zkSync 1.0',
    contracts: [
      await getUpgradeGatekeeper(provider),
      await getGovernance(provider),
      await getVerifier(provider),
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
//   assert.equal(await sdk.mainProxy.getTarget(), addresses.main)
//   assert.equal(await sdk.mainProxy.getMaster(), addresses.upgradeGatekeeper)

//   assert.equal(await sdk.tokenGovernance.treasury(), Treasury)

//   assert.deepEqual(await sdk.upgradeMaster.getOwners(), UpgradeMasterOwners)
//   assert.equal(await sdk.upgradeMaster.getThreshold(), UpgradeMasterThreshold)

//   assert.equal(
//     await getAdditionalAddress(provider),
//     addresses.additional,
//     'Additional contract differs - this might mean security council has changed!',
//   )
// }
