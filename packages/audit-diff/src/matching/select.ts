import { lineSimilarity } from '../diffing/similarity.js'
import type { AuditedUnitVersion } from './index.js'

export interface VersionSelection {
  version: AuditedUnitVersion
  identical: boolean
  /** Similarity of comparable texts, 1 for identical. */
  similarity: number
  /** True when the chosen version is not the newest audited one. */
  laterAuditedVersionExists: boolean
}

/**
 * Picks the audited version to compare against.
 *
 * 1. Newest → oldest, the first version whose comparable text (comments and
 *    require messages removed) equals the deployed one wins: `identical`.
 * 2. Otherwise the version with the highest comparable similarity wins, the
 *    newer one on ties. So a deployed unit copied from an older release is
 *    compared with that release and not with the latest audited revision;
 *    `laterAuditedVersionExists` tells the reader that newer audited code
 *    exists.
 */
export function selectVersion(
  deployedComparable: string,
  deployedComparableLines: string,
  versions: AuditedUnitVersion[],
): VersionSelection | undefined {
  const newest = versions[0]
  if (!newest) return undefined

  for (const version of versions) {
    if (version.comparable === deployedComparable) {
      return {
        version,
        identical: true,
        similarity: 1,
        laterAuditedVersionExists: version !== newest,
      }
    }
  }

  let best = newest
  let bestSimilarity = -1
  for (const version of versions) {
    const similarity = lineSimilarity(
      deployedComparableLines,
      version.comparableLines,
    )
    if (similarity > bestSimilarity) {
      best = version
      bestSimilarity = similarity
    }
  }
  return {
    version: best,
    identical: false,
    similarity: bestSimilarity,
    laterAuditedVersionExists: best !== newest,
  }
}
