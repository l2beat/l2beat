export function getEndpoint(element: HTMLElement) {
  const endpoint = element.dataset.endpoint
  if (!endpoint) {
    throw new Error('Initial endpoint missing!')
  }
  return endpoint
}
