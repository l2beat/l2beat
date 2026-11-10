import type { ProjectPrivacyInfo } from '@l2beat/config'
import { getPrivacyBucketAddress } from '@l2beat/shared'

/**
 * The tracked chains a privacy project has a page for, in `trackedOn` order:
 * those with buckets or with their own assessment, and the first chain once
 * another one has its own. With fewer than two the project has one page.
 */
export function getPrivacyPageChains(
  privacyInfo: Pick<
    ProjectPrivacyInfo,
    'trackedOn' | 'tokens' | 'chainAssessments'
  >,
): string[] {
  const assessed = Object.keys(privacyInfo.chainAssessments ?? {})
  const withBuckets = new Set(
    privacyInfo.tokens.flatMap((token) =>
      token.buckets.map(
        (bucket) => getPrivacyBucketAddress(bucket.address).chain,
      ),
    ),
  )
  return privacyInfo.trackedOn.filter(
    (chain, i) =>
      withBuckets.has(chain) ||
      assessed.includes(chain) ||
      (i === 0 && assessed.length > 0),
  )
}

/** The first page chain is shown at the project's own URL. */
export function getPrivacyChainPagePath(
  slug: string,
  pageChains: string[],
  chain: string,
): `/${string}` {
  const path = `/privacy/projects/${slug}` as const
  return chain === pageChains[0] ? path : `${path}/${chain}`
}
