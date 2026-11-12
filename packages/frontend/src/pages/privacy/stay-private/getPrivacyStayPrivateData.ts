import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyAdviceData } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { PRIVACY_STAY_PRIVATE_PATH } from '../methodology/paths'
import { renderStayPrivateMarkdown } from './renderStayPrivateMarkdown'
import { STAY_PRIVATE } from './stayPrivateCopy'
import {
  parseStayPrivateQuery,
  type StayPrivateQuery,
} from './stayPrivateQuery'

export async function getPrivacyStayPrivateData(
  manifest: Manifest,
  query: StayPrivateQuery,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    getCachedAdviceData(cache),
  ])
  const initial = parseStayPrivateQuery(query, data)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: STAY_PRIVATE.title,
        title: `${STAY_PRIVATE.title} with Ethereum privacy protocols - ETHBEAT`,
        description: STAY_PRIVATE.description,
        // One canonical page whatever the picks in the query.
        url: PRIVACY_STAY_PRIVATE_PATH,
        openGraph: {
          image: '/meta-images/privacy/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacyStayPrivatePage',
      props: {
        ...appLayoutProps,
        ...data,
        initialChoices: initial.choices,
        initialProtocol: initial.protocol,
      },
    },
  }
}

export async function getPrivacyStayPrivateMarkdown(cache: InMemoryCache) {
  return renderStayPrivateMarkdown(await getCachedAdviceData(cache))
}

function getCachedAdviceData(cache: InMemoryCache) {
  return cache.get(
    {
      key: ['privacy', 'stay-private', 'data'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    getPrivacyAdviceData,
  )
}
