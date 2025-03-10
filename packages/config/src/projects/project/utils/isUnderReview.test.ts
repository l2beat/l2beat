import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type {
  ProjectScalingConfig,
  ProjectScalingDisplay,
  ScalingProject,
} from '../../../internalTypes'
import type { ProjectScalingTechnology } from '../../../internalTypes'
import type {
  ProjectContracts,
  ProjectScalingRiskView,
  ProjectScalingStage,
  TableReadyValue,
} from '../../../types'
import { isUnderReview } from './isUnderReview'

describe(isUnderReview.name, () => {
  const mockProject: ScalingProject = {
    type: 'layer2',
    addedAt: UnixTime(1234567890),
    id: ProjectId('project-id'),
    capability: 'universal',
    display: mockObject<ProjectScalingDisplay>(),
    technology: mockObject<ProjectScalingTechnology>({
      isUnderReview: undefined,
    }),
    contracts: mockObject<ProjectContracts>({}),
    riskView: mockObject<ProjectScalingRiskView>(),
    config: mockObject<ProjectScalingConfig>(),
    stage: mockObject<ProjectScalingStage>({ stage: 'Stage 1' }),
  }

  it('returns false', () => {
    expect(isUnderReview(mockProject)).toEqual(false)
  })

  describe('returns true if', () => {
    it('project.isUnderReview is true', () => {
      const mock = {
        ...mockProject,
        isUnderReview: true,
      }
      expect(isUnderReview(mock)).toEqual(true)
    })

    it('project.technology.isUnderReview is true', () => {
      const mock = {
        ...mockProject,
        technology: {
          ...mockProject.technology,
          isUnderReview: true,
        },
      }
      expect(isUnderReview(mock)).toEqual(true)
    })

    it('project.riskView has a underReview risk', () => {
      const mock = {
        ...mockProject,
        riskView: {
          ...mockProject.riskView,
          sequencerFailure: {
            ...mockObject<TableReadyValue>(),
            sentiment: 'UnderReview' as const,
          },
        },
      }
      expect(isUnderReview(mock)).toEqual(true)
    })

    it('project.type is layer2 and project.stage.stage is UnderReview', () => {
      const mock = {
        ...mockProject,
        stage: {
          stage: 'UnderReview' as const,
        },
      }
      expect(isUnderReview(mock)).toEqual(true)
    })
  })
})
