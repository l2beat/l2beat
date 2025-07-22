import {
  assert,
  Bytes,
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, type providers, utils } from 'ethers'
import { parseSemver, type Semver } from '../../../utils/semver'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { DateAddresses } from '../pastUpgrades'
import type { ProxyDetails } from '../types'
import { getProxyGovernance } from './StarkWareProxyGovernance'

// keccak256("StarkWare2019.implementation-slot")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24',
)

// keccak256("'StarkWare2020.CallProxy.Implementation.Slot'")
const CALL_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be',
)

async function getCallImplementation(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const callImplementation = await provider.getStorageAsAddress(
    address,
    CALL_IMPLEMENTATION_SLOT,
  )

  if (callImplementation === ChainSpecificAddress.ZERO(provider.chain)) return

  return callImplementation
}

// Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot'])
const UPGRADE_DELAY_SLOT = Bytes.fromHex(
  '0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f',
)

async function getUpgradeDelay(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<number> {
  const value = await provider.getStorage(address, UPGRADE_DELAY_SLOT)
  return BigNumber.from(value.toString()).toNumber()
}

// Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
const FINALIZED_STATE_SLOT = Bytes.fromHex(
  '0x7d433c6f837e8f93009937c466c82efbb5ba621fae36886d0cac433c5d0aa7d2',
)

async function getFinalizedState(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<boolean> {
  const stored = await provider.getStorage(address, FINALIZED_STATE_SLOT)
  return !BigNumber.from(stored.toString()).eq(0)
}

async function getProxyVersion(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<Semver | undefined> {
  const versionString = await provider.callMethod<string>(
    address,
    'function PROXY_VERSION() view returns (string)',
    [],
  )

  if (!versionString) {
    // NOTE(radomski): Early proxies do not have the PROXY_VERSION variable in
    // their source code. For example
    // https://etherscan.io/address/0xD54f502e184B6B739d7D27a6410a67dc462D69c8
    // does not include it. If we treat is as lower than 5.0.0 it's going to
    // pass fine through everything else
    return {
      major: 1,
      minor: 0,
      patch: 0,
    }
  }

  return parseSemver(versionString)
}

const abi = new utils.Interface([
  'event Upgraded(address indexed implementation)',
  'event ImplementationUpgraded(address indexed implementation, bytes initializer)',
  'event ImplementationAdded(address indexed implementation, bytes initializer, bool finalize)',
])

async function getPastProxyUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<DateAddresses[]> {
  const logs = await provider.getLogs(address, [
    [
      abi.getEventTopic('Upgraded'),
      abi.getEventTopic('ImplementationUpgraded'),
    ],
  ])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  return logs.map((l) => {
    const implementation = ChainSpecificAddress.fromLong(
      provider.chain,
      abi.parseLog(l).args.implementation,
    )
    return [
      dateMap[l.blockNumber] ?? 'ERROR',
      Hash256(l.transactionHash),
      [implementation],
    ]
  })
}

export async function detectStarkWareProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.getStorageAsAddress(
    address,
    IMPLEMENTATION_SLOT,
  )
  if (implementation === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }

  const proxyVersion = await getProxyVersion(provider, address)
  if (!proxyVersion) {
    return undefined
  }

  const [callImplementation, upgradeDelay, isFinal, proxyGovernance] =
    await Promise.all([
      getCallImplementation(provider, address),
      getUpgradeDelay(provider, address),
      getFinalizedState(provider, address),
      getProxyGovernance(provider, address, proxyVersion),
    ])

  const diamond = await getStarkWareDiamond(
    provider,
    address,
    implementation,
    upgradeDelay,
    isFinal,
    proxyGovernance,
  )

  if (diamond) {
    return diamond
  }
  const relatives = callImplementation ? [callImplementation] : []
  relatives.push(...proxyGovernance)
  const pastUpgrades = await getPastProxyUpgrades(provider, address)

  return {
    type: 'StarkWare proxy',
    values: {
      $immutable: isFinal,
      $admin: proxyGovernance.map((g) => g.toString()),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
      StarkWareProxy_callImplementation: callImplementation?.toString(),
      // TODO: (sz-piotr) should be a property of the $admin permission
      StarkWareProxy_upgradeDelay: upgradeDelay,
    },
  }
}

async function getPastDiamondUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<DateAddresses[]> {
  const logs = await provider.getLogs(address, [
    [
      abi.getEventTopic('Upgraded'),
      abi.getEventTopic('ImplementationUpgraded'),
    ],
  ])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  return await Promise.all(
    logs.map(async (l) => {
      const implementation = ChainSpecificAddress.fromLong(
        provider.chain,
        abi.parseLog(l).args.implementation,
      )
      const facets = await getStarkWareDiamondFacets(provider, address, l)
      assert(facets !== false)

      return [
        dateMap[l.blockNumber] ?? 'ERROR',
        Hash256(l.transactionHash),
        [implementation, ...Object.values(facets)],
      ]
    }),
  )
}

async function getStarkWareDiamondFacets(
  provider: IProvider,
  address: ChainSpecificAddress,
  lastUpgrade: providers.Log,
) {
  let data: string | undefined

  try {
    const tx = await provider.getTransaction(
      Hash256(lastUpgrade.transactionHash),
    )
    if (!tx) {
      return false
    }

    const abi = new utils.Interface([
      'function upgradeTo(address newImplementation, bytes data, bool finalize)',
    ])

    data = abi.decodeFunctionData('upgradeTo', tx.data).data as string
  } catch (e) {
    if (
      !(e instanceof Error) ||
      !e.message.includes('data signature does not match function upgradeTo.')
    ) {
      throw e
    }

    if (lastUpgrade.topics[0] === abi.getEventTopic('Upgraded')) {
      // dydx uses the Upgraded event with governance
      // so we cannot get the info from their tx data
      // we need to find the ImplementationAdded event that holds the initializer
      const implementationsAdded = await provider.getLogs(address, [
        abi.getEventTopic('ImplementationAdded'),
      ])
      const correspondingImplementationAdded = implementationsAdded.find(
        (log) => {
          return log.topics[1] === lastUpgrade.topics[1]
        },
      )

      if (!correspondingImplementationAdded) {
        throw new Error(
          'Failed to find corresponding ImplementationAdded event',
        )
      }

      data = `0x${correspondingImplementationAdded.data.slice(194)}`
    } else {
      data = `0x${lastUpgrade.data.slice(130)}`
    }
  }

  // we subtract 2 for '0x' and 1 for an external initializer contract
  const maxAddresses = Math.floor((data.length - 2) / 64) - 1

  const facets: Record<string, ChainSpecificAddress> = {}
  for (let i = 0; i < maxAddresses; i++) {
    const bytes32 = data.slice(2 + 64 * i, 2 + 64 * (i + 1))
    if (!bytes32.startsWith('0'.repeat(24))) {
      break
    }
    const facet = ChainSpecificAddress.fromLong(
      provider.chain,
      '0x' + bytes32.slice(24),
    )
    const name = await provider.callMethod<string>(
      facet,
      'function identify() view returns (string)',
      [],
    )
    if (!name) {
      break
    }
    facets[name] = facet
  }

  return facets
}

// if returns false, it means that the proxy is not a StarkWare diamond
async function getStarkWareDiamond(
  provider: IProvider,
  address: ChainSpecificAddress,
  implementation: ChainSpecificAddress,
  upgradeDelay: number,
  isFinal: boolean,
  proxyGovernance: ChainSpecificAddress[],
): Promise<ProxyDetails | false> {
  // TODO: (sz-piotr) new provider Promise.all
  const upgrades = await provider.getLogs(address, [
    [
      abi.getEventTopic('Upgraded'),
      abi.getEventTopic('ImplementationUpgraded'),
    ],
  ])

  const lastUpgrade = upgrades.at(-1)
  if (!lastUpgrade) {
    return false
  }

  const facets = await getStarkWareDiamondFacets(provider, address, lastUpgrade)
  if (Object.keys(facets).length <= 1) {
    // no facets found, this is not a StarkWare diamond
    // 1 facet is the implementation itself
    // and could mean that it's a callProxy
    return false
  }

  const implementations = [implementation, ...Object.values(facets)]
  const pastUpgrades = await getPastDiamondUpgrades(provider, address)

  return {
    type: 'StarkWare diamond',
    values: {
      $immutable: isFinal,
      $admin: proxyGovernance.map((g) => g.toString()),
      $implementation: implementations.map((i) => i.toString()),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
      // TODO: (sz-piotr) should be a property of the $admin permission
      StarkWareDiamond_upgradeDelay: upgradeDelay,
    },
  }
}
