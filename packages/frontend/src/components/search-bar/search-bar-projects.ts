import { type Project, ProjectService } from '@l2beat/config'
import { type SearchBarProject } from './search-bar-entry'

export async function getSearchBarProjects(): Promise<SearchBarProject[]> {
  const projects = await ProjectService.STATIC.getProjects({
    optional: [
      'scalingInfo',
      'daBridges',
      'isZkCatalog',
      'isScaling',
      'isBridge',
      'isDaLayer',
      'isUpcoming',
    ],
  })

  return projects.flatMap((p): SearchBarProject[] => {
    const results: SearchBarProject[] = []
    const common = {
      type: 'project',
      id: p.id,
      name: p.name,
      kind: getKind(p),
      isUpcoming: !!p.isUpcoming,
      iconUrl: `/icons/${p.slug}.png`,
      createdAt: p.addedAt.toNumber(),
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
      })
    }

    if (p.isBridge) {
      results.push({
        ...common,
        href: `/bridges/projects/${p.slug}`,
        category: 'bridges',
      })
    }

    if (p.daBridges) {
      for (const b of p.daBridges) {
        results.push({
          ...common,
          id: `${p.id}-${b.id}`,
          name: b.type === 'DAC' ? p.name : `${p.name} with ${b.display.name}`,
          href: `/data-availability/projects/${p.slug}/${b.display.slug}`,
          category: 'da',
          tags: [p.slug, b.display.slug],
          createdAt: b.createdAt.toNumber(),
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
