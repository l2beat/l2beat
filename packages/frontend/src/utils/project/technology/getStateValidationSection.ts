import type {
  Project,
  ProjectScalingStateValidationZkProgramHash,
} from '@l2beat/config'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/ProjectDetailsRelatedProjectBanner'
import type { StateValidationSectionProps } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { StateValidationZkProgramHashData } from '~/components/projects/sections/state-validation/ZkProgramHash'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import { getDiagramParams } from '../getDiagramParams'

export async function getStateValidationSection(
  project: Project<'scalingTechnology' | 'statuses' | 'scalingInfo'>,
): Promise<
  Omit<StateValidationSectionProps, 'id' | 'title' | 'sectionOrder'> | undefined
> {
  if (!project.scalingTechnology.stateValidation) return undefined

  const [zkCatalogProjects, allProjects] = await Promise.all([
    ps.getProjects({
      where: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      select: ['scalingTechnology'],
    }),
  ])

  const zkCatalogBanner = getZkCatalogBanner(
    project.scalingInfo.proofSystem?.zkCatalogId,
    zkCatalogProjects,
  )

  return {
    stateValidation: project.scalingTechnology.stateValidation,
    zkProgramHashes: getZkProgramHashes(
      project.scalingTechnology.stateValidation.zkProgramHashes,
      zkCatalogProjects,
      allProjects,
    ),
    diagram: getDiagramParams(
      'state-validation',
      project.scalingTechnology.stateValidationImage ?? project.slug,
    ),
    isUnderReview:
      !!project.statuses.reviewStatus ||
      !!project.scalingTechnology.stateValidation.isUnderReview,
    zkCatalogBanner,
  }
}

function getZkProgramHashes(
  zkProgramHashes: ProjectScalingStateValidationZkProgramHash[] | undefined,
  zkCatalogProjects: Project[],
  allProjects: Project<'scalingTechnology'>[],
): StateValidationZkProgramHashData[] {
  if (!zkProgramHashes) return []

  return zkProgramHashes
    .map((zkHash) => {
      const zkCatalogProject = zkCatalogProjects.find(
        (x) => x.id === zkHash.proverSystemProject,
      )
      if (!zkCatalogProject) return undefined
      const usedIn = allProjects?.filter((project) =>
        project.scalingTechnology.stateValidation?.zkProgramHashes?.some(
          (ph) => ph.hash === zkHash.hash,
        ),
      )

      return {
        ...zkHash,
        zkCatalogProject: {
          id: zkCatalogProject.id,
          icon: getProjectIcon(zkCatalogProject.slug),
        },
        usedIn: usedIn.map((project) => ({
          ...project,
          icon: getProjectIcon(project.slug),
          url: `/scaling/projects/${project.slug}`,
        })),
      }
    })
    .filter((x) => x !== undefined)
}

function getZkCatalogBanner(
  zkCatalogProjectId: string | undefined,
  zkCatalogProjects: Project[],
): ProjectDetailsRelatedProjectBannerProps | undefined {
  if (!zkCatalogProjectId) return undefined

  const zkCatalogProject = zkCatalogProjects.find(
    (x) => x.id === zkCatalogProjectId,
  )
  if (!zkCatalogProject) return undefined

  return {
    project: {
      name: zkCatalogProject.name,
      icon: getProjectIcon(zkCatalogProject.slug),
    },
    text: 'Learn more about the proof system here:',
    href: `/zk-catalog?highlight=${zkCatalogProjectId}`,
  }
}
