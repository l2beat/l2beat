import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  loadOpengraphKit,
  type OpengraphKit,
  renderOpengraphPng,
} from '~/components/opengraph-image/heartbeat/render'
import { TokenOpengraphImage } from '~/components/opengraph-image/Token'
import {
  findInteropAbstractToken,
  type InteropAbstractToken,
} from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  detectImageMimeType,
  type SupportedMimeType,
} from './detectImageMimeType'

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

  const assets = await getStaticAssets()
  const iconSrc = await fetchIconDataUri(
    token.iconUrl,
    assets.placeholderIconSrc,
  )

  return renderTokenPng(assets, token, iconSrc).catch((error) => {
    if (iconSrc === assets.placeholderIconSrc) throw error
    return renderTokenPng(assets, token, assets.placeholderIconSrc)
  })
}

function renderTokenPng(
  assets: StaticAssets,
  token: InteropAbstractToken,
  iconSrc: string,
): Promise<Buffer> {
  return renderOpengraphPng(
    TokenOpengraphImage({
      measure: assets.kit.measure,
      iconSrc,
      symbol: token.symbol,
    }),
    assets.kit,
  )
}

interface StaticAssets {
  kit: OpengraphKit
  placeholderIconSrc: string
}

let staticAssetsPromise: Promise<StaticAssets> | undefined

function getStaticAssets(): Promise<StaticAssets> {
  staticAssetsPromise ??= loadStaticAssets().catch((error) => {
    staticAssetsPromise = undefined
    throw error
  })
  return staticAssetsPromise
}

async function loadStaticAssets(): Promise<StaticAssets> {
  const staticDir = path.join(process.cwd(), 'static')
  const [kit, placeholderIcon] = await Promise.all([
    loadOpengraphKit(staticDir),
    readFile(path.join(staticDir, 'images/token-placeholder.png')),
  ])
  return {
    kit,
    placeholderIconSrc: toDataUri('image/png', placeholderIcon),
  }
}

async function fetchIconDataUri(
  iconUrl: string | null,
  placeholderSrc: string,
): Promise<string> {
  if (!iconUrl) return placeholderSrc
  try {
    const response = await fetch(iconUrl, {
      signal: AbortSignal.timeout(ICON_FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return placeholderSrc
    const data = Buffer.from(await response.arrayBuffer())
    // coingecko mislabels icons (fxUSD is a png served as image/jpeg) and satori
    // picks its decoder from the data uri, so the bytes decide the type
    const mimeType = detectImageMimeType(data)
    if (!mimeType) return placeholderSrc
    return toDataUri(mimeType, data)
  } catch {
    return placeholderSrc
  }
}

function toDataUri(mimeType: SupportedMimeType, data: Buffer): string {
  return `data:${mimeType};base64,${data.toString('base64')}`
}
