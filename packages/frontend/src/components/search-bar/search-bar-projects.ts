import type { Project } from '@l2beat/config'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import { ps } from '~/server/projects'
import type { SearchBarProject } from './search-bar-entry'

export async function getSearchBarProjects(): Promise<SearchBarProject[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'isZkCatalog',
      'isScaling',
      'isBridge',
      'isDaLayer',
      'isUpcoming',
    ],
  })

  const tvs = await get7dTvsBreakdown({ type: 'all' })

  return projects.flatMap((p): SearchBarProject[] => {
    const results: SearchBarProject[] = []
    const common = {
      type: 'project',
      id: p.id,
      name: p.name,
      kind: getKind(p),
      isUpcoming: !!p.isUpcoming,
      iconUrl: `/icons/${p.slug}.png`,
      addedAt: p.addedAt.toNumber(),
      tags: [p.slug],
      tvs: tvs.projects[p.id.toString()]?.breakdown.total ?? 0,
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
          addedAt: p.addedAt.toNumber(),
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
          addedAt: p.addedAt.toNumber(),
        })
      }
    }

    return results
  })
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
