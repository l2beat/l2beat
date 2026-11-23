export interface Refusal {
  status: number
  /** The `Server` header, which only CloudFront's own errors set to it */
  server?: string
}

/**
 * Whether a provider refused a call for the rate, which is what the rate
 * limiter steps down on. A 429 always is. A 403 is only from a provider
 * whose CloudFront answers so (`refusesRateWithCloudFront403`), and only
 * when CloudFront itself wrote it: an error from the RPC server behind it
 * passes through without `Server: CloudFront`, and a 403 from there may
 * be a block that no rate lifts.
 */
export function isRefusedForRate(
  refusal: Refusal,
  refusesRateWithCloudFront403 = false,
): boolean {
  if (refusal.status === 429) {
    return true
  }
  return (
    refusesRateWithCloudFront403 &&
    refusal.status === 403 &&
    refusal.server?.toLowerCase() === 'cloudfront'
  )
}

/** The refusal HttpClient puts in a failed call's cause, if any */
export function readRefusal(error: unknown): Refusal | undefined {
  if (!(error instanceof Error)) {
    return undefined
  }
  const cause: unknown = error.cause
  if (typeof cause !== 'object' || cause === null) {
    return undefined
  }
  const { status, server } = cause as Record<string, unknown>
  if (typeof status !== 'number') {
    return undefined
  }
  return { status, server: typeof server === 'string' ? server : undefined }
}
