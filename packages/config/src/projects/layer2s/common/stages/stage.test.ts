import { expect } from 'earl'

import { UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../../../common'
import { createGetStage } from './stage'

const getTestStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup.',
        negative: "The project doesn't call itself a rollup.",
        warningMessage: 'Warning: The project calls itself a rollup.',
        underReviewMessage:
          'We are reviewing if the project calls itself a rollup.',
      },
      rollupNodeSourceAvailable: {
        positive:
          'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
        negative:
          'No source-available node exists that can recreate the state from L1 data.',
        underReviewMessage:
          'The requirement for available node software is under review',
        warningMessage:
          'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    principle: {
      positive: 'Project has one way to interact.',
      negative: 'Project should have one way to interact.',
    },
    items: {
      hasEscapeHatch: {
        positive: 'The project has an escape hatch.',
        negative: "The project doesn't have an escape hatch.",
      },
      isCouncil8Members: {
        positive: 'The project has at least 8 council members.',
        negative: "The project doesn't have 8 council members.",
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
        callsItselfRollup: [false, 'The project calls itself a chicken.'],
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
      message: {
        type: 'warning',
        text: 'Warning: The project calls itself a rollup.',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: [
          "The project doesn't have an escape hatch.",
          "The project doesn't have 8 council members.",
        ],
        principle: undefined,
      },
      summary: [
        {
          requirements: [
            {
              description: 'The project calls itself a chicken.',
              satisfied: false,
            },
            {
              description:
                'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
              satisfied: true,
            },
          ],
          stage: 'Stage 0',
          principle: undefined,
        },
        {
          requirements: [
            {
              description: "The project doesn't have an escape hatch.",
              satisfied: false,
            },
            {
              description: "The project doesn't have 8 council members.",
              satisfied: false,
            },
          ],
          stage: 'Stage 1',
          principle: undefined,
        },
      ],
    })
  })

  it('Returns Stage 0 with under review message if stage 0 requirement is being reviewed', () => {
    const x = getTestStage({
      stage0: {
        callsItselfRollup: [
          'UnderReview',
          'The project calls itself a chicken.',
        ],
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
      message: {
        type: 'underReview',
        text: 'We are reviewing if the project calls itself a rollup.',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: [
          "The project doesn't have an escape hatch.",
          "The project doesn't have 8 council members.",
        ],
        principle: undefined,
      },
      summary: [
        {
          requirements: [
            {
              description: 'The project calls itself a chicken.',
              satisfied: 'UnderReview',
            },
            {
              description:
                'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
              satisfied: true,
            },
          ],
          stage: 'Stage 0',
          principle: undefined,
        },
        {
          requirements: [
            {
              description: "The project doesn't have an escape hatch.",
              satisfied: false,
            },
            {
              description: "The project doesn't have 8 council members.",
              satisfied: false,
            },
          ],
          stage: 'Stage 1',
          principle: undefined,
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
      missing: {
        nextStage: 'Stage 1',
        requirements: ["The project doesn't have 8 council members."],
        principle: undefined,
      },
      message: undefined,
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            {
              satisfied: true,
              description: 'The project calls itself a rollup.',
            },
            {
              description:
                'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
              satisfied: true,
            },
          ],
          principle: undefined,
        },
        {
          stage: 'Stage 1',
          requirements: [
            {
              satisfied: true,
              description: 'The project has an escape hatch.',
            },
            {
              satisfied: false,
              description: "The project doesn't have 8 council members.",
            },
          ],
          principle: undefined,
        },
      ],
    })
  })

  describe('Stage 1', () => {
    it('works', () => {
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
        missing: undefined,
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            requirements: [
              {
                satisfied: true,
                description: 'The project calls itself a rollup.',
              },
              {
                description:
                  'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                satisfied: true,
              },
            ],
            principle: undefined,
          },
          {
            stage: 'Stage 1',
            requirements: [
              {
                satisfied: true,
                description: 'The project has an escape hatch.',
              },
              {
                satisfied: true,
                description: 'The project has at least 8 council members.',
              },
            ],
            principle: undefined,
          },
        ],
      })
    })

    describe('principle', () => {
      const expiresAt = PROJECT_COUNTDOWNS.stageOneRequirementsChange.expiresAt
      beforeEach(() => {
        PROJECT_COUNTDOWNS.stageOneRequirementsChange.expiresAt =
          UnixTime.now().add(-30, 'days')
      })
      afterEach(() => {
        PROJECT_COUNTDOWNS.stageOneRequirementsChange.expiresAt = expiresAt
      })

      it('handles false', () => {
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
          missing: {
            nextStage: 'Stage 1',
            requirements: [],
            principle: 'Project should have one way to interact.',
          },
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                  satisfied: true,
                },
              ],
              principle: undefined,
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project has an escape hatch.',
                },
                {
                  satisfied: true,
                  description: 'The project has at least 8 council members.',
                },
              ],
              principle: {
                satisfied: false,
                description: 'Project should have one way to interact.',
              },
            },
          ],
        })
      })

      it('handles true', () => {
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
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                  satisfied: true,
                },
              ],
              principle: undefined,
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project has an escape hatch.',
                },
                {
                  satisfied: true,
                  description: 'The project has at least 8 council members.',
                },
              ],
              principle: {
                satisfied: true,
                description: 'Project has one way to interact.',
              },
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
            principle: [true, 'But something something.'],
            hasEscapeHatch: true,
            isCouncil8Members: true,
          },
        })

        expect(result).toEqual({
          stage: 'Stage 1',
          missing: undefined,
          message: undefined,
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                  satisfied: true,
                },
              ],
              principle: undefined,
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project has an escape hatch.',
                },
                {
                  satisfied: true,
                  description: 'The project has at least 8 council members.',
                },
              ],
              principle: {
                satisfied: true,
                description: 'But something something.',
              },
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
      missing: undefined,
      message: undefined,
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            {
              satisfied: true,
              description: 'The project calls itself a rollup.',
            },
            {
              description:
                'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
              satisfied: true,
            },
          ],
          principle: undefined,
        },
        {
          stage: 'Stage 1',
          requirements: [
            {
              satisfied: true,
              description: 'The project has an escape hatch.',
            },
          ],
          principle: undefined,
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
          hasEscapeHatch: [
            'UnderReview',
            'Escape hatch requirement is under review.',
          ],
          isCouncil8Members: true,
        },
      })

      expect(result).toEqual({
        stage: 'Stage 0',
        missing: {
          nextStage: 'Stage 1',
          requirements: ['Escape hatch requirement is under review.'],
          principle: undefined,
        },
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            requirements: [
              {
                satisfied: true,
                description: 'The project calls itself a rollup.',
              },
              {
                description:
                  'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                satisfied: true,
              },
            ],
            principle: undefined,
          },
          {
            stage: 'Stage 1',
            requirements: [
              {
                satisfied: 'UnderReview',
                description: 'Escape hatch requirement is under review.',
              },
              {
                satisfied: true,
                description: 'The project has at least 8 council members.',
              },
            ],
            principle: undefined,
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
        missing: {
          nextStage: 'Stage 1',
          requirements: ['The project has an escape hatch.'],
          principle: undefined,
        },
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            requirements: [
              {
                satisfied: true,
                description: 'The project calls itself a rollup.',
              },
              {
                description:
                  'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.',
                satisfied: true,
              },
            ],
            principle: undefined,
          },
          {
            stage: 'Stage 1',
            requirements: [
              {
                satisfied: 'UnderReview',
                description: 'The project has an escape hatch.',
              },
              {
                satisfied: true,
                description: 'The project has at least 8 council members.',
              },
            ],
            principle: undefined,
          },
        ],
      })
    })
  })
})
