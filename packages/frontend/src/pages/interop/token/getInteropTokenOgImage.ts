import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { TokenOpengraphImage } from '~/components/opengraph-image/Token'
import {
  getActiveInteropAbstractTokens,
  type InteropAbstractToken,
} from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  detectImageMimeType,
  type SupportedMimeType,
} from './detectImageMimeType'

const OG_IMAGE_SIZE = { width: 1200, height: 630 }
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
  const tokens = await getActiveInteropAbstractTokens()
  const token = tokens.find((token) => token.id === slug)
  if (!token) return undefined

  const assets = await getStaticAssets()
  const iconSrc = await fetchIconDataUri(
    token.iconUrl,
    assets.placeholderIconSrc,
  )

  const svg = await renderTokenSvg(assets, token, iconSrc).catch((error) => {
    if (iconSrc === assets.placeholderIconSrc) throw error
    return renderTokenSvg(assets, token, assets.placeholderIconSrc)
  })
  return new Resvg(svg).render().asPng()
}

function renderTokenSvg(
  assets: StaticAssets,
  token: InteropAbstractToken,
  iconSrc: string,
): Promise<string> {
  return satori(
    TokenOpengraphImage({
      backgroundSrc: assets.backgroundSrc,
      iconSrc,
      symbol: token.symbol,
      caption: token.issuer?.toUpperCase(),
      size: OG_IMAGE_SIZE,
    }),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        {
          name: 'roboto',
          data: assets.robotoMedium,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'roboto',
          data: assets.robotoBold,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
}

interface StaticAssets {
  robotoMedium: Buffer
  robotoBold: Buffer
  backgroundSrc: string
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
  const [robotoMedium, robotoBold, background, placeholderIcon] =
    await Promise.all([
      readFile(path.join(staticDir, 'fonts/roboto/roboto-latin-500.ttf')),
      readFile(path.join(staticDir, 'fonts/roboto/roboto-latin-700.ttf')),
      readFile(path.join(staticDir, 'meta-images/project-background.png')),
      readFile(path.join(staticDir, 'images/token-placeholder.png')),
    ])
  return {
    robotoMedium,
    robotoBold,
    backgroundSrc: toDataUri('image/png', background),
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
