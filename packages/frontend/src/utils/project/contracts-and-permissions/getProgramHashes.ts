import type {
  Project,
  ProjectScalingContractsProgramHash,
} from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { StateValidationProgramHashData } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { manifest } from '~/utils/Manifest'

export function getProgramHashes(
  programHashes: ProjectScalingContractsProgramHash[] | undefined,
  zkCatalogProjects: Project[],
  allProjects: Project<'contracts'>[],
  tvs: SevenDayTvsBreakdown,
): StateValidationProgramHashData[] {
  if (!programHashes) return []

  return programHashes
    .map((hash) => {
      const zkCatalogProject = zkCatalogProjects.find(
        (x) => x.id === hash.proverSystemProject,
      )

      const usedIn = allProjects?.filter((project) =>
        project.contracts.programHashes?.some((ph) => ph.hash === hash.hash),
      )
      const usedInWithIcons = usedIn.map(toUsedInProjectWithIcon)

      return {
        ...hash,
        zkCatalogProject: zkCatalogProject
          ? {
              name: zkCatalogProject.name,
              href: `/zk-catalog/${zkCatalogProject.slug}`,
              icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
            }
          : undefined,
        usedIn: usedInWithIcons.sort(
          (a, b) =>
            (tvs.projects[b.id]?.breakdown.total ?? 0) -
            (tvs.projects[a.id]?.breakdown.total ?? 0),
        ),
      }
    })
    .filter((x) => x !== undefined)
}

// Picks only what the UI renders; spreading the whole project would ship all
// of its contracts to the client in SSR data.
export function toUsedInProjectWithIcon(
  project: Project,
): UsedInProjectWithIcon {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    url: `/layer2s/projects/${project.slug}`,
  }
}
