import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { get$Admins, get$Implementations } from '../../utils/extractors'
import { detectEip1967Proxy, getImplementation } from '../auto/Eip1967Proxy'
import type { DateAddresses } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

export async function getZkLighterProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const managed = await getZkLighterManagedProxy(provider, address)
  if (managed === undefined) {
    return undefined
  }
  const additional = await provider.getStorageAsAddress(address, 7)

  return {
    type: 'zkLighter proxy',
    values: {
      ...managed.values,
      $implementation: get$Implementations(managed.values)
        .concat(additional)
        .map((i) => i.toString()),
    },
  }
}

const MAX_MANAGED_CONTRACTS = 32

// A zkLighter Proxy upgrades silently: upgradeTarget emits no event. Its
// master, the UpgradeGatekeeper, emits UpgradeComplete with one new target per
// managed contract.
export async function getZkLighterManagedProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.type !== 'EIP1967 proxy') {
    return undefined
  }
  const [master, ...rest] = get$Admins(detection.values)
  assert(master !== undefined && rest.length === 0, 'one master')
  const pastUpgrades = await getPastUpgrades(provider, address, master)

  return {
    type: 'zkLighter managed proxy',
    values: {
      $admin: master.toString(),
      $implementation: get$Implementations(detection.values).map((i) =>
        i.toString(),
      ),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}

async function getPastUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
  master: ChainSpecificAddress,
): Promise<DateAddresses[]> {
  const deployment = await provider.getDeployment(address)
  const initialization: DateAddresses[] =
    deployment === undefined
      ? []
      : [
          [
            UnixTime.toDate(deployment.timestamp).toISOString(),
            deployment.transactionHash,
            [
              await getImplementation(
                await provider.switchBlock(deployment.blockNumber),
                address,
              ),
            ],
          ],
        ]

  const index = await getManagedIndex(provider, master, address)
  if (index === undefined) {
    return initialization
  }
  const abi = new utils.Interface([
    'event UpgradeComplete(uint256 indexed versionId, address[] newTargets)',
  ])
  const logs = await provider.getLogs(master, [
    abi.getEventTopic('UpgradeComplete'),
  ])
  const upgrades = await Promise.all(
    logs.map(async (log): Promise<DateAddresses | undefined> => {
      const targets: string[] = abi.parseLog(log).args.newTargets
      const target = targets[index]
      if (
        target === undefined ||
        EthereumAddress(target) === EthereumAddress.ZERO
      ) {
        return undefined
      }
      const block = await provider.getBlock(log.blockNumber)
      assert(block !== undefined)
      return [
        UnixTime.toDate(UnixTime(block.timestamp)).toISOString(),
        Hash256(log.transactionHash),
        [ChainSpecificAddress.fromLong(provider.chain, target)],
      ]
    }),
  )
  return [...initialization, ...upgrades.filter((u) => u !== undefined)]
}

async function getManagedIndex(
  provider: IProvider,
  master: ChainSpecificAddress,
  address: ChainSpecificAddress,
): Promise<number | undefined> {
  // managedContracts is a public array: its getter reverts past the end
  for (let index = 0; index < MAX_MANAGED_CONTRACTS; index++) {
    const managed = await provider.callMethod<EthereumAddress>(
      master,
      'function managedContracts(uint256) view returns (address)',
      [index],
    )
    if (managed === undefined) {
      return undefined
    }
    if (ChainSpecificAddress.fromLong(provider.chain, managed) === address) {
      return index
    }
  }
  return undefined
}
