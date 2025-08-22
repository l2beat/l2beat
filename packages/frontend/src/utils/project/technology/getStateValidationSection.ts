import type { Project } from '@l2beat/config'
import type { StateValidationSectionProps } from '~/components/projects/sections/StateValidationSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import { getDiagramParams } from '../getDiagramParams'

export async function getStateValidationSection(
  project: Project<'scalingTechnology' | 'statuses' | 'scalingInfo'>,
): Promise<
  Omit<StateValidationSectionProps, 'id' | 'title' | 'sectionOrder'> | undefined
> {
  if (!project.scalingTechnology.stateValidation) return undefined

  const zkCatalogProjects = await ps.getProjects({
    where: ['zkCatalogInfo'],
  })

  const zkCatalogBannerProject = getZkCatalogBannerProject(
    project.scalingInfo.proofSystem?.zkCatalogId,
    zkCatalogProjects,
  )

  return {
    stateValidation: project.scalingTechnology.stateValidation,
    diagram: getDiagramParams(
      'state-validation',
      project.scalingTechnology.stateValidationImage ?? project.slug,
    ),
    isUnderReview:
      !!project.statuses.reviewStatus ||
      !!project.scalingTechnology.stateValidation.isUnderReview,
    zkCatalogBannerProject,
  }
}

function getZkCatalogBannerProject(
  zkCatalogProjectId: string | undefined,
  zkCatalogProjects: Project[],
) {
  if (!zkCatalogProjectId) return undefined

  const zkCatalogProject = zkCatalogProjects.find(
    (x) => x.id === zkCatalogProjectId,
  )
  if (!zkCatalogProject) return undefined

  return {
    id: zkCatalogProjectId,
    name: zkCatalogProject.name,
    icon: getProjectIcon(zkCatalogProject.slug),
  }
}
