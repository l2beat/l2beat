import type { ProjectContract } from '@l2beat/config'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import mean from 'lodash/mean'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'

export function getPastUpgradesData(
  contractPastUpgrades: ProjectContract['pastUpgrades'],
  explorerUrl: string,
): TechnologyContract['pastUpgrades'] {
  const pastUpgrades =
    contractPastUpgrades
      ?.sort((a, b) => b.timestamp - a.timestamp)
      .map((upgrade, i) => {
        const previousUpgrade = contractPastUpgrades?.[i + 1]
        return {
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
        }
      }) ?? []

  const lastUpgrade = pastUpgrades[0]
  if (!lastUpgrade) return

  return {
    upgrades: pastUpgrades,
    stats: getPastUpgradesStats(pastUpgrades, lastUpgrade),
  }
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
  lastUpgrade: NonNullable<
    TechnologyContract['pastUpgrades']
  >['upgrades'][number],
) {
  const intervals: number[] = []
  for (let i = 1; i < pastUpgrades.length; i++) {
    const prevUpgrade = pastUpgrades[i - 1]
    const currentUpgrade = pastUpgrades[i]
    if (!prevUpgrade || !currentUpgrade) continue
    intervals.push(prevUpgrade.timestamp - currentUpgrade.timestamp)
  }

  // we want to add the interval from the last upgrade to now
  if (pastUpgrades.length > 1) {
    intervals.push(UnixTime.now() - lastUpgrade.timestamp)
  }

  return {
    count: pastUpgrades.length - 1,
    avgInterval: intervals.length > 0 ? mean(intervals) : null,
    lastInterval:
      pastUpgrades.length > 1 ? UnixTime.now() - lastUpgrade.timestamp : null,
  }
}
