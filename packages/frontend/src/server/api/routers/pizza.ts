import type { Sentiment, TableReadyValue } from '@l2beat/config'
import { z } from 'zod'
import { ps } from '~/server/projects'
import { procedure, router } from '../trpc'

type PizzaParams = z.infer<typeof PizzaParams>

const PizzaParams = z.object({
  green: z.boolean(),
  yellow: z.boolean(),
  red: z.boolean(),
})

export const pizzaRouter = router({
  projects: procedure.input(PizzaParams).query(async ({ input }) => {
    return getResponse(input)
  }),
})

async function getResponse(requirements: {
  green: boolean
  yellow: boolean
  red: boolean
}) {
  const projects = await ps.getProjects({
    select: ['scalingRisks'],
  })

  const filteredProjects = projects.filter((project) => {
    const targetRisks =
      project.scalingRisks.stacked ?? project.scalingRisks.self

    if (Object.values(targetRisks).some((r) => r === 'UnderReview')) {
      return false
    }
    const colorArray = Object.values(targetRisks).flatMap(
      (risk: TableReadyValue) =>
        risk.sentiment ? sentimentToColor(risk.sentiment) : [],
    )

    const greenCount = colorArray.filter((color) => color === 'green').length
    const yellowCount = colorArray.filter((color) => color === 'yellow').length
    const redCount = colorArray.filter((color) => color === 'red').length

    if (requirements.green && requirements.yellow && requirements.red) {
      return greenCount > 0 && yellowCount > 0 && redCount > 0
    }

    if (requirements.green && requirements.yellow) {
      return greenCount > 0 && yellowCount > 0 && redCount === 0
    }

    if (requirements.green && requirements.red) {
      return greenCount > 0 && redCount > 0 && yellowCount === 0
    }

    if (requirements.yellow && requirements.red) {
      return yellowCount > 0 && redCount > 0 && greenCount === 0
    }

    if (requirements.red) {
      return redCount > 0 && greenCount === 0 && yellowCount === 0
    }

    if (requirements.yellow) {
      return yellowCount > 0 && greenCount === 0 && redCount === 0
    }

    if (requirements.green) {
      return greenCount > 0 && yellowCount === 0 && redCount === 0
    }

    return false
  })

  if (filteredProjects.length === 0) {
    return null
  }

  return pickAtRandom(filteredProjects)
}

function sentimentToColor(sentiment: Sentiment) {
  if (sentiment === 'good') {
    return 'green'
  }
  if (sentiment === 'warning') {
    return 'yellow'
  }
  if (sentiment === 'bad') {
    return 'red'
  }
  return 'gray'
}

function pickAtRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T
}
