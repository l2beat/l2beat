import { classifyStratum } from './classify.js'
import {
  extractCodexFindings,
  extractHumanComments,
  findCodexReview,
} from './comments.js'
import type { GithubClient } from './github.js'
import { findLinearIssueId, type LinearSource } from './linear.js'
import type { Dataset, DatasetEntry } from './types.js'

export async function buildEntry(
  gh: GithubClient,
  linear: LinearSource,
  pr: number,
): Promise<DatasetEntry> {
  const [pull, changedFiles, comments, reviews] = await Promise.all([
    gh.getPull(pr),
    gh.getChangedFiles(pr),
    gh.getReviewComments(pr),
    gh.getReviews(pr),
  ])
  if (!pull.merged_at) {
    throw new Error(`PR #${pr} is not merged`)
  }

  const linearIssueId = findLinearIssueId(pull.body, pull.head.ref)
  const codexReview = findCodexReview(reviews)
  const reviewedCommitDate = codexReview
    ? await gh.getCommitDate(codexReview.commit_id)
    : undefined

  return {
    pr,
    url: pull.html_url,
    title: pull.title,
    author: pull.user.login,
    mergedAt: pull.merged_at,
    headSha: pull.head.sha,
    baseSha: pull.base.sha,
    mergeCommitSha: pull.merge_commit_sha,
    stratum: classifyStratum(changedFiles),
    changedFiles,
    linearIssueId,
    linear: linearIssueId ? await linear.snapshot(linearIssueId) : null,
    humanComments: extractHumanComments(comments, reviews, pull.user.login),
    codexFindings: extractCodexFindings(comments),
    codexReview: codexReview && {
      submittedAt: codexReview.submitted_at,
      reviewedCommitSha: codexReview.commit_id,
      latencyMs: reviewedCommitDate
        ? Date.parse(codexReview.submitted_at) - Date.parse(reviewedCommitDate)
        : undefined,
    },
  }
}

export async function buildDataset(
  gh: GithubClient,
  linear: LinearSource,
  prs: number[],
  log: (message: string) => void,
): Promise<Dataset> {
  const entries: DatasetEntry[] = []
  for (const pr of prs) {
    const entry = await buildEntry(gh, linear, pr)
    log(
      `#${pr} ${entry.stratum} human=${entry.humanComments.length} codex=${entry.codexFindings.length} linear=${entry.linearIssueId ?? '-'}${entry.linearIssueId && !entry.linear ? ' (unresolved)' : ''}`,
    )
    entries.push(entry)
  }
  return {
    version: 1,
    repo: gh.repo,
    builtAt: new Date().toISOString(),
    entries: entries.sort((a, b) => a.pr - b.pr),
  }
}
