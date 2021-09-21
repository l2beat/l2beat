import { makeQuery } from '../../query'

export function getControls(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    range: $$<HTMLInputElement>('.Chart-RangeControls input'),
    currency: $$<HTMLInputElement>('.Chart-CurrencyControls input'),
    scale: $$<HTMLInputElement>('.Chart-ScaleControls input'),
    token: $$<HTMLInputElement>('.Chart-TokenControls input'),
    moreTokens: $.maybe('.Chart-MoreTokens'),
  }
}
