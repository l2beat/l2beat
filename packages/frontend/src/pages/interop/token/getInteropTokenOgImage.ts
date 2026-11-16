import path from 'node:path'
import {
  loadOpengraphKit,
  type OpengraphKit,
  renderOpengraphPng,
} from '~/components/opengraph-image/heartbeat/render'
import { TokenOpengraphImage } from '~/components/opengraph-image/Token'
import { findInteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { detectImageMimeType } from './detectImageMimeType'

const ICON_FETCH_TIMEOUT_MS = 5_000

const ogImageCache = new FrontendInMemoryCache('getInteropTokenOgImage')

export function getInteropTokenOgImage(
  slug: string,
): Promise<Buffer | undefined> {
  return ogImageCache.get(
    {
      key: ['interop', 'tokens', 'og-image', slug],
      ttl: 60 * 60,
      staleWhileRevalidate: 23 * 60 * 60,
    },
    () => renderInteropTokenOgImage(slug),
  )
}

async function renderInteropTokenOgImage(
  slug: string,
): Promise<Buffer | undefined> {
  const token = await findInteropAbstractToken(slug)
  if (!token) return undefined

  const kit = await getKit()
  const icon = await fetchIcon(token.iconUrl)
  const render = (withIcon: boolean) =>
    renderOpengraphPng(
      TokenOpengraphImage({
        measure: kit.measure,
        symbol: token.symbol,
        icon: withIcon ? icon : undefined,
      }),
      kit,
    )
  // An icon that decodes as a PNG or JPEG can still fail to draw, and the
  // symbol alone still makes a good image.
  return render(true).catch((error) => {
    if (icon === undefined) throw error
    return render(false)
  })
}

/** The token's icon as a data URI, unless it can't be fetched or decoded. */
async function fetchIcon(iconUrl: string | null) {
  if (!iconUrl) return undefined
  try {
    const response = await fetch(iconUrl, {
      signal: AbortSignal.timeout(ICON_FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return undefined
    const data = Buffer.from(await response.arrayBuffer())
    // CoinGecko mislabels icons (fxUSD is a PNG served as image/jpeg), and
    // satori picks its decoder from the data URI, so the bytes decide the type.
    const mimeType = detectImageMimeType(data)
    return mimeType && `data:${mimeType};base64,${data.toString('base64')}`
  } catch {
    return undefined
  }
}

let kitPromise: Promise<OpengraphKit> | undefined

function getKit(): Promise<OpengraphKit> {
  kitPromise ??= loadOpengraphKit(path.join(process.cwd(), 'static')).catch(
    (error) => {
      kitPromise = undefined
      throw error
    },
  )
  return kitPromise
}
