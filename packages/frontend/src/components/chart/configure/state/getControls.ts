import { makeQuery } from '../../../../scripts/query'

export function getControls(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    range: $$<HTMLInputElement>('[data-role="chart-range-controls"] input'),
    currency: $$<HTMLInputElement>(
      '[data-role="chart-currency-controls"] input',
    ),
    scale: $$<HTMLInputElement>('[data-role="chart-scale-controls"] input'),
    token: $$<HTMLInputElement>('[data-role="chart-token-controls"] input'),
    moreTokens: $.maybe('[data-role="chart-more-tokens"]'),
    combined: document.querySelector<HTMLInputElement>(
      '[data-role="chart-combined"]',
    ),
    tvlActivity: document.querySelector<HTMLInputElement>(
      '[data-role="toggle-tvl-activity"]',
    ),
  }
}
