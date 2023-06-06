import { createGetStage } from './stage'

export type StageChecklist = Parameters<typeof getStage>[0]

export const getStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup',
        negative: "The project doesn't call itself a rollup",
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    items: {
      isCouncil8Members: {
        positive: 'The project has at least 8 council members',
        negative: "The project doesn't have 8 council members",
      },
    },
  },
})
