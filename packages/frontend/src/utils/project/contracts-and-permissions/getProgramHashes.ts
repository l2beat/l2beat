import type {
  Project,
  ProjectScalingContractsProgramHash,
} from '@l2beat/config'
import type { StateValidationProgramHashData } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

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
              icon: getProjectIcon(zkCatalogProject.slug),
            }
          : undefined,
        usedIn: usedIn.map((project) => ({
          ...project,
          icon: getProjectIcon(project.slug),
          url: `/scaling/projects/${project.slug}`,
        })),
      }
    })
    .filter((x) => x !== undefined)
}
