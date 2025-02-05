import { expect } from 'earl'

import { UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../../../common'
import { createGetStage } from './stage'

const getTestStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'ROLLUP_TRUE',
        negative: 'ROLLUP_FALSE',
        warningMessage: 'ROLLUP_WARNING',
        underReviewMessage: 'ROLLUP_UNDER_REVIEW',
      },
      rollupNodeSourceAvailable: {
        positive: 'SOURCE_TRUE',
        negative: 'SOURCE_FALSE',
        warningMessage: 'SOURCE_WARNING',
        underReviewMessage: 'SOURCE_UNDER_REVIEW',
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    principle: {
      positive: 'PRINCIPLE_TRUE',
      negative: 'PRINCIPLE_FALSE',
    },
    items: {
      hasEscapeHatch: {
        positive: 'ESCAPE_HATCH_TRUE',
        negative: 'ESCAPE_HATCH_FALSE',
      },
      isCouncil8Members: {
        positive: 'COUNCIL_TRUE',
        negative: 'COUNCIL_FALSE',
      },
    },
  },
})

describe(createGetStage.name, () => {
  it('Throws error if more than one message should be returned', () => {
    expect(() =>
      getTestStage({
        stage0: {
          callsItselfRollup: false,
          rollupNodeSourceAvailable: false,
        },
        stage1: {
          principle: false,
          hasEscapeHatch: true,
          isCouncil8Members: true,
        },
      }),
    ).toThrow('We are currently not handling multiple messages')
  })

  it('Returns Stage 0 with warning message if project does not fulfill stage 0 requirements', () => {
    const x = getTestStage({
      stage0: {
        callsItselfRollup: {
          satisfied: false,
          message: 'OVERRIDE',
          mode: 'replace',
        },
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        hasEscapeHatch: false,
        isCouncil8Members: false,
      },
    })

    expect(x).toEqual({
      stage: 'Stage 0',
      downgradePending: undefined,
      message: {
        type: 'warning',
        text: 'ROLLUP_WARNING',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: ['ESCAPE_HATCH_FALSE', 'COUNCIL_FALSE'],
        principle: 'PRINCIPLE_FALSE',
      },
      summary: [
        {
          stage: 'Stage 0',
          principle: undefined,
          requirements: [
            { satisfied: false, description: 'OVERRIDE' },
            { satisfied: true, description: 'SOURCE_TRUE' },
          ],
        },
        {
          stage: 'Stage 1',
          principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
          requirements: [
            { satisfied: false, description: 'ESCAPE_HATCH_FALSE' },
            { satisfied: false, description: 'COUNCIL_FALSE' },
          ],
        },
      ],
    })
  })

  it('Returns Stage 0 with under review message if stage 0 requirement is being reviewed', () => {
    const x = getTestStage({
      stage0: {
        callsItselfRollup: {
          satisfied: 'UnderReview',
          message: 'OVERRIDE',
          mode: 'replace',
        },
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        hasEscapeHatch: false,
        isCouncil8Members: false,
      },
    })

    expect(x).toEqual({
      stage: 'Stage 0',
      downgradePending: undefined,
      message: {
        type: 'underReview',
        text: 'ROLLUP_UNDER_REVIEW',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: ['ESCAPE_HATCH_FALSE', 'COUNCIL_FALSE'],
        principle: 'PRINCIPLE_FALSE',
      },
      summary: [
        {
          stage: 'Stage 0',
          principle: undefined,
          requirements: [
            { satisfied: 'UnderReview', description: 'OVERRIDE' },
            { satisfied: true, description: 'SOURCE_TRUE' },
          ],
        },
        {
          stage: 'Stage 1',
          principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
          requirements: [
            { satisfied: false, description: 'ESCAPE_HATCH_FALSE' },
            { satisfied: false, description: 'COUNCIL_FALSE' },
          ],
        },
      ],
    })
  })

  it('Stage 0', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        hasEscapeHatch: true,
        isCouncil8Members: false,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 0',
      downgradePending: undefined,
      missing: {
        nextStage: 'Stage 1',
        requirements: ['COUNCIL_FALSE'],
        principle: 'PRINCIPLE_FALSE',
      },
      message: undefined,
      summary: [
        {
          stage: 'Stage 0',
          principle: undefined,
          requirements: [
            { satisfied: true, description: 'ROLLUP_TRUE' },
            { satisfied: true, description: 'SOURCE_TRUE' },
          ],
        },
        {
          stage: 'Stage 1',
          principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
          requirements: [
            { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
            { satisfied: false, description: 'COUNCIL_FALSE' },
          ],
        },
      ],
    })
  })

  describe('Stage 1', () => {
    describe('principle', () => {
      const expiresAt = PROJECT_COUNTDOWNS.stageChanges
      afterEach(() => {
        PROJECT_COUNTDOWNS.stageChanges = expiresAt
      })

      const FUTURE_TIME = UnixTime.now().add(30, 'days')
      const PAST_TIME = UnixTime.now().add(-30, 'days')

      describe('timer expired', () => {})

      it('false, timer not expired', () => {
        PROJECT_COUNTDOWNS.stageChanges = FUTURE_TIME

        const result = getTestStage({
          stage0: {
            callsItselfRollup: true,
            rollupNodeSourceAvailable: true,
          },
          stage1: {
            principle: false,
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 1',
          downgradePending: {
            expiresAt: FUTURE_TIME.toNumber(),
            reason: 'PRINCIPLE_FALSE',
            toStage: 'Stage 0',
          },
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'ROLLUP_TRUE' },
                { satisfied: true, description: 'SOURCE_TRUE' },
              ],
            },
            {
              stage: 'Stage 1',
              principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
              requirements: [
                { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
                { satisfied: true, description: 'COUNCIL_TRUE' },
              ],
            },
          ],
        })
      })

      it('false, timer expired', () => {
        PROJECT_COUNTDOWNS.stageChanges = PAST_TIME

        const result = getTestStage({
          stage0: {
            callsItselfRollup: true,
            rollupNodeSourceAvailable: true,
          },
          stage1: {
            principle: false,
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 0',
          downgradePending: undefined,
          missing: {
            nextStage: 'Stage 1',
            requirements: [],
            principle: 'PRINCIPLE_FALSE',
          },
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'ROLLUP_TRUE' },
                { satisfied: true, description: 'SOURCE_TRUE' },
              ],
            },
            {
              stage: 'Stage 1',
              principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
              requirements: [
                { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
                { satisfied: true, description: 'COUNCIL_TRUE' },
              ],
            },
          ],
        })
      })

      it('true, timer not expired', () => {
        PROJECT_COUNTDOWNS.stageChanges = FUTURE_TIME

        const result = getTestStage({
          stage0: {
            callsItselfRollup: true,
            rollupNodeSourceAvailable: true,
          },
          stage1: {
            principle: true,
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 1',
          downgradePending: undefined,
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'ROLLUP_TRUE' },
                { satisfied: true, description: 'SOURCE_TRUE' },
              ],
            },
            {
              stage: 'Stage 1',
              principle: { satisfied: true, description: 'PRINCIPLE_TRUE' },
              requirements: [
                { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
                { satisfied: true, description: 'COUNCIL_TRUE' },
              ],
            },
          ],
        })
      })

      it('true, timer expired', () => {
        PROJECT_COUNTDOWNS.stageChanges = PAST_TIME

        const result = getTestStage({
          stage0: {
            callsItselfRollup: true,
            rollupNodeSourceAvailable: true,
          },
          stage1: {
            principle: true,
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 1',
          downgradePending: undefined,
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'ROLLUP_TRUE' },
                { satisfied: true, description: 'SOURCE_TRUE' },
              ],
            },
            {
              stage: 'Stage 1',
              principle: { satisfied: true, description: 'PRINCIPLE_TRUE' },
              requirements: [
                { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
                { satisfied: true, description: 'COUNCIL_TRUE' },
              ],
            },
          ],
        })
      })

      it('handles with custom description', () => {
        const result = getTestStage({
          stage0: {
            callsItselfRollup: true,
            rollupNodeSourceAvailable: true,
          },
          stage1: {
            principle: {
              satisfied: true,
              message: 'OVERRIDE',
              mode: 'replace',
            },
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 1',
          downgradePending: undefined,
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'ROLLUP_TRUE' },
                { satisfied: true, description: 'SOURCE_TRUE' },
              ],
            },
            {
              stage: 'Stage 1',
              principle: { satisfied: true, description: 'OVERRIDE' },
              requirements: [
                { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
                { satisfied: true, description: 'COUNCIL_TRUE' },
              ],
            },
          ],
        })
      })
    })
  })

  it('Removes null from missing and summary', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: true,
        hasEscapeHatch: true,
        isCouncil8Members: null,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 1',
      downgradePending: undefined,
      missing: undefined,
      message: undefined,
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            { satisfied: true, description: 'ROLLUP_TRUE' },
            { satisfied: true, description: 'SOURCE_TRUE' },
          ],
          principle: undefined,
        },
        {
          stage: 'Stage 1',
          principle: { satisfied: true, description: 'PRINCIPLE_TRUE' },
          requirements: [{ satisfied: true, description: 'ESCAPE_HATCH_TRUE' }],
        },
      ],
    })
  })

  describe('Under review', () => {
    it('Custom description works', () => {
      const result = getTestStage({
        stage0: {
          callsItselfRollup: true,
          rollupNodeSourceAvailable: true,
        },
        stage1: {
          principle: false,
          hasEscapeHatch: {
            satisfied: 'UnderReview',
            message: 'OVERRIDE',
            mode: 'replace',
          },
          isCouncil8Members: true,
        },
      })

      expect(result).toEqual({
        stage: 'Stage 0',
        downgradePending: undefined,
        missing: {
          nextStage: 'Stage 1',
          requirements: ['OVERRIDE'],
          principle: 'PRINCIPLE_FALSE',
        },
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            principle: undefined,
            requirements: [
              { satisfied: true, description: 'ROLLUP_TRUE' },
              { satisfied: true, description: 'SOURCE_TRUE' },
            ],
          },
          {
            stage: 'Stage 1',
            principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
            requirements: [
              { satisfied: 'UnderReview', description: 'OVERRIDE' },
              { satisfied: true, description: 'COUNCIL_TRUE' },
            ],
          },
        ],
      })
    })

    it('If no description provided, uses the positive description', () => {
      const result = getTestStage({
        stage0: {
          callsItselfRollup: true,
          rollupNodeSourceAvailable: true,
        },
        stage1: {
          principle: false,
          hasEscapeHatch: 'UnderReview',
          isCouncil8Members: true,
        },
      })

      expect(result).toEqual({
        stage: 'Stage 0',
        downgradePending: undefined,
        missing: {
          nextStage: 'Stage 1',
          requirements: ['ESCAPE_HATCH_TRUE'],
          principle: 'PRINCIPLE_FALSE',
        },
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            principle: undefined,
            requirements: [
              { satisfied: true, description: 'ROLLUP_TRUE' },
              { satisfied: true, description: 'SOURCE_TRUE' },
            ],
          },
          {
            stage: 'Stage 1',
            principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
            requirements: [
              {
                satisfied: 'UnderReview',
                description: 'ESCAPE_HATCH_TRUE',
              },
              { satisfied: true, description: 'COUNCIL_TRUE' },
            ],
          },
        ],
      })
    })
  })
})
