export type Outputs = ReturnType<typeof getOutputs>

export function getOutputs(chart: Element) {
  const $ = <T extends HTMLElement>(selector: string) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chart.querySelector<T>(selector)!
  const $$ = <T extends HTMLElement>(selector: string) =>
    Array.from(chart.querySelectorAll<T>(selector))

  return {
    canvas: $<HTMLCanvasElement>('.chart__canvas'),
    loader: $('.chart__loader'),
    range: $('.chart__range'),
    description: $('.chart__description'),
    labels: $$('.chart__label'),
  }
}
