import { BigNumber, constants, Contract, providers, utils } from 'ethers'

import { bytes32ToAddress } from '../address'
import { getCallResult, getCallResultWithRevert } from '../getCallResult'
import { getStorage } from '../getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

// keccak256("StarkWare2019.implemntation-slot")
const IMPLEMENTATION_SLOT =
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, IMPLEMENTATION_SLOT),
  )
}

// keccak256("'StarkWare2020.CallProxy.Implemntation.Slot'")
const CALL_IMPLEMENTATION_SLOT =
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'

async function getCallImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, CALL_IMPLEMENTATION_SLOT),
  )
}

// Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot'])
const UPGRADE_DELAY_SLOT =
  '0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f'

async function getUpgradeDelay(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const value = await getStorage(provider, contract, UPGRADE_DELAY_SLOT)
  return BigNumber.from(value).toNumber()
}

// Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
const FINALIZED_STATE_SLOT =
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'

async function getFinalizedState(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return !BigNumber.from(
    await getStorage(provider, contract, FINALIZED_STATE_SLOT),
  ).eq(0)
}

async function getDiamondStatus(
  provider: providers.Provider,
  contract: Contract | string,
) {
  try {
    await getCallResultWithRevert(
      provider,
      contract,
      'function nonExistentMethodName() view returns (uint)',
    )
    // This should actually never succeed
    return false
  } catch (e) {
    return (
      e instanceof Error && e.message.includes('"NO_CONTRACT_FOR_FUNCTION"')
    )
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === constants.AddressZero) {
    return
  }
  const [callImplementation, upgradeDelay, isFinal, isDiamond] =
    await Promise.all([
      getCallImplementation(provider, address),
      getUpgradeDelay(provider, address),
      getFinalizedState(provider, address),
      getDiamondStatus(provider, address),
    ])

  if (isDiamond) {
    console.log('StarkWare diamond detected for', address)
    return await getStarkWareDiamond(
      provider,
      address,
      implementation,
      upgradeDelay,
      isFinal,
    )
  }

  return {
    implementations:
      callImplementation !== constants.AddressZero
        ? [implementation, callImplementation]
        : [implementation],
    relatives: [],
    upgradeability: {
      type: 'StarkWare proxy',
      implementation,
      callImplementation,
      upgradeDelay,
      isFinal,
    },
  }
}

async function getStarkWareDiamond(
  provider: providers.Provider,
  address: string,
  implementation: string,
  upgradeDelay: number,
  isFinal: boolean,
): Promise<ProxyDetection> {
  const upgrades = await provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address,
    topics: [
      // Upgraded (address indexed implementation)
      '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
    ],
  })

  const lastUpgrade = upgrades.at(-1)?.transactionHash
  if (!lastUpgrade) {
    throw new Error('Diamond without upgrades!?')
  }

  const tx = await provider.getTransaction(lastUpgrade)
  console.log('Got last upgrade data')

  const abi = new utils.Interface([
    'function upgradeTo(address newImplementation, bytes data, bool finalize)',
  ])
  const data = abi.decodeFunctionData('upgradeTo', tx.data).data as string

  // we subtract 2 for '0x' and 1 for an external initializer contract
  const maxAddresses = Math.floor((data.length - 2) / 64) - 1

  const facets: Record<string, string> = {}
  for (let i = 0; i < maxAddresses; i++) {
    const bytes32 = data.slice(2 + 64 * i, 2 + 64 * (i + 1))
    if (!bytes32.startsWith('0'.repeat(24))) {
      break
    }
    const facet = utils.getAddress('0x' + bytes32.slice(24))
    const name = await getCallResult<string>(
      provider,
      facet,
      'function identify() view returns (string)',
    )
    if (!name) {
      break
    }
    console.log(`${address}.${name} =`, facet)
    facets[name] = facet
  }

  return {
    implementations: [implementation, ...Object.values(facets)],
    relatives: [],
    upgradeability: {
      type: 'StarkWare diamond',
      implementation,
      upgradeDelay,
      isFinal,
      facets,
    },
  }
}

export const StarkWareProxy = {
  getImplementation,
  getCallImplementation,
  getUpgradeDelay,
  ...extendDetect(detect),
}
