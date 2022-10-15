export function getType(element: HTMLElement) {
  const type = element.dataset.type
  if (!type) {
    throw new Error('Chart type missing!')
  }
  if (type !== 'tvl' && type !== 'activity') {
    throw new Error('Chart type invalid!')
  }

  return type
}
