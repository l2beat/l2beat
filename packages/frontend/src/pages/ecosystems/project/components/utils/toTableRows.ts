import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'

export function toTableRows({
  projects,
  excludeRwaRestrictedTokens,
}: {
  projects: EcosystemProjectEntry[]
  excludeRwaRestrictedTokens: boolean
}) {
  return projects.map((project) => {
    const { withRwaRestricted, withoutRwaRestricted } = project.tvsData
    return {
      ...project,
      tvsData: excludeRwaRestrictedTokens
        ? withoutRwaRestricted
        : withRwaRestricted,
    }
  })
}

export type EcosystemProjectsTableRow = ReturnType<typeof toTableRows>[number]
