import { makeQuery } from '../query'

export function getControls(chart: Element) {
  const { $$ } = makeQuery(chart)
  return {
    range: $$<HTMLInputElement>('.chart__range-controls input'),
    currency: $$<HTMLInputElement>('.chart__currency-controls input'),
    scale: $$<HTMLInputElement>('.chart__scale-controls input'),
    token: $$<HTMLInputElement>('.chart__token-controls input'),
  }
}
