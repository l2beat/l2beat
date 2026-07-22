import type { Project } from '@l2beat/config'
import type {
  ProgramHashesSectionProps,
  StateValidationProgramHashData,
} from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { manifest } from '~/utils/Manifest'
import type { ProjectSectionProps } from '../../components/projects/sections/types'
import { tvsComparator } from './getVerifiersSection'

export function getProgramHashesSection(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<'contracts'>[],
  allProjectsWithDaBridge: Project<never, 'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
): Omit<ProgramHashesSectionProps, keyof ProjectSectionProps> | undefined {
  const result: Map<string, StateValidationProgramHashData> = new Map()

  for (const layer2sProject of allProjects) {
    const programHashes = layer2sProject.contracts.programHashes
    if (!programHashes) continue

    for (const programHash of programHashes) {
      if (programHash.proverSystemProject !== project.id) continue

      const current = result.get(programHash.hash)
      if (!current) {
        result.set(programHash.hash, {
          ...programHash,
          usedIn: [
            {
              ...layer2sProject,
              icon: manifest.getUrl(`/icons/${layer2sProject.slug}.png`),
              url: `/layer2s/projects/${layer2sProject.slug}`,
            },
          ],
        })
      } else {
        current.usedIn.push({
          ...layer2sProject,
          icon: manifest.getUrl(`/icons/${layer2sProject.slug}.png`),
          url: `/layer2s/projects/${layer2sProject.slug}`,
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
