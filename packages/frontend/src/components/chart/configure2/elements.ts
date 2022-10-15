export type ChartElements = ReturnType<typeof getChartElements>

export function getChartElements(chart: HTMLElement) {
  return {
    chart,
    controls: {
      showCombined: chart.querySelector<HTMLInputElement>(
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
    },
  }
}
