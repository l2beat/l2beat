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
 * The pages of a privacy project. Its metrics are always of all its chains,
 * its risk research of one deployment. The project's URL shows the research
 * of its reference deployment, the first tracked chain. A chain that is
 * researched on its own (`chainAssessments`) also gets a page, under it.
 */
export function getPrivacyProjectPages<
  T extends { slug: string; privacyInfo: ProjectPrivacyInfo },
>(project: T): PrivacyProjectPage<T>[] {
  const path = getPrivacyProjectPath(project.slug)
  const researched = getPrivacyResearchedChains(project.privacyInfo)
  if (researched.length < 2) {
    return [{ project, path }]
  }
  return researched.map((chain, i) => ({
    project: getPrivacyProjectResearchedOn(project, chain),
    chain,
    path: i === 0 ? path : `${path}/${chain}`,
  }))
}

export function getPrivacyProjectPath(slug: string) {
  return `/privacy/projects/${slug}` as const
}

/**
 * The chains the project is deployed on as separate deployments: those with
 * buckets or with research of their own, in `trackedOn` order. Once there are
 * several, the first tracked chain is one of them: it is the reference
 * deployment, which the project's own assessment rates. With fewer than two
 * the project is shown as a single deployment.
 */
export function getPrivacyDeploymentChains(
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

/** The reference deployment, then the deployments researched on their own. */
export function getPrivacyResearchedChains(
  privacyInfo: Pick<
    ProjectPrivacyInfo,
    'trackedOn' | 'tokens' | 'chainAssessments'
  >,
): string[] {
  return getPrivacyDeploymentChains(privacyInfo).filter(
    (chain, i) =>
      i === 0 || privacyInfo.chainAssessments?.[chain] !== undefined,
  )
}

/**
 * The project as it is rated on one deployment: that chain's assessment, or
 * the project's own when the chain has none. Its buckets stay all chains'.
 */
export function getPrivacyProjectResearchedOn<
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
    },
  }
}

/**
 * The project as it is tracked and rated on one chain: its assessment there,
 * and only its buckets there. Anonymity sets never combine across chains.
 */
export function getPrivacyProjectOnChain<
  T extends { privacyInfo: ProjectPrivacyInfo },
>(project: T, chain: string): T {
  const researched = getPrivacyProjectResearchedOn(project, chain)
  return {
    ...researched,
    privacyInfo: {
      ...researched.privacyInfo,
      tokens: researched.privacyInfo.tokens.flatMap((token) => {
        const buckets = token.buckets.filter(
          (bucket) => getPrivacyBucketAddress(bucket.address).chain === chain,
        )
        return buckets.length === 0 ? [] : [{ ...token, buckets }]
      }),
    },
  }
}

/**
 * The project as its anonymity set is measured: on its reference deployment
 * when it has several, since anonymity sets never combine across chains.
 */
export function getPrivacyAnonymitySetProject<
  T extends { privacyInfo: ProjectPrivacyInfo },
>(project: T): T {
  const [reference, ...others] = getPrivacyDeploymentChains(project.privacyInfo)
  return reference !== undefined && others.length > 0
    ? getPrivacyProjectOnChain(project, reference)
    : project
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
