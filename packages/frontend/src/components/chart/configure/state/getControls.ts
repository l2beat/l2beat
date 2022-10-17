import { makeQuery } from '../../../../scripts/query'

export function getControls(chart: Element) {
  const { $, $$ } = makeQuery(chart)
  return {
    range: $$<HTMLInputElement>('[data-role="chart-range-controls"] input'),
    currencies: $$<HTMLInputElement>(
      '[data-role="chart-currency-controls"] input',
    ),
    currencyControl: $.maybe<HTMLElement>(
      '[data-role="chart-currency-controls"]',
    ),
    scale: $$<HTMLInputElement>('[data-role="chart-scale-controls"] input'),
    tokens: $$<HTMLInputElement>('[data-role="chart-token-controls"] input'),
    tokenControl: $.maybe<HTMLInputElement>(
      '[data-role="chart-token-controls"]',
    ),
    moreTokens: $.maybe('[data-role="chart-more-tokens"]'),
    combined: document.querySelector<HTMLInputElement>(
      '[data-role="chart-combined"]',
    ),
    tvlActivity: document.querySelector<HTMLInputElement>(
      '[data-role="toggle-tvl-activity"]',
    ),
    ethActivity: document.querySelector<HTMLInputElement>(
      '[data-role="toggle-ethereum-activity"]',
    ),
  }
}
