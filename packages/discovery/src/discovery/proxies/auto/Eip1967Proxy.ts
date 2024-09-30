import { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { DateAddresses } from '../pastUpgrades'

// keccak256('eip1967.proxy.implementation') - 1)
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
)

export function getImplementation(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  return provider.getStorageAsAddress(address, IMPLEMENTATION_SLOT)
}

// keccak256('eip1967.proxy.admin') - 1)
const ADMIN_SLOT = Bytes.fromHex(
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
)

export function getAdmin(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  return provider.getStorageAsAddress(address, ADMIN_SLOT)
}

export async function getOwner(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const result = await provider.callMethod<EthereumAddress>(
    address,
    'function owner() view returns (address)',
    [],
  )
  return result ?? EthereumAddress.ZERO
}

export async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event Upgraded(address indexed implementation)',
  ])
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('Upgraded')],
  ])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [
      b.number,
      new UnixTime(b.timestamp).toDate().toISOString(),
    ]),
  )

  return logs.map((l) => {
    const implementation = abi.parseLog(l).args.implementation
    return [dateMap[l.blockNumber] ?? 'ERROR', [implementation]]
  })
}

export async function detectEip1967Proxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const pastUpgrades = await getPastUpgrades(provider, address)
  let admin = await getAdmin(provider, address)
  // TODO: (sz-piotr) potential for errors
  if (admin === EthereumAddress.ZERO) {
    admin = await getOwner(provider, address)
  }
  return {
    type: 'EIP1967 proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
