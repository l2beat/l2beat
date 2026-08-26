import type { CodexFinding, ReviewComment } from './types.js'

export const CODEX_LOGIN = 'chatgpt-codex-connector[bot]'

export interface RawReviewComment {
  id: number
  user: { login: string; type: string }
  path: string
  line: number | null
  original_line: number | null
  body: string
  html_url: string
  created_at: string
  in_reply_to_id?: number
  commit_id: string
}

export interface RawReview {
  id: number
  user: { login: string; type: string }
  body: string
  state: string
  html_url: string
  submitted_at: string
  commit_id: string
}

/**
 * Human ground truth = thread-root inline comments and substantive review
 * bodies from non-bot, non-author reviewers. Replies (including replies to
 * Codex) are discussion, not findings.
 */
export function extractHumanComments(
  comments: RawReviewComment[],
  reviews: RawReview[],
  prAuthor: string,
): ReviewComment[] {
  const isHumanReviewer = (user: { login: string; type: string }) =>
    user.type !== 'Bot' && user.login !== prAuthor

  const inline = comments
    .filter((c) => isHumanReviewer(c.user) && c.in_reply_to_id === undefined)
    .map(toReviewComment)

  const bodies = reviews
    .filter((r) => isHumanReviewer(r.user) && isSubstantive(r.body))
    .map(
      (r): ReviewComment => ({
        id: r.id,
        author: r.user.login,
        body: r.body.trim(),
        url: r.html_url,
        createdAt: r.submitted_at,
      }),
    )

  return [...inline, ...bodies]
}

export function extractCodexFindings(
  comments: RawReviewComment[],
): CodexFinding[] {
  return comments
    .filter(
      (c) => c.user.login === CODEX_LOGIN && c.in_reply_to_id === undefined,
    )
    .map((c) => {
      const { priority, body } = parseCodexBody(c.body)
      return { ...toReviewComment(c), body, priority }
    })
}

export function findCodexReview(reviews: RawReview[]): RawReview | undefined {
  return reviews.find((r) => r.user.login === CODEX_LOGIN)
}

const PRIORITY_BADGE = /!\[(P[123]) Badge\]\([^)]*\)/
const CODEX_TRAILER = /\n+Useful\? React with.*$/s

export function parseCodexBody(raw: string): {
  priority?: 'P1' | 'P2' | 'P3'
  body: string
} {
  const priority = raw.match(PRIORITY_BADGE)?.[1] as
    | 'P1'
    | 'P2'
    | 'P3'
    | undefined
  const body = raw
    .replace(/<sub>|<\/sub>/g, '')
    .replace(PRIORITY_BADGE, '')
    .replace(CODEX_TRAILER, '')
    .replace(/^\*\*\s+/, '**')
    .trim()
  return { priority, body }
}

function toReviewComment(c: RawReviewComment): ReviewComment {
  return {
    id: c.id,
    author: c.user.login,
    path: c.path,
    line: c.line ?? c.original_line ?? undefined,
    body: c.body.trim(),
    url: c.html_url,
    createdAt: c.created_at,
  }
}

const APPROVAL_NOISE =
  /^(lgtm|looks good( to me)?|nice|great|approved?|👍|:\+1:)[\s!.]*$/i

function isSubstantive(body: string): boolean {
  const trimmed = body.trim()
  return trimmed.length >= 40 && !APPROVAL_NOISE.test(trimmed)
}
