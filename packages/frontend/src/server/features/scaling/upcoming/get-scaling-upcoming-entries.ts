import {
  type Layer2,
  Layer2Provider,
  type Layer3,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getHostChain } from '../utils/get-host-chain'
import { CommonProjectEntry } from '~/types/common-project-entry'
import { FilterableScalingValues, getRaas } from '../get-common-scaling-entry'
import { getCurrentEntry } from '../../utils/get-current-entry'

export function getScalingUpcomingEntries() {
  const projects = [...layer2s, ...layer3s].filter((p) => p.isUpcoming)

  const entries = projects
    .sort((a, b) => {
      assert(
        a.createdAt && b.createdAt,
        'Project has no createdAt although it is upcoming',
      )
      return b.createdAt.toNumber() - a.createdAt.toNumber()
    })
    .map((project) => getScalingUpcomingEntry(project))

  return groupByMainCategories(entries)
}

export interface ScalingUpcomingEntry extends CommonProjectEntry {
  filterable: FilterableScalingValues
  category: ScalingProjectCategory
  provider: Layer2Provider | Layer3Provider | undefined
  purposes: ScalingProjectPurpose[]
}

function getScalingUpcomingEntry(
  project: Layer2 | Layer3,
): ScalingUpcomingEntry {
  return {
    id: project.id,
    basicInfo: {
      name: project.display.name,
      shortName: project.display.shortName,
      nameLine2:
        project.type === 'layer2'
          ? undefined
          : `L3 on ${getHostChain(project)}`,
      slug: project.display.slug,
      href: `/scaling/projects/${project.display.slug}`,
    },
    statuses: {},
    filterable: {
      isRollup: project.display.category.includes('Rollup'),
      type: project.display.category,
      stack: project.display.provider ?? 'No stack',
      stage: 'Not applicable',
      purposes: project.display.purposes,
      hostChain: project.type === 'layer2' ? 'Ethereum' : getHostChain(project),
      daLayer:
        getCurrentEntry(project.dataAvailability)?.layer.value ?? 'Unknown',
      raas: getRaas(project.badges ?? []),
    },
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
  }
}
