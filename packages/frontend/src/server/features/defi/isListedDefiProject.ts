import type { ProjectDefiInfo } from '@l2beat/config'

/**
 * DeFi projects whose category has its own page are listed in search, the
 * sitemap and section links. The others keep only their project page.
 */
export function isListedDefiProject(
  defiInfo: ProjectDefiInfo | undefined,
): boolean {
  return defiInfo?.category === 'Liquid Staking'
}
