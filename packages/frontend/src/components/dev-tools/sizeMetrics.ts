const textEncoder = new TextEncoder()

export interface SizeMetrics {
  ssrDataBytes: number
  domHtmlBytes: number
  htmlTransferBytes: number | undefined
  htmlBodyBytes: number | undefined
  pageTransferBytes: number
  pageBodyBytes: number
  resourceCount: number
}

export function getSizeMetrics(ssrData: unknown): SizeMetrics {
  const ssrDataJson = JSON.stringify(ssrData)
  const domHtml = document.documentElement.outerHTML
  const navigationEntry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const resourceEntries = performance.getEntriesByType(
    'resource',
  ) as PerformanceResourceTiming[]

  const resourceTransferBytes = resourceEntries.reduce((acc, entry) => {
    return acc + entry.transferSize
  }, 0)
  const resourceBodyBytes = resourceEntries.reduce((acc, entry) => {
    return acc + entry.encodedBodySize
  }, 0)

  const htmlTransferBytes = navigationEntry?.transferSize
  const htmlBodyBytes = navigationEntry?.encodedBodySize
  const pageTransferBytes = (htmlTransferBytes ?? 0) + resourceTransferBytes
  const pageBodyBytes = (htmlBodyBytes ?? 0) + resourceBodyBytes

  return {
    ssrDataBytes: textEncoder.encode(ssrDataJson).length,
    domHtmlBytes: textEncoder.encode(domHtml).length,
    htmlTransferBytes,
    htmlBodyBytes,
    pageTransferBytes,
    pageBodyBytes,
    resourceCount: resourceEntries.length,
  }
}
