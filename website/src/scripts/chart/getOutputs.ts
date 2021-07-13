export type Outputs = ReturnType<typeof getOutputs>

export function getOutputs(chart: Element) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const $ = (selector: string) => chart.querySelector(selector)!
  const $$ = (selector: string) => Array.from(chart.querySelectorAll(selector))

  return {
    canvas: $('.chart__canvas') as HTMLCanvasElement,
    range: $('.chart__range'),
    description: $('.chart__description'),
    labels: $$('.chart__label'),
  }
}
