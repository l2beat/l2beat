import type {
  Project,
  ProjectScalingContractsProgramHash,
} from '@l2beat/config'
import type { StateValidationProgramHashData } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import { manifest } from '~/utils/Manifest'

export function getProgramHashes(
  programHashes: ProjectScalingContractsProgramHash[] | undefined,
  zkCatalogProjects: Project[],
  allProjects: Project<'contracts'>[],
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

      return {
        ...hash,
        zkCatalogProject: zkCatalogProject
          ? {
              name: zkCatalogProject.name,
              href: `/zk-catalog/${zkCatalogProject.slug}`,
              icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
            }
          : undefined,
        usedIn: usedIn.map((project) => ({
          ...project,
          icon: manifest.getUrl(`/icons/${project.slug}.png`),
          url: `/scaling/projects/${project.slug}`,
        })),
      }
    })
    .filter((x) => x !== undefined)
}
