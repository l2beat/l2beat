import type { Project } from '@l2beat/config'
import type { StateValidationSectionProps } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ContractUtils } from '../../contracts-and-permissions/getContractUtils'
import { getDiagramParams } from '../../getDiagramParams'
import { getProverInfo } from './getProverInfo'

export function getStateValidationSection(
  project: Project<'scalingTechnology' | 'statuses' | 'scalingInfo'>,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
):
  | Omit<StateValidationSectionProps, 'id' | 'title' | 'sectionOrder'>
  | undefined {
  if (!project.scalingTechnology.stateValidation) return undefined

  return {
    stateValidation: project.scalingTechnology.stateValidation,
    diagram: getDiagramParams(
      'state-validation',
      project.scalingTechnology.stateValidationImage ?? project.slug,
    ),
    isUnderReview:
      !!project.statuses.reviewStatus ||
      !!project.scalingTechnology.stateValidation.isUnderReview,
    proverInfo: getProverInfo(
      project.id,
      project.scalingInfo.proofSystem?.zkCatalogId,
      zkCatalogProjects,
      contractUtils,
      tvs,
      allProjects,
    ),
  }
}
