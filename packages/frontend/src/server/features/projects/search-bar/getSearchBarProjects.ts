import type { Project } from '@l2beat/config'
import fuzzysort from 'fuzzysort'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import { getLogger } from '../../../utils/logger'
import type { SearchBarProject } from './types'

export async function getSearchBarProjects(
  search: string,
): Promise<SearchBarProject[]> {
  const logger = getLogger().for('getSearchBarProjects')

  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'isZkCatalog',
      'isScaling',
      'isDaLayer',
      'isBridge',
      'isUpcoming',
    ],
  })

  const searchBarProjects = projects.flatMap((p): SearchBarProject[] => {
    const results: SearchBarProject[] = []
    if (
      !p.isZkCatalog &&
      !p.isScaling &&
      !p.isBridge &&
      !p.daLayer &&
      !p.daBridge
    ) {
      return []
    }

    const common = {
      type: 'project',
      id: p.id,
      name: p.name,
      iconUrl: getProjectIcon(p.slug),
      kind: getKind(p),
      isUpcoming: !!p.isUpcoming,
      tags: [p.slug],
    } satisfies Partial<SearchBarProject>

    if (p.isZkCatalog) {
      results.push({
        ...common,
        id: `${p.id}-zk-catalog`,
        href: `/zk-catalog/${p.slug}`,
        category: 'zkCatalog',
      })
    }

    if (p.isScaling) {
      results.push({
        ...common,
        href: `/scaling/projects/${p.slug}`,
        category: 'scaling',
        scalingCategory: p.scalingInfo?.type,
      })
    }

    if (p.isBridge) {
      results.push({
        ...common,
        href: `/bridges/projects/${p.slug}`,
        category: 'bridges',
      })
    }

    if (p.daLayer) {
      if (p.daLayer.usedWithoutBridgeIn.length > 0) {
        results.push({
          ...common,
          id: `${p.id}-no-bridge`,
          name: `${p.name} without a DA bridge`,
          href: `/data-availability/projects/${p.slug}/no-bridge`,
          category: 'da',
          tags: [p.slug, 'no-bridge'],
        })
      }
    }

    if (p.daBridge) {
      const layer = projects.find((x) => x.id === p.daBridge?.daLayer)
      if (layer) {
        results.push({
          ...common,
          id: `${layer.id}-${p.id}`,
          name: `${layer.name} with ${p.daBridge.name}`,
          href: `/data-availability/projects/${layer.slug}/${p.slug}`,
          category: 'da',
          tags: [layer.slug, p.slug],
        })
      }
    }

    return results
  })

  const result = fuzzysort
    .go(search, searchBarProjects, {
      limit: 15,
      keys: ['name', (e) => e.tags?.join() ?? ''],
      scoreFn: (match) =>
        match.score * (match.obj.category === 'zkCatalog' ? 0.9 : 1),
    })
    .map((match) => match.obj)

  logger.info('Search bar projects result', {
    search,
    projectIds: result.map((r) => r.id),
  })
  return result
}

function getKind(
  p: Project<never, 'scalingInfo' | 'isBridge' | 'isZkCatalog' | 'isDaLayer'>,
): SearchBarProject['kind'] {
  if (p.scalingInfo?.layer === 'layer2') return 'layer2'
  if (p.scalingInfo?.layer === 'layer3') return 'layer3'
  if (p.isBridge) return 'bridge'
  if (p.isZkCatalog) return 'zkCatalog'
  if (p.isDaLayer) return 'da'
  // Should never happen
  return 'da'
}
