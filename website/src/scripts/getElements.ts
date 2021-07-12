export function getElements(chart: Element) {
  const $ = (selector: string) => chart.querySelector(selector)!
  const $$ = (selector: string) => Array.from(chart.querySelectorAll(selector))

  return {
    output: {
      range: $('.chart__range'),
      description: $('.chart__description'),
      labels: $$('.chart__label'),
    },
    canvas: $('.chart__canvas') as HTMLCanvasElement,
  }
}
