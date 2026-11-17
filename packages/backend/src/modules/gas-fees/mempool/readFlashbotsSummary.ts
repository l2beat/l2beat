import { UnixTime } from '@l2beat/shared-pure'

const ARCHIVE = 'https://mempool-dumpster.flashbots.net/ethereum/mainnet'

export type FetchText = (
  url: string,
) => Promise<{ status: number; text: string }>

/**
 * "Included on-chain" in Flashbots' summary of a UTC day: the mempool
 * transactions that landed. undefined when there is no summary of the day.
 */
export async function readFlashbotsLandedCount(
  fetchText: FetchText,
  day: UnixTime,
): Promise<number | undefined> {
  const date = UnixTime.toYYYYMMDD(day)
  const url = `${ARCHIVE}/${date.slice(0, 7)}/${date}_summary.txt`
  const response = await fetchText(url)
  // The archive's storage may answer a missing file with 403
  if (response.status === 404 || response.status === 403) return undefined
  if (response.status !== 200) {
    throw new Error('Flashbots summary error', {
      cause: { url, status: response.status },
    })
  }
  return parseLandedCount(response.text)
}

/** From a line like `- Included on-chain:    818,146 (72.9%)` */
export function parseLandedCount(summary: string): number {
  const match = summary.match(/Included on-chain:\s*([\d,]+)/)
  if (!match?.[1]) {
    throw new Error('Flashbots summary malformed')
  }
  return Number(match[1].replaceAll(',', ''))
}

export async function fetchText(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  return { status: response.status, text: await response.text() }
}
