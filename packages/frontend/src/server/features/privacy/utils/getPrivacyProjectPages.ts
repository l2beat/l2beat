import type {
  ProjectPrivacyAssessment,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import { getPrivacyBucketAddress } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface PrivacyProjectPage<T> {
  /** The project as it is tracked and rated on this page. */
  project: T
  /** The page's chain, for a project with a page per chain. */
  chain?: string
  path: `/${string}`
}

/**
 * The pages of a privacy project. A project with buckets or assessments on
 * several tracked chains has a page per chain, in `trackedOn` order: its
 * first chain at the project's own URL, the others under it. Any other
 * project has the one page it always had.
 */
export function getPrivacyProjectPages<
  T extends { slug: string; privacyInfo: ProjectPrivacyInfo },
>(project: T): PrivacyProjectPage<T>[] {
  const path = getPrivacyProjectPath(project.slug)
  const chains = getPageChains(project.privacyInfo)
  if (chains.length < 2) {
    return [{ project, path }]
  }
  return chains.map((chain, i) => ({
    project: getPrivacyProjectOnChain(project, chain),
    chain,
    path: i === 0 ? path : `${path}/${chain}`,
  }))
}

export function getPrivacyProjectPath(slug: string) {
  return `/privacy/projects/${slug}` as const
}

/**
 * Chains with buckets or with their own assessment. Once there are several,
 * or a chain is assessed on its own, the first tracked chain is one of them
 * too: the project's URL shows it and the project's own assessment rates it.
 */
function getPageChains(
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
  const chains = privacyInfo.trackedOn.filter(
    (chain) => withBuckets.has(chain) || assessed.includes(chain),
  )
  const withFirst = chains.length > 1 || assessed.length > 0
  return privacyInfo.trackedOn.filter(
    (chain, i) => chains.includes(chain) || (withFirst && i === 0),
  )
}

/**
 * The project as it is tracked and rated on one tracked chain: only the
 * buckets there, and that chain's assessment. A chain's own assessment
 * replaces the project's as a whole. A chain without one shares the
 * project's, except a key registry, which counts for its own chain only.
 */
export function getPrivacyProjectOnChain<
  T extends { privacyInfo: ProjectPrivacyInfo },
>(project: T, chain: string): T {
  const { chainAssessments, ...privacyInfo } = project.privacyInfo
  const own = chainAssessments?.[chain]
  const assessment: ProjectPrivacyAssessment = own ?? {
    exitWindow: privacyInfo.exitWindow,
    adversaries: privacyInfo.adversaries,
    riskSummary: privacyInfo.riskSummary,
    upgradesAndGovernance: privacyInfo.upgradesAndGovernance,
    anonymitySet: isKeyRegistryElsewhere(privacyInfo.anonymitySet, chain)
      ? undefined
      : privacyInfo.anonymitySet,
  }
  return {
    ...project,
    privacyInfo: {
      ...privacyInfo,
      exitWindow: assessment.exitWindow,
      adversaries: assessment.adversaries,
      riskSummary: assessment.riskSummary,
      upgradesAndGovernance: assessment.upgradesAndGovernance,
      anonymitySet: assessment.anonymitySet,
      tokens: privacyInfo.tokens.flatMap((token) => {
        const buckets = token.buckets.filter(
          (bucket) => getPrivacyBucketAddress(bucket.address).chain === chain,
        )
        return buckets.length === 0 ? [] : [{ ...token, buckets }]
      }),
    },
  }
}

function isKeyRegistryElsewhere(
  anonymitySet: ProjectPrivacyAssessment['anonymitySet'],
  chain: string,
): boolean {
  return (
    anonymitySet?.type === 'key-registrations' &&
    ChainSpecificAddress.longChain(anonymitySet.registry) !== chain
  )
}
