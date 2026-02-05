import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import range from 'lodash/range'
import type { Stage } from '../../types'
import { createGetStage } from './stage'

describe(createGetStage.name, () => {
  it('goes up to the last stage if all requirements are met', () => {
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
      message: undefined,
      downgradePending: undefined,
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
      missing: undefined,
    })
  })

  it('goes up to the last stage if all requirements are met even to Stage 99', () => {
    const stagesKey = range(0, 100).map((i) => `stage${i}`)
    const checklist = Object.fromEntries(
      stagesKey.map((key, index) => {
        return [
          key,
          {
            name: `Stage ${index}` as Stage,
            principle: {
              positive: 'PRINCIPLE_TRUE',
              negative: 'PRINCIPLE_FALSE',
            },
            items: {
              a: {
                positive: 'A_TRUE',
                negative: 'A_FALSE',
              },
              b: {
                positive: 'B_TRUE',
                negative: 'B_FALSE',
              },
            },
          },
        ]
      }),
    )
    const longStages = createGetStage(checklist)
    const result = longStages(
      Object.fromEntries(
        stagesKey.map((key) => {
          return [
            key,
            {
              principle: true,
              a: true,
              b: true,
            },
          ]
        }),
      ),
    )
    // There is no way to get Stage 99 IRL but for test purposes it is ok
    expect(result.stage).toEqual('Stage 99' as Stage)
    expect(result.message).toEqual(undefined)
    expect(result.downgradePending).toEqual(undefined)
    expect(result.summary).toHaveLength(100)
    expect(result.missing).toEqual(undefined)
    expect(result.additionalConsiderations).toEqual(undefined)
  })

  it('goes up to the last stage until requirement is not met', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        hasEscapeHatch: false,
        isCouncil8Members: true,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 0',
      message: undefined,
      downgradePending: undefined,
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
            { satisfied: false, description: 'ESCAPE_HATCH_FALSE' },
            { satisfied: true, description: 'COUNCIL_TRUE' },
          ],
        },
      ],
      missing: {
        nextStage: 'Stage 1',
        principle: 'PRINCIPLE_FALSE',
        requirements: ['ESCAPE_HATCH_FALSE'],
      },
    })
  })

  it('handles custom messages', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: {
          satisfied: true,
          message: 'REPLACE_MESSAGE',
          mode: 'replace',
        },
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: {
          satisfied: false,
          message: 'PRINCIPLE_APPEND_MESSAGE',
          mode: 'append',
        },
        hasEscapeHatch: {
          satisfied: 'UnderReview',
          message: 'APPEND_MESSAGE',
          mode: 'append',
        },
        isCouncil8Members: {
          satisfied: false,
          message: 'REPLACE_MESSAGE',
          mode: 'replace',
        },
      },
    })

    expect(result).toEqual({
      stage: 'Stage 0',
      summary: [
        {
          stage: 'Stage 0',
          principle: undefined,
          requirements: [
            { satisfied: true, description: 'REPLACE_MESSAGE' },
            { satisfied: true, description: 'SOURCE_TRUE' },
          ],
        },
        {
          stage: 'Stage 1',
          principle: {
            satisfied: false,
            description: 'PRINCIPLE_FALSE PRINCIPLE_APPEND_MESSAGE',
          },
          requirements: [
            {
              satisfied: 'UnderReview',
              description: 'ESCAPE_HATCH_TRUE APPEND_MESSAGE',
            },
            { satisfied: false, description: 'REPLACE_MESSAGE' },
          ],
        },
      ],
      downgradePending: undefined,
      message: undefined,
      missing: {
        nextStage: 'Stage 1',
        principle: 'PRINCIPLE_FALSE PRINCIPLE_APPEND_MESSAGE',
        requirements: ['ESCAPE_HATCH_TRUE APPEND_MESSAGE', 'REPLACE_MESSAGE'],
      },
    })
  })

  it('handles under review with positive description', () => {
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

  it('omits requirement if null is passed', () => {
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
          requirements: [{ satisfied: true, description: 'ESCAPE_HATCH_TRUE' }],
        },
      ],
      downgradePending: undefined,
      message: undefined,
      missing: undefined,
    })
  })

  it('downgrades if principle is not met but all requirements are met', () => {
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

  describe('special Stage 0 cases', () => {
    it('is minimum stage 0 even if requirements are not met', () => {
      const getStage = createGetStage({
        stage0: {
          name: 'Stage 0',
          items: {
            callsItselfRollup: {
              positive: 'ROLLUP_TRUE',
              negative: 'ROLLUP_FALSE',
            },
            rollupNodeSourceAvailable: {
              positive: 'SOURCE_TRUE',
              negative: 'SOURCE_FALSE',
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
      const result = getStage({
        stage0: {
          callsItselfRollup: false,
          rollupNodeSourceAvailable: false,
        },
        stage1: {
          principle: false,
          hasEscapeHatch: false,
          isCouncil8Members: true,
        },
      })

      expect(result).toEqual({
        stage: 'Stage 0',
        downgradePending: undefined,
        message: undefined,
        missing: {
          nextStage: 'Stage 1',
          requirements: ['ESCAPE_HATCH_FALSE'],
          principle: 'PRINCIPLE_FALSE',
        },
        summary: [
          {
            stage: 'Stage 0',
            principle: undefined,
            requirements: [
              { satisfied: false, description: 'ROLLUP_FALSE' },
              { satisfied: false, description: 'SOURCE_FALSE' },
            ],
          },
          {
            stage: 'Stage 1',
            principle: { satisfied: false, description: 'PRINCIPLE_FALSE' },
            requirements: [
              { satisfied: false, description: 'ESCAPE_HATCH_FALSE' },
              { satisfied: true, description: 'COUNCIL_TRUE' },
            ],
          },
        ],
      })
    })

    it('returns Stage 0 with warning message if project does not fulfill stage 0 requirements', () => {
      const result = getTestStage({
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

      expect(result).toEqual({
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

    it('returns Stage 0 with under review message if stage 0 requirement is being reviewed', () => {
      const result = getTestStage({
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

      expect(result).toEqual({
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

    it('throws error if more than one message should be returned', () => {
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
  })

  describe('upcomingItems', () => {
    const FUTURE_TIME = UnixTime.now() + 30 * UnixTime.DAY
    const PAST_TIME = UnixTime.now() - 30 * UnixTime.DAY

    const getUpcomingTestStage = (expiresAt: number) =>
      createGetStage({
        stage0: {
          name: 'Stage 0',
          items: {
            callsItselfRollup: {
              positive: 'ROLLUP_TRUE',
              negative: 'ROLLUP_FALSE',
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
          },
          upcomingItems: {
            expiresAt,
            items: {
              upcomingA: {
                positive: 'UPCOMING_A_TRUE',
                negative: 'UPCOMING_A_FALSE',
              },
              upcomingB: {
                positive: 'UPCOMING_B_TRUE',
                negative: 'UPCOMING_B_FALSE',
              },
            },
          },
        },
      })

    it('not expired + all satisfied → no downgradePending, requirements shown with upcoming: true', () => {
      const getStage = getUpcomingTestStage(FUTURE_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: true,
          upcomingA: true,
          upcomingB: true,
        },
      })

      expect(result.stage).toEqual('Stage 1')
      expect(result.downgradePending).toEqual(undefined)
      expect(result.missing).toEqual(undefined)
      const stage1Summary = result.summary.find((s) => s.stage === 'Stage 1')
      expect(stage1Summary?.requirements).toEqual([
        { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
        { satisfied: true, description: 'UPCOMING_A_TRUE', upcoming: true },
        { satisfied: true, description: 'UPCOMING_B_TRUE', upcoming: true },
      ])
    })

    it('not expired + some failing → downgradePending set with failing reasons', () => {
      const getStage = getUpcomingTestStage(FUTURE_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: true,
          upcomingA: false,
          upcomingB: false,
        },
      })

      expect(result.stage).toEqual('Stage 1')
      expect(result.downgradePending).toEqual({
        expiresAt: FUTURE_TIME,
        reasons: ['UPCOMING_A_FALSE', 'UPCOMING_B_FALSE'],
        toStage: 'Stage 0',
      })
      expect(result.missing).toEqual(undefined)
    })

    it('not expired + some failing + regular requirements also failing → missing set, no downgradePending', () => {
      const getStage = getUpcomingTestStage(FUTURE_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: false,
          upcomingA: false,
          upcomingB: true,
        },
      })

      expect(result.stage).toEqual('Stage 0')
      expect(result.missing).toEqual({
        nextStage: 'Stage 1',
        requirements: ['ESCAPE_HATCH_FALSE'],
        principle: undefined,
      })
      // downgradePending should NOT be set because there's already a missing
      expect(result.downgradePending).toEqual(undefined)
    })

    it('expired + some failing → added to missing, project downgraded', () => {
      const getStage = getUpcomingTestStage(PAST_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: true,
          upcomingA: false,
          upcomingB: true,
        },
      })

      expect(result.stage).toEqual('Stage 0')
      expect(result.missing).toEqual({
        nextStage: 'Stage 1',
        requirements: ['UPCOMING_A_FALSE'],
        principle: undefined,
      })
      expect(result.downgradePending).toEqual(undefined)
    })

    it('expired + all satisfied → no effect, requirements shown without upcoming flag', () => {
      const getStage = getUpcomingTestStage(PAST_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: true,
          upcomingA: true,
          upcomingB: true,
        },
      })

      expect(result.stage).toEqual('Stage 1')
      expect(result.downgradePending).toEqual(undefined)
      expect(result.missing).toEqual(undefined)
      const stage1Summary = result.summary.find((s) => s.stage === 'Stage 1')
      expect(stage1Summary?.requirements).toEqual([
        { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
        { satisfied: true, description: 'UPCOMING_A_TRUE' },
        { satisfied: true, description: 'UPCOMING_B_TRUE' },
      ])
    })

    it('upcoming items not provided (undefined/omitted) → no effect', () => {
      const getStage = getUpcomingTestStage(FUTURE_TIME)
      const result = getStage({
        stage0: { callsItselfRollup: true },
        stage1: {
          principle: true,
          hasEscapeHatch: true,
        },
      })

      expect(result.stage).toEqual('Stage 1')
      expect(result.downgradePending).toEqual(undefined)
      expect(result.missing).toEqual(undefined)
      const stage1Summary = result.summary.find((s) => s.stage === 'Stage 1')
      expect(stage1Summary?.requirements).toEqual([
        { satisfied: true, description: 'ESCAPE_HATCH_TRUE' },
      ])
    })
  })
})

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
