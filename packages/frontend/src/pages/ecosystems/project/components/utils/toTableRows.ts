import compact from 'lodash/compact'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { compareTvs } from '~/server/features/scaling/tvs/utils/compareTvs'

export function toTableRows({
  projects,
  excludeRwaRestrictedTokens,
}: {
  projects: EcosystemProjectEntry[]
  excludeRwaRestrictedTokens: boolean
}) {
  return projects
    .map((project) => {
      const { withRwaRestricted, withoutRwaRestricted } = project.tvsData
      return {
        ...project,
        statuses: {
          ...project.statuses,
          syncWarning: compact([
            project.statuses?.syncWarning,
            excludeRwaRestrictedTokens
              ? project.tvsSyncWarning.withoutRwaRestricted
              : project.tvsSyncWarning.withRwaRestricted,
          ]).join('\n'),
        },
        tvsSyncWarning: excludeRwaRestrictedTokens
          ? project.tvsSyncWarning.withoutRwaRestricted
          : project.tvsSyncWarning.withRwaRestricted,
        tvsData: excludeRwaRestrictedTokens
          ? withoutRwaRestricted
          : withRwaRestricted,
        tvsOrder: excludeRwaRestrictedTokens
          ? (withoutRwaRestricted?.breakdown.total ?? -1)
          : (withRwaRestricted?.breakdown.total ?? -1),
      }
    })
    .sort(compareTvs)
}

export type EcosystemProjectsTableRow = ReturnType<typeof toTableRows>[number]
