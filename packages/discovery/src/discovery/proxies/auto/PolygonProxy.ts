import { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { DateAddresses } from '../pastUpgrades'

// keccak256("matic.network.proxy.implementation")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0xbaab7dbf64751104133af04abc7d9979f0fda3b059a322a8333f533d3f32bf7f',
)

// keccak256("matic.network.proxy.owner")
const ADMIN_SLOT = Bytes.fromHex(
  '0x44f6e2e8884cba1236b7f22f351fa5d88b17292b7e0225ca47e5ecdf6055cdd6',
)

export async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event ProxyUpdated(address indexed implementation, address indexed _old)',
  ])
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('ProxyUpdated')],
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

export async function detectPolygonProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.getStorageAsAddress(
    address,
    IMPLEMENTATION_SLOT,
  )
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await provider.getStorageAsAddress(address, ADMIN_SLOT)
  const pastUpgrades = await getPastUpgrades(provider, address)
  return {
    type: 'Polygon proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
