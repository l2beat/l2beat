import { makeQuery } from '../../../scripts/query'

export type Outputs = ReturnType<typeof getOutputs>

export function getOutputs(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    canvas: $<HTMLCanvasElement>('[data-role="chart-canvas"]'),
    loader: $('[data-role="chart-loader"]'),
    range: $('[data-role="chart-range"]'),
    description: $('[data-role="chart-description"]'),
    labels: $$('[data-role="chart-label"]'),
  }
}
