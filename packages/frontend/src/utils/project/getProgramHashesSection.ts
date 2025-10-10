import type { Project } from '@l2beat/config'
import type {
  ProgramHashesSectionProps,
  StateValidationZkProgramHashData,
} from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { ProjectSectionProps } from '../../components/projects/sections/types'

export function getProgramHashesSection(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<'contracts'>[],
): Omit<ProgramHashesSectionProps, keyof ProjectSectionProps> | undefined {
  const result: Map<string, StateValidationZkProgramHashData> = new Map()

  for (const scalingProject of allProjects) {
    const programHashes = scalingProject.contracts.zkProgramHashes
    if (!programHashes) continue

    for (const zkProgramHash of programHashes) {
      if (zkProgramHash.proverSystemProject !== project.id) continue

      const current = result.get(zkProgramHash.hash)
      if (!current) {
        result.set(zkProgramHash.hash, {
          ...zkProgramHash,
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
    }
  }

  const zkProgramHashes = Array.from(result.values())
  if (zkProgramHashes.length === 0) return undefined

  return {
    zkProgramHashes,
  }
}
