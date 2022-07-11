import assert from 'assert'
import dotenv from 'dotenv'
import { providers } from 'ethers'

import {
  Contracts,
  GovernanceProxyCreationBlock,
  Treasury,
  Upgradeable,
  UpgradeMasterOwners,
  UpgradeMasterThreshold,
  Validators,
} from './constants'
import { getMainnetSdk, MainnetSdk } from './eth-sdk/sdk'

async function getUpgradeableContracts(
  gateKeeper: MainnetSdk['upgradeGatekeeper'],
) {
  let shouldContinue = true
  const managed: string[] = []
  for (let i = 0; shouldContinue; ++i) {
    try {
      const address = await gateKeeper.managedContracts(i)
      managed.push(address)
    } catch {
      shouldContinue = false
    }
  }
  return managed
}

async function getActiveValidators(
  governanceProxy: MainnetSdk['governanceProxy'],
) {
  const events = await governanceProxy.queryFilter(
    governanceProxy.filters.ValidatorStatusUpdate(),
    GovernanceProxyCreationBlock,
  )
  const activeValidators = events.reduce<string[]>((acc, { args: e }) => {
    const idx = acc.indexOf(e.validatorAddress)
    if (!e.isActive && idx !== -1) acc.splice(idx, 1)
    if (e.isActive && idx === -1) acc.push(e.validatorAddress)
    return acc
  }, [])
  return activeValidators
}

async function getAdditionalAddress(provider: providers.AlchemyProvider) {
  const additionalAddressPosition = 19 // checked manually in contract code
  const cellValue: string = await provider.getStorageAt(
    Contracts.mainProxy,
    additionalAddressPosition,
  )
  return '0x' + cellValue.slice(-40)
}

export async function run() {
  dotenv.config()
  const alchemyApiKey = process.env.ALCHEMY_API_KEY
  const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)
  const sdk = getMainnetSdk(provider)

  const upgradeable = await getUpgradeableContracts(sdk.upgradeGatekeeper)
  assert.deepEqual(upgradeable, Upgradeable)
  assert.equal(await sdk.upgradeGatekeeper.getMaster(), Contracts.upgradeMaster)
  assert.equal(await sdk.upgradeGatekeeper.mainContract(), Contracts.mainProxy)

  assert.equal(await sdk.governanceProxy.getTarget(), Contracts.governance)
  const governanceProxyMaster = await sdk.governanceProxy.getMaster()
  assert.equal(governanceProxyMaster, Contracts.upgradeGatekeeper)

  assert.equal(await sdk.verifierProxy.getTarget(), Contracts.verifier)
  assert.equal(await sdk.verifierProxy.getMaster(), Contracts.upgradeGatekeeper)

  assert.equal(await sdk.mainProxy.getTarget(), Contracts.main)
  assert.equal(await sdk.mainProxy.getMaster(), Contracts.upgradeGatekeeper)

  const networkGovernor = await sdk.governanceProxy.networkGovernor()
  assert.equal(networkGovernor, Contracts.upgradeMaster)

  const tokenGovernance = await sdk.governanceProxy.tokenGovernance()
  assert.equal(tokenGovernance, Contracts.tokenGovernance)

  assert.deepEqual(await getActiveValidators(sdk.governanceProxy), Validators)

  assert.equal(await sdk.tokenGovernance.treasury(), Treasury)

  assert.deepEqual(await sdk.upgradeMaster.getOwners(), UpgradeMasterOwners)
  assert.equal(await sdk.upgradeMaster.getThreshold(), UpgradeMasterThreshold)

  assert.equal(
    await getAdditionalAddress(provider),
    Contracts.additional,
    'Additional contract differs - this might mean security council has changed!',
  )
}
