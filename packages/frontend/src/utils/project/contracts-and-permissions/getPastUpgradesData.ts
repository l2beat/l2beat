import type { ProjectContract, ProjectContracts } from '@l2beat/config'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import mean from 'lodash/mean'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'

type UpgradeContext = {
  explorerUrl: string
  proxyContract: {
    name?: string
    address: string
  }
}

export interface PastUpgradeProxyContract {
  name?: string
  address: string
  href: string
}

type PastUpgradeWithContext = NonNullable<
  ProjectContract['pastUpgrades']
>[number] &
  UpgradeContext

export function getProjectPastUpgrades(
  contracts: ProjectContracts | undefined,
): PastUpgradeWithContext[] {
  const allPastUpgrades: PastUpgradeWithContext[] = []
  const seenPastUpgrades = new Set<string>()

  for (const contract of Object.values(contracts?.addresses ?? {}).flat()) {
    if (!contract.pastUpgrades || contract.pastUpgrades.length === 0) continue

    for (const upgrade of contract.pastUpgrades) {
      const proxyAddress = ChainSpecificAddress.address(contract.address)
      const explorerUrl = contract.url
        ? new URL(contract.url).origin
        : 'https://etherscan.io'
      const implementationsKey = upgrade.implementations.join(',')
      const key = `${upgrade.transactionHash}-${upgrade.timestamp}-${proxyAddress}-${implementationsKey}`

      if (!seenPastUpgrades.has(key)) {
        seenPastUpgrades.add(key)
        allPastUpgrades.push({
          ...upgrade,
          explorerUrl,
          proxyContract: {
            name: contract.name,
            address: proxyAddress,
          },
        })
      }
    }
  }

  return allPastUpgrades
}

export function getPastUpgradesData(
  contractPastUpgrades: PastUpgradeWithContext[] | undefined,
): PastUpgradesData | undefined {
  const sortedUpgrades = [...(contractPastUpgrades ?? [])].sort(
    (a, b) => b.timestamp - a.timestamp,
  )
  const upgradesByProxy = getUpgradeHistoryByProxy(sortedUpgrades)
  const pastUpgrades = Array.from(upgradesByProxy.values())
    .flatMap((proxyUpgrades) =>
      proxyUpgrades.map((upgrade, index) => {
        const previousUpgrade = proxyUpgrades[index + 1]

        return {
          isInitialDeployment: previousUpgrade === undefined,
          timestamp: upgrade.timestamp,
          transactionHash: {
            hash: upgrade.transactionHash,
            href: `${upgrade.explorerUrl}/tx/${upgrade.transactionHash}`,
          },
          implementations: getImplementations(
            upgrade.explorerUrl,
            upgrade.implementations,
            previousUpgrade,
          ),
          proxyContract: {
            name: upgrade.proxyContract.name,
            address: upgrade.proxyContract.address,
            href: `${upgrade.explorerUrl}/address/${upgrade.proxyContract.address}#code`,
          },
        }
      }),
    )
    .sort((a, b) => b.timestamp - a.timestamp)
  if (pastUpgrades.length === 0) return
  return {
    upgrades: pastUpgrades,
    stats: getPastUpgradesStats(upgradesByProxy),
  }
}

function getUpgradeHistoryByProxy(upgrades: PastUpgradeWithContext[]) {
  const result = new Map<string, PastUpgradeWithContext[]>()

  for (const upgrade of upgrades) {
    const key = upgrade.proxyContract.address
    const existing = result.get(key)
    if (existing) {
      existing.push(upgrade)
    } else {
      result.set(key, [upgrade])
    }
  }

  return result
}

function getImplementations(
  explorerUrl: string,
  implementations: ChainSpecificAddress[],
  pastUpgrade: NonNullable<ProjectContract['pastUpgrades']>[number] | undefined,
) {
  return implementations.map((implementation, index) => {
    const previousImplementation = pastUpgrade?.implementations[index]
    const diffUrl = previousImplementation
      ? `https://disco.l2beat.com/diff/${previousImplementation}/${implementation}`
      : undefined

    return {
      address: ChainSpecificAddress.address(implementation),
      href: `${explorerUrl}/address/${ChainSpecificAddress.address(implementation)}#code`,
      diffUrl,
    }
  })
}

function getPastUpgradesStats(
  upgradesByProxy: Map<string, PastUpgradeWithContext[]>,
) {
  const intervals: number[] = []
  let count = 0
  let lastUpgrade: PastUpgradeWithContext | undefined

  for (const upgrades of upgradesByProxy.values()) {
    count += Math.max(0, upgrades.length - 1)

    const latestProxyUpgrade = upgrades[0]
    if (
      latestProxyUpgrade &&
      (!lastUpgrade || latestProxyUpgrade.timestamp > lastUpgrade.timestamp)
    ) {
      lastUpgrade = latestProxyUpgrade
    }

    for (let i = 1; i < upgrades.length; i++) {
      const prevUpgrade = upgrades[i - 1]
      const currentUpgrade = upgrades[i]
      if (!prevUpgrade || !currentUpgrade) continue
      intervals.push(prevUpgrade.timestamp - currentUpgrade.timestamp)
    }

    // We keep the existing single-contract logic and apply it per proxy.
    if (upgrades.length > 1 && latestProxyUpgrade) {
      intervals.push(UnixTime.now() - latestProxyUpgrade.timestamp)
    }
  }

  return {
    count,
    avgInterval: intervals.length > 0 ? mean(intervals) : null,
    lastInterval:
      count > 0 && lastUpgrade ? UnixTime.now() - lastUpgrade.timestamp : null,
  }
}
