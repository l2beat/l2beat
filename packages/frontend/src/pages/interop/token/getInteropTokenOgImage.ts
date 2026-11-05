import path from 'node:path'
import {
  loadOpengraphKit,
  type OpengraphKit,
  renderOpengraphPng,
} from '~/components/opengraph-image/heartbeat/render'
import { TokenOpengraphImage } from '~/components/opengraph-image/Token'
import { findInteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'

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
  return renderOpengraphPng(
    TokenOpengraphImage({ measure: kit.measure, symbol: token.symbol }),
    kit,
  )
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
