import type { ProjectPrivacyInfo } from '@l2beat/config'
import { getPrivacyBucketAddress } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'

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

/** The project once per page chain, or once as it is when it has one page. */
export function getPrivacyProjectPages<
  T extends { slug: string; privacyInfo: ProjectPrivacyInfo },
>(project: T): { project: T; chain?: string; path: `/${string}` }[] {
  const chains = getPrivacyPageChains(project.privacyInfo)
  return chains.length > 1
    ? chains.map((chain) => ({
        project: getPrivacyProjectOnChain(project, chain),
        chain,
        path: getPrivacyChainPagePath(project.slug, chains, chain),
      }))
    : [{ project, path: `/privacy/projects/${project.slug}` }]
}

/**
 * The project as it is tracked and rated on one of its page chains: only the
 * buckets and the key registry there, and that chain's assessment.
 */
export function getPrivacyProjectOnChain<
  T extends { privacyInfo: ProjectPrivacyInfo },
>(project: T, chain: string): T {
  const { chainAssessments, anonymitySet, ...privacyInfo } = project.privacyInfo
  const isElsewhere =
    anonymitySet?.type === 'key-registrations' &&
    ChainSpecificAddress.longChain(anonymitySet.registry) !== chain
  return {
    ...project,
    privacyInfo: {
      ...privacyInfo,
      ...chainAssessments?.[chain],
      anonymitySet: isElsewhere ? undefined : anonymitySet,
      tokens: privacyInfo.tokens.flatMap((token) => {
        const buckets = token.buckets.filter(
          (bucket) => getPrivacyBucketAddress(bucket.address).chain === chain,
        )
        return buckets.length === 0 ? [] : [{ ...token, buckets }]
      }),
    },
  }
}
