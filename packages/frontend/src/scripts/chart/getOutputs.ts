import { makeQuery } from '../query'

export type Outputs = ReturnType<typeof getOutputs>

export function getOutputs(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    canvas: $<HTMLCanvasElement>('.Chart-Canvas'),
    loader: $('.Chart-Loader'),
    range: $('.Chart-Range'),
    description: $('.Chart-Description'),
    labels: $$('.Chart-Label'),
  }
}
