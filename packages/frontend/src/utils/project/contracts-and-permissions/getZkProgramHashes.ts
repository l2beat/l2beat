import type {
  Project,
  ProjectScalingContractsZkProgramHash,
} from '@l2beat/config'
import type { StateValidationZkProgramHashData } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

export function getZkProgramHashes(
  zkProgramHashes: ProjectScalingContractsZkProgramHash[] | undefined,
  zkCatalogProjects: Project[],
  allProjects: Project<'contracts'>[],
): StateValidationZkProgramHashData[] {
  if (!zkProgramHashes) return []

  return zkProgramHashes
    .map((zkHash) => {
      const zkCatalogProject = zkCatalogProjects.find(
        (x) => x.id === zkHash.proverSystemProject,
      )

      const usedIn = allProjects?.filter((project) =>
        project.contracts.zkProgramHashes?.some(
          (ph) => ph.hash === zkHash.hash,
        ),
      )

      return {
        ...zkHash,
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
