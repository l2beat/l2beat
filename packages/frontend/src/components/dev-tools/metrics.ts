import { formatBytes } from '~/utils/number-format/formatBytes'
import type { SizeMetrics } from './sizeMetrics'

export interface DevToolsMetric {
  label: string
  value: string
  description: string
}

export function getDevToolsMetrics(sizeMetrics: SizeMetrics): DevToolsMetric[] {
  return [
    {
      label: 'SSR JSON',
      value: formatBytes(sizeMetrics.ssrDataBytes),
      description:
        'Byte size of JSON.stringify(window.__SSR_DATA__). Raw/minified SSR props payload.',
    },
    {
      label: 'DOM HTML',
      value: formatBytes(sizeMetrics.domHtmlBytes),
      description:
        'Byte size of document.documentElement.outerHTML at this moment (after hydration/runtime updates).',
    },
    {
      label: 'HTML transfer',
      value: sizeMetrics.htmlTransferBytes
        ? formatBytes(sizeMetrics.htmlTransferBytes)
        : 'N/A',
      description:
        'Transferred network bytes for the main HTML document, including protocol overhead/headers where reported by the browser.',
    },
    {
      label: 'Page transfer',
      value: formatBytes(sizeMetrics.pageTransferBytes),
      description:
        'Approximate total transferred bytes: HTML transfer plus transferSize of all recorded resource entries.',
    },
    {
      label: 'Page body',
      value: formatBytes(sizeMetrics.pageBodyBytes),
      description:
        'Approximate total encoded response-body bytes (no headers): HTML body plus encodedBodySize of resources.',
    },
    {
      label: 'HTML body',
      value: sizeMetrics.htmlBodyBytes
        ? formatBytes(sizeMetrics.htmlBodyBytes)
        : 'N/A',
      description:
        'Encoded body bytes for the main HTML document only (compressed payload, without headers).',
    },
    {
      label: 'Resources',
      value: String(sizeMetrics.resourceCount),
      description:
        "Number of Performance 'resource' entries included in page totals (scripts, styles, images, fonts, fetch/XHR, etc.).",
    },
  ]
}
