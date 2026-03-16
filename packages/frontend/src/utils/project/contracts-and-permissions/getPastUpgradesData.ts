import type { ProjectContract, ProjectContracts } from '@l2beat/config'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import mean from 'lodash/mean'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'

type UpgradeContext = {
  proxyContract?: {
    name?: string
    address: string
  }
}

export interface PastUpgradeProxyContract {
  name?: string
  address: string
  href: string
}

export interface PastUpgradeLabels {
  proxyContract: string
  implementations: string
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
      const key = `${upgrade.transactionHash}-${upgrade.timestamp}-${proxyAddress}`

      if (!seenPastUpgrades.has(key)) {
        seenPastUpgrades.add(key)
        allPastUpgrades.push({
          ...upgrade,
          proxyContract: {
            name: contract.name,
            address: proxyAddress,
          },
        })
      }
    }
  }

  return allPastUpgrades.sort((a, b) => b.timestamp - a.timestamp)
}

export function getPastUpgradesData(
  contractPastUpgrades: PastUpgradeWithContext[] | undefined,
  explorerUrl: string,
  labels?: PastUpgradeLabels,
): TechnologyContract['pastUpgrades'] {
  const sortedUpgrades = [...(contractPastUpgrades ?? [])].sort(
    (a, b) => b.timestamp - a.timestamp,
  )
  const upgradesByProxy = getUpgradeHistoryByProxy(sortedUpgrades)
  const upgradesByProxyIndex = new Map<string, number>()

  const pastUpgrades = sortedUpgrades.map((upgrade) => {
    const proxyKey = getProxyKey(upgrade)
    const currentProxyIndex = upgradesByProxyIndex.get(proxyKey) ?? 0
    const previousUpgrade =
      upgradesByProxy.get(proxyKey)?.[currentProxyIndex + 1]
    upgradesByProxyIndex.set(proxyKey, currentProxyIndex + 1)
    const proxyAddress = upgrade.proxyContract?.address
    return {
      isInitialDeployment: previousUpgrade === undefined,
      timestamp: upgrade.timestamp,
      transactionHash: {
        hash: upgrade.transactionHash,
        href: `${explorerUrl}/tx/${upgrade.transactionHash}`,
      },
      implementations: getImplementations(
        explorerUrl,
        upgrade.implementations,
        previousUpgrade,
      ),
      proxyContract: proxyAddress
        ? {
          name: upgrade.proxyContract?.name,
          address: proxyAddress,
          href: `${explorerUrl}/address/${proxyAddress}#code`,
        }
        : undefined,
    }
  })

  const lastUpgrade = pastUpgrades[0]
  if (!lastUpgrade) return

  return {
    upgrades: pastUpgrades,
    stats: getPastUpgradesStats(pastUpgrades),
    labels: labels ?? {
      proxyContract: 'Proxy contract',
      implementations: 'Implementation addresses',
    },
  }
}

function getUpgradeHistoryByProxy(upgrades: PastUpgradeWithContext[]) {
  const result = new Map<string, PastUpgradeWithContext[]>()

  for (const upgrade of upgrades) {
    const key = getProxyKey(upgrade)
    const existing = result.get(key)
    if (existing) {
      existing.push(upgrade)
    } else {
      result.set(key, [upgrade])
    }
  }

  return result
}

function getProxyKey(upgrade: UpgradeContext) {
  return upgrade.proxyContract?.address ?? '__single-contract__'
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
  pastUpgrades: NonNullable<TechnologyContract['pastUpgrades']>['upgrades'],
) {
  const intervals: number[] = []
  let count = 0
  let lastUpgrade: (typeof pastUpgrades)[number] | undefined

  const upgradesByProxy = new Map<string, typeof pastUpgrades>()
  for (const upgrade of pastUpgrades) {
    const key = getProxyKey(upgrade)
    const existing = upgradesByProxy.get(key)
    if (existing) {
      existing.push(upgrade)
    } else {
      upgradesByProxy.set(key, [upgrade])
    }
  }

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
