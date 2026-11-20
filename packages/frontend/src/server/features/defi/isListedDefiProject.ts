import type { ProjectDefiInfo, ProjectLiquidStaking } from '@l2beat/config'

/**
 * DeFi projects whose category has its own page are listed in search, the
 * sitemap and section links. The others keep only their project page, which
 * search lists once CROPS reviews the project. Liquid staking protocols
 * research hasn't reviewed have no page at all.
 */
export function isListedDefiProject(project: {
  defiInfo?: ProjectDefiInfo
  liquidStaking?: ProjectLiquidStaking
}): boolean {
  return (
    project.defiInfo?.category === 'Liquid Staking' &&
    !isUnreviewedLiquidStaking(project)
  )
}

/** Listed only as a row of the liquid staking page, without a project page. */
export function isUnreviewedLiquidStaking(project: {
  liquidStaking?: ProjectLiquidStaking
}): boolean {
  return project.liquidStaking !== undefined && !project.liquidStaking.risks
}
