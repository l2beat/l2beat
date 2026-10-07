import { INTEROP_CHAINS } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getSovereignProjects } from './attribute'

/** A project that posts blobs to Ethereum, as the live view draws it */
export interface BlobPoster {
  id: string
  name: string
  /** Sovereign chains have no icon of their own, nor a page */
  iconUrl: string | undefined
  color: string
  href: string | undefined
}

/**
 * Every active rollup that posts its data to Ethereum, and the sovereign
 * chains Ethereum's own config tracks, which have no project of their own
 */
export async function getBlobPosters(): Promise<BlobPoster[]> {
  const [projects, sovereign] = await Promise.all([
    ps.getProjects({
      select: ['daTrackingConfig', 'scalingInfo'],
      optional: ['colors'],
      whereNot: ['archivedAt'],
    }),
    getSovereignProjects(),
  ])
  return [
    ...projects
      .filter((p) =>
        p.daTrackingConfig.some((c) => c.daLayer === ProjectId.ETHEREUM),
      )
      .map((p) => ({
        id: p.id,
        name: p.shortName ?? p.name,
        iconUrl: manifest.getUrl(`/icons/${p.slug}.png`),
        color: getColor(p),
        href: `/layer2s/projects/${p.slug}`,
      })),
    ...sovereign
      .filter((p) => p.daTrackingConfig.some((c) => c.type === 'ethereum'))
      .map((p) => ({
        id: p.id,
        name: p.name,
        iconUrl: undefined,
        color: pickFallbackColor(p.id),
        href: undefined,
      })),
  ]
}

/**
 * Projects have no color of their own unless they are an interop chain or
 * set one for their page, so the rest take one from this list by their id.
 */
const FALLBACK_COLORS = [
  '#7C8CF8',
  '#36B5A0',
  '#E5A13B',
  '#D86AA8',
  '#5AA9E6',
  '#9B7EDE',
  '#6FBF73',
  '#E0776B',
]

function getColor(project: {
  id: string
  colors?: { primary: { light: string } }
}): string {
  const interopChain = INTEROP_CHAINS.find((c) => c.id === project.id)
  if (interopChain) return interopChain.color
  if (project.colors) return project.colors.primary.light
  return pickFallbackColor(project.id)
}

function pickFallbackColor(id: string): string {
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2 ** 31
  }
  const color = FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
  assert(color)
  return color
}
