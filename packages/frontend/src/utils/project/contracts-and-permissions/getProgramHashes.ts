import type {
  Project,
  ProjectScalingContractsProgramHash,
} from '@l2beat/config'
import type { StateValidationProgramHashData } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { manifest } from '~/utils/Manifest'

export function getProgramHashes(
  programHashes: ProjectScalingContractsProgramHash[] | undefined,
  zkCatalogProjects: Project[],
  allProjects: Project<'contracts'>[],
  tvs?: SevenDayTvsBreakdown,
): StateValidationProgramHashData[] {
tomasztorz/l2b-13096-order-the-used-in-by-tvs  if (!programHashes) return []

  return programHashes
    .map((hash) => {
      const zkCatalogProject = zkCatalogProjects.find(
        (x) => x.id === hash.proverSystemProject,
      )

      const usedIn = allProjects?.filter((project) =>
        project.contracts.programHashes?.some((ph) => ph.hash === hash.hash),
      )

      const usedInWithIcons = usedIn.map((project) => ({
        ...project,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        url: `/scaling/projects/${project.slug}`,
      }))

      const usedInByTvs = tvs
        ? [...usedInWithIcons].sort(
            (a, b) =>
              (tvs.projects[b.id]?.breakdown.total ?? 0) -
              (tvs.projects[a.id]?.breakdown.total ?? 0),
          )
        : usedInWithIcons
      return {
        ...hash,
        zkCatalogProject: zkCatalogProject
          ? {
              name: zkCatalogProject.name,
              href: `/zk-catalog/${zkCatalogProject.slug}`,
              icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
            }
          : undefined,
        usedIn: usedInByTvs,
      }
    })
    .filter((x) => x !== undefined)
}
