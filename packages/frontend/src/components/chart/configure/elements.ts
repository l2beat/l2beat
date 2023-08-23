export type ChartElements = ReturnType<typeof getChartElements>

export function getChartElements(chart: HTMLElement) {
  return {
    chart,
    controls: {
      // this one is outside the chart!
      showCombined: document.querySelector<HTMLInputElement>(
        '[data-role="chart-combined"]',
      ),
      chartType: Array.from(
        chart.querySelectorAll<HTMLInputElement>(
          '[data-role="radio-chart-type-controls"] input',
        ),
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
      showTokenModal: chart.querySelectorAll<HTMLInputElement>(
        '[data-role="chart-token-toggle"] input',
      ),
      tokenChosen: chart.querySelectorAll<HTMLInputElement>(
        '[data-role="chart-token-chosen"] input',
      ),
      showMoreTokensToBeRemoved: chart.querySelector<HTMLButtonElement>(
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
      tvlHeader: chart.parentNode?.querySelector<HTMLElement>(
        '[data-role="chart-header-currency"]',
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
      showTokenModalWrapper: chart.querySelectorAll<HTMLElement>(
        '[data-role="chart-token-toggle"]',
      ),
      tokenChosenWrapper: chart.querySelectorAll<HTMLElement>(
        '[data-role="chart-token-chosen"]',
      ),
      tokenModal: chart.querySelector<HTMLElement>(
        '[data-role="chart-token-modal"]',
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
      purpleCircle: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-circle-purple"]',
      ),
      yellowTriangle: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-triangle-yellow"]',
      ),
      pinkSquare: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-square-pink"]',
      ),
      contents: chart.querySelector<HTMLElement>(
        '[data-role="chart-hover-contents"]',
      ),
    },
  }
}
