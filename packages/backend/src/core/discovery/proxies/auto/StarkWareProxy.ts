import { Bytes, EthereumAddress, Hash256, ProxyDetection } from '@l2beat/shared'
import { BigNumber, utils } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import {
  getCallResult,
  getCallResultWithRevert,
} from '../../utils/getCallResult'
import { getProxyGovernance } from './StarkWareProxyGovernance'

// keccak256("StarkWare2019.implemntation-slot")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24',
)

async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, IMPLEMENTATION_SLOT),
  )
}

// keccak256("'StarkWare2020.CallProxy.Implemntation.Slot'")
const CALL_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be',
)

async function getCallImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  const callImplementation = bytes32ToAddress(
    await provider.getStorage(address, CALL_IMPLEMENTATION_SLOT),
  )

  if (callImplementation === EthereumAddress.ZERO) return

  return callImplementation
}

// Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot'])
const UPGRADE_DELAY_SLOT = Bytes.fromHex(
  '0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f',
)

async function getUpgradeDelay(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  const value = await provider.getStorage(address, UPGRADE_DELAY_SLOT)
  return BigNumber.from(value.toString()).toNumber()
}

// Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
const FINALIZED_STATE_SLOT = Bytes.fromHex(
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be',
)

async function getFinalizedState(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  return !BigNumber.from(
    (await provider.getStorage(address, FINALIZED_STATE_SLOT)).toString(),
  ).eq(0)
}

async function getDiamondStatus(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  try {
    await getCallResultWithRevert(
      provider,
      address,
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

export async function detectStarkWareProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const [
    callImplementation,
    upgradeDelay,
    isFinal,
    proxyGovernance,
    isDiamond,
  ] = await Promise.all([
    getCallImplementation(provider, address),
    getUpgradeDelay(provider, address),
    getFinalizedState(provider, address),
    getProxyGovernance(provider, address),
    getDiamondStatus(provider, address),
  ])

  if (isDiamond) {
    return await getStarkWareDiamond(
      provider,
      address,
      implementation,
      upgradeDelay,
      isFinal,
      proxyGovernance,
    )
  }

  const relatives = callImplementation ? [callImplementation] : []
  relatives.push(...proxyGovernance)

  return {
    implementations: [implementation],
    relatives,
    upgradeability: {
      type: 'StarkWare proxy',
      implementation,
      callImplementation,
      upgradeDelay,
      isFinal,
      proxyGovernance,
    },
  }
}

const coder = new utils.Interface([
  'event Upgraded(address indexed implementation)',
  'event ImplementationUpgraded(address indexed implementation, bytes initializer)',
])

async function getStarkWareDiamond(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  implementation: EthereumAddress,
  upgradeDelay: number,
  isFinal: boolean,
  proxyGovernance: EthereumAddress[],
): Promise<ProxyDetection> {
  const upgrades = await provider.getLogs(address, [
    [
      coder.getEventTopic('Upgraded'),
      coder.getEventTopic('ImplementationUpgraded'),
    ],
  ])

  const lastUpgrade = upgrades.at(-1)
  if (!lastUpgrade) {
    throw new Error('Diamond without upgrades!?')
  }

  let data: string | undefined

  try {
    const tx = await provider.getTransaction(
      Hash256(lastUpgrade.transactionHash),
    )

    const abi = new utils.Interface([
      'function upgradeTo(address newImplementation, bytes data, bool finalize)',
    ])

    data = abi.decodeFunctionData('upgradeTo', tx.data).data as string
  } catch (e) {
    if (
      lastUpgrade.topics[0] !== coder.getEventTopic('ImplementationUpgraded')
    ) {
      throw e
    }
    console.log(
      'Failed to decode upgradeTo data, falling back to decoding logs parameters',
    )
    data = `0x${lastUpgrade.data.slice(130)}`
  }

  // we subtract 2 for '0x' and 1 for an external initializer contract
  const maxAddresses = Math.floor((data.length - 2) / 64) - 1

  const facets: Record<string, EthereumAddress> = {}
  for (let i = 0; i < maxAddresses; i++) {
    const bytes32 = data.slice(2 + 64 * i, 2 + 64 * (i + 1))
    if (!bytes32.startsWith('0'.repeat(24))) {
      break
    }
    const facet = EthereumAddress('0x' + bytes32.slice(24))
    const name = await getCallResult<string>(
      provider,
      facet,
      'function identify() view returns (string)',
    )
    if (!name) {
      break
    }
    facets[name] = facet
  }

  return {
    implementations: [implementation, ...Object.values(facets)],
    relatives: proxyGovernance,
    upgradeability: {
      type: 'StarkWare diamond',
      implementation,
      upgradeDelay,
      isFinal,
      facets,
      proxyGovernance,
    },
  }
}
