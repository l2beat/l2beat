import type {
  CommentEvent,
  GateDecision,
  GateSkipReason,
  PullRequest,
} from './types.js'

export const COMMAND = '/ai-review'

// author_association is computed by GitHub and covers private org membership,
// unlike GET /orgs/{org}/members which GITHUB_TOKEN cannot query.
const ORG_ASSOCIATIONS = new Set(['MEMBER', 'OWNER'])

export function isCommand(body: string): boolean {
  const firstLine = body.trim().split('\n')[0]?.trim() ?? ''
  return firstLine === COMMAND || firstLine.startsWith(`${COMMAND} `)
}

export function evaluateComment(
  event: CommentEvent,
): { ok: true; prNumber: number } | { ok: false; reason: GateSkipReason } {
  if (event.action !== 'created') return skip('not-created')
  if (!event.issue.pull_request) return skip('not-pull-request')
  if (!isCommand(event.comment.body)) return skip('not-command')
  if (event.comment.user.type === 'Bot') return skip('bot-commenter')
  if (!ORG_ASSOCIATIONS.has(event.comment.author_association)) {
    return skip('not-org-member')
  }
  return { ok: true, prNumber: event.issue.number }
}

export function evaluateTrigger(
  event: CommentEvent,
  pr: PullRequest,
): GateDecision {
  const comment = evaluateComment(event)
  if (!comment.ok) return { run: false, reason: comment.reason }
  if (pr.number !== comment.prNumber)
    return { run: false, reason: 'pr-mismatch' }
  if (pr.state !== 'open') return { run: false, reason: 'pr-closed' }
  if (pr.draft) return { run: false, reason: 'draft' }
  if (pr.head.repo.fork || pr.head.repo.full_name !== pr.base.repo.full_name) {
    return { run: false, reason: 'fork' }
  }
  if (pr.user.type === 'Bot') return { run: false, reason: 'bot-author' }
  return {
    run: true,
    prNumber: pr.number,
    headSha: pr.head.sha,
    baseSha: pr.base.sha,
  }
}

function skip(reason: GateSkipReason) {
  return { ok: false as const, reason }
}
