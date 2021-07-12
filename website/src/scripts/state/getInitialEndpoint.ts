export function getInitialEndpoint(chart: HTMLElement) {
  const endpoint = chart.dataset.endpoint
  if (endpoint) {
    delete chart.dataset.endpoint
  }
  return endpoint
}
