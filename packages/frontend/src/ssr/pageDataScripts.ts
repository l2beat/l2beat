import type { ClientSsrData } from './types'

/*
 * The server writes the page data into `<script type="application/json">`
 * elements after `#root`, so the browser paints the SSR markup before it
 * downloads the data, and parses the data as JSON instead of as a JS literal.
 * Module scripts run after the document is parsed, so these are in the DOM by
 * the time anything reads them. The ids match `index.html`.
 */

let ssrData: ClientSsrData | undefined

/** Cached: the payload is hundreds of KB, and dev tools read it again. */
export function getSsrData(): ClientSsrData {
  ssrData ??= readJsonScript<ClientSsrData>('ssr-data')
  return ssrData
}

export function getEnvData(): Record<string, string> {
  return readJsonScript('env-data')
}

function readJsonScript<T>(id: string): T {
  const text = document.getElementById(id)?.textContent
  if (!text) {
    throw new Error('Page data script missing', { cause: { id } })
  }
  return JSON.parse(text) as T
}
