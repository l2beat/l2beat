import { expect } from 'earl'

import { createGetStage } from './stage'

const getTestStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup.',
        warning: 'Warning: The project calls itself a rollup.',
        negative: "The project doesn't call itself a rollup.",
      },
    },
  },
  stage1: {
    name: 'Stage 1',
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
  it('Returns Stage 0 with showWarning if project does not fulfill stage 0 requirements', () => {
    const x = getTestStage({
      stage0: {
        callsItselfRollup: [false, 'The project calls itself a chicken.'],
      },
      stage1: {
        hasEscapeHatch: false,
        isCouncil8Members: false,
      },
    })

    expect(x).toEqual({
      stage: 'Stage 0',
      showWarning: true,
      warnings: ['Warning: The project calls itself a rollup.'],
      missing: {
        nextStage: 'Stage 1',
        requirements: [
          "The project doesn't have an escape hatch.",
          "The project doesn't have 8 council members.",
        ],
      },
      summary: [
        {
          requirements: [
            {
              description: 'The project calls itself a chicken.',
              satisfied: false,
            },
          ],
          stage: 'Stage 0',
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
        },
      ],
    })
  })

  it('Stage 0', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
      },
      stage1: {
        hasEscapeHatch: true,
        isCouncil8Members: false,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 0',
      missing: {
        nextStage: 'Stage 1',
        requirements: ["The project doesn't have 8 council members."],
      },
      showWarning: false,
      warnings: [],
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            {
              satisfied: true,
              description: 'The project calls itself a rollup.',
            },
          ],
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
        },
      ],
    })
  })

  it('Stage 1', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
      },
      stage1: {
        hasEscapeHatch: true,
        isCouncil8Members: true,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 1',
      missing: undefined,
      showWarning: false,
      warnings: [],
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            {
              satisfied: true,
              description: 'The project calls itself a rollup.',
            },
          ],
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
        },
      ],
    })
  })

  it('Removes null from missing and summary', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: true,
      },
      stage1: {
        hasEscapeHatch: true,
        isCouncil8Members: null,
      },
    })

    expect(result).toEqual({
      stage: 'Stage 1',
      missing: undefined,
      showWarning: false,
      warnings: [],
      summary: [
        {
          stage: 'Stage 0',
          requirements: [
            {
              satisfied: true,
              description: 'The project calls itself a rollup.',
            },
          ],
        },
        {
          stage: 'Stage 1',
          requirements: [
            {
              satisfied: true,
              description: 'The project has an escape hatch.',
            },
          ],
        },
      ],
    })
  })

  describe('Under review', () => {
    it('Custom description works', () => {
      const result = getTestStage({
        stage0: {
          callsItselfRollup: true,
        },
        stage1: {
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
        },
        showWarning: false,
        warnings: [],
        summary: [
          {
            stage: 'Stage 0',
            requirements: [
              {
                satisfied: true,
                description: 'The project calls itself a rollup.',
              },
            ],
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
          },
        ],
      })
    })

    it('If no description provided, uses the positive description', () => {
      const result = getTestStage({
        stage0: {
          callsItselfRollup: true,
        },
        stage1: {
          hasEscapeHatch: 'UnderReview',
          isCouncil8Members: true,
        },
      })

      expect(result).toEqual({
        stage: 'Stage 0',
        missing: {
          nextStage: 'Stage 1',
          requirements: ['The project has an escape hatch.'],
        },
        showWarning: false,
        warnings: [],
        summary: [
          {
            stage: 'Stage 0',
            requirements: [
              {
                satisfied: true,
                description: 'The project calls itself a rollup.',
              },
            ],
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
          },
        ],
      })
    })
  })
})
