import assert from 'assert'
import dotenv from 'dotenv'
import { providers } from 'ethers'

import {
  Contracts,
  GovernanceProxyCreationBlock,
  Upgradeable,
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

async function getAddressAtPositionInMain(
  provider: providers.AlchemyProvider,
  position: number,
) {
  const cellValue: string = await provider.getStorageAt(
    Contracts.mainProxy,
    position,
  )
  return '0x' + cellValue.slice(-40)
}

async function getVerifierAddress(provider: providers.AlchemyProvider) {
  const position = 5 // checked manually in contract code
  return getAddressAtPositionInMain(provider, position)
}

async function getVerifierExitAddress(provider: providers.AlchemyProvider) {
  const position = 6 // checked manually in contract code
  return getAddressAtPositionInMain(provider, position)
}

async function getGovernanceAddress(provider: providers.AlchemyProvider) {
  const position = 7 // checked manually in contract code
  return getAddressAtPositionInMain(provider, position)
}

async function getPairManagerAddress(provider: providers.AlchemyProvider) {
  const position = 8 // checked manually in contract code
  return getAddressAtPositionInMain(provider, position)
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

  assert.equal(await sdk.verifierExitProxy.getTarget(), Contracts.verifierExit)
  const verifierExitMaster = await sdk.verifierExitProxy.getMaster()
  assert.equal(verifierExitMaster, Contracts.upgradeGatekeeper)

  assert.equal(await sdk.pairManagerProxy.getTarget(), Contracts.pairManager)
  const pairManagerMaster = await sdk.pairManagerProxy.getMaster()
  assert.equal(pairManagerMaster, Contracts.upgradeGatekeeper)

  assert.equal(await sdk.mainProxy.getTarget(), Contracts.main)
  assert.equal(await sdk.mainProxy.getMaster(), Contracts.upgradeGatekeeper)
  assert.equal(
    await sdk.mainProxy.zkSyncCommitBlockAddress(),
    Contracts.zkSyncCommitBlock,
  )
  assert.equal(await sdk.mainProxy.zkSyncExitAddress(), Contracts.zkSyncExit)
  assert.equal(
    await getVerifierAddress(provider),
    Contracts.verifierProxy.toLowerCase(),
  )
  assert.equal(
    await getVerifierExitAddress(provider),
    Contracts.verifierExitProxy.toLowerCase(),
  )
  assert.equal(
    await getGovernanceAddress(provider),
    Contracts.governanceProxy.toLowerCase(),
  )
  assert.equal(
    await getPairManagerAddress(provider),
    Contracts.pairManagerProxy.toLowerCase(),
  )

  const networkGovernor = await sdk.governanceProxy.networkGovernor()
  assert.equal(networkGovernor, Contracts.upgradeMaster)
  const tokenLister = await sdk.governanceProxy.tokenLister()
  assert.equal(tokenLister, Contracts.tokenLister)

  assert.deepEqual(await getActiveValidators(sdk.governanceProxy), Validators)
}
