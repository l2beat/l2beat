import { createGetStage } from './stage'
import { expect } from 'earl'

const getTestStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    keys: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup.',
        negative: "The project doesn't call itself a rollup.",
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    keys: {
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
  it('No stage', () => {
    const result = getTestStage({
      stage0: {
        callsItselfRollup: [false, 'It calls itself a chicken.'],
      },
      stage1: {
        hasEscapeHatch: false,
        isCouncil8Members: false,
      },
    })

    expect(result).toEqual({
      stage: 'No stage',
      missing: {
        nextStage: 'Stage 0',
        requirements: [
          "The project doesn't call itself a rollup. It calls itself a chicken.",
        ],
      },
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

    expect(result).toEqual({ stage: 'Stage 1', missing: undefined })
  })
})
