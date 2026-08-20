import type { BaseProject } from '../../types'
import { AI_GUARD_RAIL } from '../compare'

/** DA layers the backend has indexers for. */
const TRACKED_DA_LAYERS = new Set(['ethereum', 'celestia', 'avail', 'eigenda'])

/**
 * Projects that post to a tracked DA layer but have no daTracking yet.
 * Adding tracking is purely additive (nothing gets wiped), it just needs the
 * identity fields and an on-chain-verified sinceBlock - see the new-project
 * checklist in docs/da-tracking.md. Remove the entry here together with
 * adding the config.
 */
export const MISSING_DA_TRACKING: string[] = [
  'cartesi-prt-honeypot-v2',
  'deri',
  'ethscriptions',
  'facet',
  'fluent',
  'lightlink',
  'roninnetwork',
  'sxnetwork',
]

/**
 * Since templates stopped deriving daTracking, nothing adds it to a new
 * project automatically - and no test can tell "posts to an untracked layer"
 * from "forgotten". This check narrows the gap: a live scaling project whose
 * DA row names a layer we have indexers for is expected to declare a
 * daTracking array.
 */
export function findMissingDaTracking(
  projects: BaseProject[],
  allowlist: string[] = MISSING_DA_TRACKING,
): string[] {
  const allowed = new Set(allowlist)
  return projects
    .filter(
      (p) =>
        p.scalingInfo &&
        !p.archivedAt &&
        !p.daTrackingConfig?.length &&
        !allowed.has(p.id) &&
        p.scalingDa?.some(
          (da) =>
            da.layer.projectId && TRACKED_DA_LAYERS.has(da.layer.projectId),
        ),
    )
    .map((p) => p.id)
}

export function missingMessage(projectIds: string[]): string {
  return [
    'da-tracking is missing for projects posting to a tracked DA layer:',
    ...projectIds.map((id) => `- ${id}`),
    "Add a daTracking array to the project's .ts following the new-project checklist in docs/da-tracking.md (helper call for a template stack posting to ethereum, a literal entry otherwise; sinceBlock = first real post, verified on-chain), check it with 'pnpm da:preview <projectId>' and regenerate the snapshot. If the project genuinely cannot be tracked yet, add it to MISSING_DA_TRACKING in packages/config/src/snapshots/daTracking/missing.ts with a comment saying why.",
    AI_GUARD_RAIL,
  ].join('\n')
}
