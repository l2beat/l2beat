export type ChartElements = ReturnType<typeof getChartElements>

export function getChartElements(chart: HTMLElement) {
  return {
    chart,
    controls: {
      // this one is outside the chart!
      showCombined: document.querySelector<HTMLInputElement>(
        '[data-role="chart-combined"]',
      ),
      showActivity: chart.querySelector<HTMLInputElement>(
        '[data-role="toggle-tvl-activity"]',
      ),
      showEthereum: chart.querySelector<HTMLInputElement>(
        '[data-role="toggle-ethereum-activity"]',
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
      showMoreTokens: chart.querySelector<HTMLButtonElement>(
        '[data-role="chart-more-tokens"]',
      ),
      scale: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-scale-controls"] input',
        ),
      ),
    },
    view: {
      view: chart.querySelector<HTMLElement>('[data-role="chart-view"]'),
      labels: Array.from(
        chart.querySelectorAll<HTMLElement>('[data-role="chart-label"]'),
      ),
      canvas: chart.querySelector<HTMLCanvasElement>(
        '[data-role="chart-canvas"]',
      ),
      loader: chart.querySelector<HTMLElement>('[data-role="chart-loader"]'),
      dateRange: chart.querySelector<HTMLElement>('[data-role="chart-range"]'),
      currencyControlsWrapper: chart.querySelector<HTMLElement>(
        '[data-role="chart-currency-controls"]',
      ),
      tokenControlsWrapper: chart.querySelector<HTMLElement>(
        '[data-role="chart-token-controls"]',
      ),
      milestones: chart.querySelector<HTMLElement>(
        '[data-role="chart-milestones"]',
      ),
    },
    hover: {
      hover: chart.querySelector<HTMLElement>('[data-role="chart-hover"'),
      line: chart.querySelector<HTMLElement>('[data-role="chart-hover-line"]'),
      circle: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-circle"]',
      ),
      redCircle: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-circle-red"]',
      ),
      blueSquare: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-square-blue"]',
      ),
      greenSquare: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-square-green"]',
      ),
      contents: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-contents"]',
      ),
    },
  }
}
