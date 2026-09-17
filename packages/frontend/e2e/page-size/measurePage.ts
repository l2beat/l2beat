import { brotliCompressSync, constants as zlib } from 'node:zlib'
import type { APIRequestContext } from 'playwright/test'
import { extractSsrData } from '../prefetch/extractSsrData'

export interface PageSize {
  url: string
  status: number
  /** Full response body, uncompressed. What the browser has to parse. */
  html: number
  /** Bytes on the wire: brotli at Cloudflare's quality for dynamic responses. */
  wire: number
  /** Length of the serialized window.__SSR_DATA__ JSON. What React has to hydrate. */
  ssr: number
  /** html minus ssr: server-rendered markup, head and inline env. */
  markup: number
  /** Top-level SSR props keys by serialized size, largest first. Points at the culprit on failure. */
  breakdown: [key: string, bytes: number][]
}

const SSR_MARKER = 'window.__SSR_DATA__='

// Cloudflare compresses dynamic responses with brotli quality 4; measured
// against l2beat.com this reproduces the transferred size within 1%.
const CLOUDFLARE_BROTLI_QUALITY = 4

export async function measurePage(
  request: APIRequestContext,
  url: string,
): Promise<PageSize> {
  const response = await request.get(url, {
    headers: { 'User-Agent': 'L2Beat-Test/1.0' },
    timeout: 30000,
  })
  const html = await response.text()
  const { ssr, breakdown } = measureSsr(html)
  return {
    url,
    status: response.status(),
    html: html.length,
    wire: brotli(html),
    ssr,
    markup: html.length - ssr,
    breakdown,
  }
}

function brotli(html: string): number {
  return brotliCompressSync(html, {
    params: { [zlib.BROTLI_PARAM_QUALITY]: CLOUDFLARE_BROTLI_QUALITY },
  }).length
}

function measureSsr(html: string): Pick<PageSize, 'ssr' | 'breakdown'> {
  if (!html.includes(SSR_MARKER)) {
    return { ssr: 0, breakdown: [] }
  }
  const ssrData = extractSsrData(html)
  const props = (ssrData.props ?? {}) as Record<string, unknown>
  const breakdown = Object.entries(props)
    .map(([key, value]): [string, number] => [
      key,
      JSON.stringify(value)?.length ?? 0,
    ])
    .sort((a, b) => b[1] - a[1])
  return { ssr: JSON.stringify(ssrData).length, breakdown }
}

export function formatPageSize(size: PageSize): string {
  const top = size.breakdown
    .slice(0, 5)
    .map(([key, bytes]) => `${key}=${kb(bytes)}`)
    .join(' ')
  return `${size.url}: wire=${kb(size.wire)} html=${kb(size.html)} ssr=${kb(size.ssr)} markup=${kb(size.markup)} [${top}]`
}

export function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)}K`
}
