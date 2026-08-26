import { classifyStratum } from './classify.js'
import { CODEX_LOGIN, extractHumanComments } from './comments.js'
import type { GithubClient } from './github.js'
import type { Stratum } from './types.js'

export interface Candidate {
  pr: number
  stratum: Stratum
  humanComments: number
  mergedAt: string
}

/**
 * Candidates = merged PRs that Codex reviewed and that got at least
 * `minHumanComments` human review comments, most recent first.
 */
export async function findCandidates(
  gh: GithubClient,
  scan: number,
  minHumanComments: number,
  log: (message: string) => void,
): Promise<Candidate[]> {
  const found = await gh.searchMergedPullsReviewedBy(CODEX_LOGIN, scan)
  log(`scanning ${found.length} codex-reviewed merged PRs`)
  const candidates: Candidate[] = []
  for (const { number: pr } of found) {
    const [pull, comments, reviews] = await Promise.all([
      gh.getPull(pr),
      gh.getReviewComments(pr),
      gh.getReviews(pr),
    ])
    const human = extractHumanComments(comments, reviews, pull.user.login)
    if (human.length < minHumanComments || !pull.merged_at) continue
    const files = await gh.getChangedFiles(pr)
    candidates.push({
      pr,
      stratum: classifyStratum(files),
      humanComments: human.length,
      mergedAt: pull.merged_at,
    })
  }
  return candidates.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
}

export function stratify(
  candidates: Candidate[],
  perStratum: Record<Exclude<Stratum, 'other'>, number>,
): Candidate[] {
  const picked: Candidate[] = []
  for (const stratum of ['backend', 'frontend', 'config'] as const) {
    picked.push(
      ...candidates
        .filter((c) => c.stratum === stratum)
        .slice(0, perStratum[stratum]),
    )
  }
  return picked.sort((a, b) => a.pr - b.pr)
}
