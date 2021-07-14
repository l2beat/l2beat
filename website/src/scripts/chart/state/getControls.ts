export function getControls(chart: Element) {
  const $$ = (selector: string) => Array.from(chart.querySelectorAll(selector))

  return {
    range: $$('.chart__range-controls input') as HTMLInputElement[],
    currency: $$('.chart__currency-controls input') as HTMLInputElement[],
    scale: $$('.chart__scale-controls input') as HTMLInputElement[],
    token: $$('.chart__token-controls input') as HTMLInputElement[],
  }
}
