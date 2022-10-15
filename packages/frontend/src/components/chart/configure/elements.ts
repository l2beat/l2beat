export type ChartElements = ReturnType<typeof getChartElements>

export function getChartElements(chart: HTMLElement) {
  return {
    chart,
    controls: {
      // this one is outside the chart!
      showCombined: document.querySelector<HTMLInputElement>(
        '[data-role="chart-combined"] input',
      ),
      showActivity: chart.querySelector<HTMLInputElement>(
        '[data-role="toggle-tvl-activity"]',
      ),
      showEthereum: chart.querySelector<HTMLInputElement>(
        '[data-role="toggle-ethereum-activity"] input',
      ),
      days: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-range-controls"] input',
        ),
      ),
      currency: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-currency-controls"] input',
        ),
      ),
      tokens: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-token-controls"] input',
        ),
      ),
      scale: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-scale-controls"] input',
        ),
      ),
    },
    view: {
      labels: Array.from(
        chart.querySelectorAll<HTMLElement>('[data-role="chart-label"]'),
      ),
      canvas: chart.querySelector<HTMLCanvasElement>(
        '[data-role="chart-canvas"]',
      ),
      loader: chart.querySelector<HTMLElement>('[data-role="chart-loader"]'),
      currencyControlsWrapper: chart.querySelector<HTMLElement>(
        '[data-role="chart-currency-controls"]',
      ),
      tokenControlsWrapper: chart.querySelector<HTMLElement>(
        '[data-role="chart-token-controls"]',
      ),
      showElementControlWrapper: chart.querySelector<HTMLElement>(
        '[data-role="toggle-ethereum-activity"]',
      ),
    },
  }
}
