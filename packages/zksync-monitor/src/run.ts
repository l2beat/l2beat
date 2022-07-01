import assert from 'assert'
import dotenv from 'dotenv'
import { Contract, providers, utils } from 'ethers'

import gnosisSafeAbi from './abi/gnosisSafe.json'
import governanceAbi from './abi/governance.json'
import proxyAbi from './abi/proxy.json'
import tokenGovernanceAbi from './abi/tokenGovernance.json'
import upgradeGatekeeperAbi from './abi/upgradeGatekeeper.json'

const CONTRACTS = {
  upgradeGatekeeper: '0x38A43F4330f24fe920F943409709fc9A6084C939', // extracted from https://ethtx.info/tx/0x21dfeea6c82d47203f91aba30af5e5ef3d623aa8206596fbd8c466a5b1586f02/
  upgradeMaster: '0xE24f4870Ab85DE8E356C5fC56138587206c70d99',
  verifierProxy: '0x5290E9582B4FB706EaDf87BB1c129e897e04d06D',
  verifier: '0xf7Bd436a05678B647D74a88ffcf4445Efc43BDfC',
  mainProxy: '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF',
  main: '0x59a5E7c08be8356193Cd9F92CA8Ac95C42aB0Bdd',
  governanceProxy: '0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01',
  governance: '0x934ef5836E78d93125317034f5CF855A97B13f43',
  tokenGovernance: '0x35cc31f63deef017c38d51B038891bAE7d614e86',
  additional: '0x080812701c94087f1dee425ebd7cbf9efaf878e2', // security council hardcoded in code
}
const ACTIVE_VALIDATORS = ['0x18c208921F7a741510a7fc0CfA51E941735DAE54']
const UPGRADEABLE_CONTRACTS = [
  CONTRACTS.governanceProxy,
  CONTRACTS.verifierProxy,
  CONTRACTS.mainProxy,
]
const TREASURY = '0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027'
const UPGRADE_MASTER_OWNERS = [
  '0xA5F3C860441c0EeD02BF8A6472AF32B68884b0FF',
  '0x474D2b82E02D9712A077574E7764dEfA182653D4',
  '0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607',
  '0x9dF8bc0918F357c766A5697E031fF5237c05747A',
  '0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc',
  '0xa265146cA40F52cfC439888D0b4291b5440e6769',
]
const UPGRADE_MASTER_THRESHOLD = 3

async function getProxyAddresses(
  provider: providers.AlchemyProvider,
  address: string,
) {
  const contract = new Contract(address, proxyAbi, provider)
  // eslint-disable-next-line
  const target: string = await contract.getTarget()
  // eslint-disable-next-line
  const master: string = await contract.getMaster()
  return { target, master }
}

async function getGatekeeperAddresses(provider: providers.AlchemyProvider) {
  const contract = new Contract(
    CONTRACTS.upgradeGatekeeper,
    upgradeGatekeeperAbi,
    provider,
  )
  let shouldContinue = true
  const managed: string[] = []
  for (let i = 0; shouldContinue; ++i) {
    try {
      // eslint-disable-next-line
      const address: string = await contract.managedContracts(i)
      managed.push(address)
    } catch {
      shouldContinue = false
    }
  }
  // eslint-disable-next-line
  const mainProxy: string = await contract.mainContract()
  // eslint-disable-next-line
  const upgradeMaster: string = await contract.getMaster()
  return { mainProxy, upgradeMaster, managed }
}

async function getGovernanceAddresses(provider: providers.AlchemyProvider) {
  const contract = new Contract(
    CONTRACTS.governanceProxy,
    governanceAbi,
    provider,
  )
  // eslint-disable-next-line
  const governor: string = await contract.networkGovernor()
  // eslint-disable-next-line
  const tokenGovernance: string = await contract.tokenGovernance()

  const abi = new utils.Interface([
    'event ValidatorStatusUpdate(address indexed validatorAddress, bool isActive)',
  ])
  const logs = await provider.getLogs({
    fromBlock: 10269890,
    toBlock: 'latest',
    address: CONTRACTS.governanceProxy,
    topics: [abi.getEventTopic('ValidatorStatusUpdate')],
  })
  const events = logs.map((log) => abi.parseLog(log))
  const activeValidators = events
    .map((event) => ({
      address: String(event.args.validatorAddress),
      active: Boolean(event.args.isActive),
    }))
    .reduce<string[]>((acc, v) => {
      const idx = acc.indexOf(v.address)
      if (!v.active && idx !== -1) acc.splice(idx, 1)
      if (v.active && idx === -1) acc.push(v.address)
      return acc
    }, [])

  return { governor, tokenGovernance, activeValidators }
}

async function getTreasuryAddress(provider: providers.AlchemyProvider) {
  const contract = new Contract(
    CONTRACTS.tokenGovernance,
    tokenGovernanceAbi,
    provider,
  )
  // eslint-disable-next-line
  const treasury: string = await contract.treasury()
  return treasury
}

async function getUpgradeMasterAddresses(provider: providers.AlchemyProvider) {
  const contract = new Contract(
    CONTRACTS.upgradeMaster,
    gnosisSafeAbi,
    provider,
  )
  // eslint-disable-next-line
  const owners: string[] = await contract.getOwners()
  // eslint-disable-next-line
  const threshold: number = (await contract.getThreshold()).toNumber()
  return { owners, threshold }
}

async function getAdditionalAddress(provider: providers.AlchemyProvider) {
  const additionalAddressPosition = 19 // checked manually in contract code
  const cellValue: string = await provider.getStorageAt(
    CONTRACTS.mainProxy,
    additionalAddressPosition,
  )
  return '0x' + cellValue.slice(-40)
}

export async function run() {
  dotenv.config()
  const alchemyApiKey = process.env.ALCHEMY_API_KEY
  const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)

  const gatekeeperAddresses = await getGatekeeperAddresses(provider)
  assert.deepEqual(gatekeeperAddresses.managed, UPGRADEABLE_CONTRACTS)
  assert.equal(gatekeeperAddresses.mainProxy, CONTRACTS.mainProxy)
  assert.equal(gatekeeperAddresses.upgradeMaster, CONTRACTS.upgradeMaster)
  assert.deepEqual(
    await getProxyAddresses(provider, CONTRACTS.governanceProxy),
    { target: CONTRACTS.governance, master: CONTRACTS.upgradeGatekeeper },
  )
  assert.deepEqual(await getProxyAddresses(provider, CONTRACTS.verifierProxy), {
    target: CONTRACTS.verifier,
    master: CONTRACTS.upgradeGatekeeper,
  })
  assert.deepEqual(await getProxyAddresses(provider, CONTRACTS.mainProxy), {
    target: CONTRACTS.main,
    master: CONTRACTS.upgradeGatekeeper,
  })
  assert.deepEqual(await getGovernanceAddresses(provider), {
    governor: CONTRACTS.upgradeMaster,
    tokenGovernance: CONTRACTS.tokenGovernance,
    activeValidators: ACTIVE_VALIDATORS,
  })
  assert.equal(await getTreasuryAddress(provider), TREASURY)
  assert.deepEqual(await getUpgradeMasterAddresses(provider), {
    owners: UPGRADE_MASTER_OWNERS,
    threshold: UPGRADE_MASTER_THRESHOLD,
  })
  assert.equal(
    await getAdditionalAddress(provider),
    CONTRACTS.additional,
    'Additional contract differs - this might mean security council has changed!',
  )
}
