import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  ScalingProjectContracts,
  ScalingProjectRiskView,
  ScalingProjectRiskViewEntry,
  ScalingProjectTechnology,
} from '../../../common'
import { Layer2, Layer2Config, Layer2Display, StageConfig } from '../../layer2s'
import { isUnderReview } from './isUnderReview'

describe(isUnderReview.name, () => {
  const mockProject: Layer2 = {
    type: 'layer2',
    createdAt: new UnixTime(1234567890),
    id: ProjectId('project-id'),
    display: mockObject<Layer2Display>(),
    technology: mockObject<ScalingProjectTechnology>({
      isUnderReview: undefined,
    }),
    contracts: mockObject<ScalingProjectContracts>({
      isUnderReview: undefined,
    }),
    riskView: mockObject<ScalingProjectRiskView>(),
    config: mockObject<Layer2Config>(),
    stage: mockObject<StageConfig>({ stage: 'Stage 1' }),
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

    it('project.contracts.isUnderReview is true', () => {
      const mock = {
        ...mockProject,
        contracts: {
          ...mockProject.contracts,
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
            ...mockObject<ScalingProjectRiskViewEntry>(),
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
