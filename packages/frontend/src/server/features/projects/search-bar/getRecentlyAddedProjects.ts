import type { Project } from '@l2beat/config'
import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'

export async function getRecentlyAddedProjects(): Promise<SearchBarProject[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'isZkCatalog',
      'isScaling',
      'isDaLayer',
      'isBridge',
    ],
    whereNot: ['isUpcoming'],
  })

  return projects
    .sort((a, b) => b.addedAt - a.addedAt)
    .flatMap((p): SearchBarProject[] => {
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
        isUpcoming: false,
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
    .slice(0, 15)
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
