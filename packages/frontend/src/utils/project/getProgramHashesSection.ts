import type { Project } from '@l2beat/config'
import type {
  ProgramHashesSectionProps,
  StateValidationProgramHashData,
} from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { ProjectSectionProps } from '../../components/projects/sections/types'
import { tvsComparator } from './getVerifiersSection'

export function getProgramHashesSection(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<'contracts'>[],
  allProjectsWithDaBridge: Project<never, 'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
): Omit<ProgramHashesSectionProps, keyof ProjectSectionProps> | undefined {
  const result: Map<string, StateValidationProgramHashData> = new Map()

  for (const scalingProject of allProjects) {
    const programHashes = scalingProject.contracts.programHashes
    if (!programHashes) continue

    for (const programHash of programHashes) {
      if (programHash.proverSystemProject !== project.id) continue

      const current = result.get(programHash.hash)
      if (!current) {
        result.set(programHash.hash, {
          ...programHash,
          usedIn: [
            {
              ...scalingProject,
              icon: getProjectIcon(scalingProject.slug),
              url: `/scaling/projects/${scalingProject.slug}`,
            },
          ],
        })
      } else {
        current.usedIn.push({
          ...scalingProject,
          icon: getProjectIcon(scalingProject.slug),
          url: `/scaling/projects/${scalingProject.slug}`,
        })
      }

      current?.usedIn.sort(tvsComparator(allProjectsWithDaBridge, tvs))
    }
  }

  const programHashes = Array.from(result.values())
  if (programHashes.length === 0) return undefined

  return {
    programHashes,
  }
}
