import { makeQuery } from './query'

export type Outputs = ReturnType<typeof getOutputs>

export function getOutputs(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    canvas: $<HTMLCanvasElement>('.chart__canvas'),
    loader: $('.chart__loader'),
    range: $('.chart__range'),
    description: $('.chart__description'),
    labels: $$('.chart__label'),
  }
}
