import type { ProjectService } from '@l2beat/config'
import uniq from 'lodash/uniq'
import type { DaBeatConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getDaBeatConfig(
  ps: ProjectService,
  flags: FeatureFlags,
): Promise<DaBeatConfig> {
  const allProjects = await ps.getProjects({
    select: ['daLayer'],
  })
  // Individual projects can be disabled with e.g. FEATURES=*,!da-beat.ethereum
  const projects = allProjects.filter((x) =>
    flags.isEnabled('da-beat', x.id.toString()),
  )

  const coingeckoIds = projects
    .map((x) => x.daLayer.economicSecurity?.token.coingeckoId)
    .filter((x) => x !== undefined)
    .filter((x, i, a) => a.indexOf(x) === i) // unique

  const projectsForDaBeatStats = uniq(
    projects
      .filter(
        (x) =>
          x.daLayer.economicSecurity ||
          x.daLayer.validators?.type === 'dynamic',
      )
      .map((x) => x.id),
  )

  return {
    projectsForDaBeatStats,
    coingeckoIds,
  }
}
