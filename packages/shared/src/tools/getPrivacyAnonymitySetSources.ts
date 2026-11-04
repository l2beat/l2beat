import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  getPrivacyBucketAddress,
  type PrivacyBucketChainAddress,
} from './getPrivacyBucketAddress'

/** Key registrations belong to no token bucket, so they get a fixed one. */
const KEY_REGISTRATIONS_BUCKET_ID = 'key-registrations'

/** The parts of a project's privacy info that define its anonymity sets. */
export interface PrivacyAnonymitySetInfo {
  tokens: {
    buckets: {
      id: string
      address: ChainSpecificAddress | PrivacyBucketChainAddress
      sinceTimestamp: number
      anonymitySet?: object
      deposit: object
    }[]
  }[]
  anonymitySet?: { type: string }
}

interface KeyRegistrationsInfo {
  type: 'key-registrations'
  registry: ChainSpecificAddress
  sinceTimestamp: number
  event: string
  extractor: string
}

type Source<TToken, TBucket, TDeposit, TRegistration> = {
  bucketId: string
  chain: string
  address: string
  sinceTimestamp: number
} & (
  | { type: 'deposits'; token: TToken; bucket: TBucket; source: TDeposit }
  | {
      type: 'key-registrations'
      source: TRegistration & { params: Record<string, never> }
    }
)

type TrackedBucket<I extends PrivacyAnonymitySetInfo> = Extract<
  I['tokens'][number]['buckets'][number],
  { anonymitySet: object }
>

type KeyRegistrations<I extends PrivacyAnonymitySetInfo> = Extract<
  I['anonymitySet'],
  KeyRegistrationsInfo
>

/** Typed by the caller's privacy info, so sources keep their extractor types. */
export type PrivacyAnonymitySetSource<I extends PrivacyAnonymitySetInfo> =
  Source<
    I['tokens'][number],
    TrackedBucket<I>,
    TrackedBucket<I>['deposit'],
    Pick<KeyRegistrations<I>, 'event' | 'extractor'>
  >

/**
 * Lists a project's anonymity sets: one per tracked token bucket and one for
 * key registrations. Backend indexer configs and frontend series are both
 * built from this list, so their configuration ids match.
 */
export function getPrivacyAnonymitySetSources<
  I extends PrivacyAnonymitySetInfo,
>(privacyInfo: I): PrivacyAnonymitySetSource<I>[]
export function getPrivacyAnonymitySetSources(
  privacyInfo: PrivacyAnonymitySetInfo,
): Source<object, object, object, { event: string; extractor: string }>[] {
  const sources: Source<
    object,
    object,
    object,
    { event: string; extractor: string }
  >[] = []
  for (const token of privacyInfo.tokens) {
    for (const bucket of token.buckets) {
      if (bucket.anonymitySet === undefined) continue
      sources.push({
        type: 'deposits',
        bucketId: bucket.id,
        ...getPrivacyBucketAddress(bucket.address),
        sinceTimestamp: bucket.sinceTimestamp,
        token,
        bucket,
        source: bucket.deposit,
      })
    }
  }

  const anonymitySet = privacyInfo.anonymitySet
  if (isKeyRegistrations(anonymitySet)) {
    sources.push({
      type: 'key-registrations',
      bucketId: KEY_REGISTRATIONS_BUCKET_ID,
      ...getPrivacyBucketAddress(anonymitySet.registry),
      sinceTimestamp: anonymitySet.sinceTimestamp,
      source: {
        event: anonymitySet.event,
        extractor: anonymitySet.extractor,
        params: {},
      },
    })
  }
  return sources
}

function isKeyRegistrations(
  anonymitySet: { type: string } | undefined,
): anonymitySet is KeyRegistrationsInfo {
  return anonymitySet?.type === 'key-registrations'
}
