export function getInitialEndpoint(
  type: 'tvl' | 'activity',
  chart: HTMLElement,
  selectedToken?: HTMLInputElement,
) {
  if (type === 'activity') {
    return getActivityEndpoint(chart)
  }

  if (selectedToken) {
    return getTvlEndpoint(selectedToken)
  }
  return getTvlEndpoint(chart)
}

export function getTvlEndpoint(element: HTMLElement) {
  const endpoint = element.dataset.tvlEndpoint
  if (!endpoint) {
    throw new Error('Initial endpoint missing!')
  }
  return endpoint
}

export function getActivityEndpoint(element: HTMLElement) {
  const endpoint = element.dataset.activityEndpoint
  if (!endpoint) {
    throw new Error('Activity endpoint missing!')
  }
  return endpoint
}

export function getEthereumActivityEndpoint(
  showEthereumActivity: boolean | undefined,
  element: HTMLElement,
) {
  if (!showEthereumActivity) {
    return
  }

  const endpoint = element.dataset.ethereumActivityEndpoint
  if (!endpoint) {
    throw new Error('Ethereum activity endpoint missing!')
  }
  return endpoint
}
