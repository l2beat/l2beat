import { v } from '@l2beat/validate'

export const CommentEvent = v.object({
  action: v.string(),
  comment: v.object({
    body: v.string(),
    user: v.object({ login: v.string(), type: v.string() }),
    author_association: v.string(),
  }),
  issue: v.object({
    number: v.number(),
    pull_request: v.object({ url: v.string() }).optional(),
  }),
})
export type CommentEvent = v.infer<typeof CommentEvent>

export const PullRequest = v.object({
  number: v.number(),
  draft: v.boolean(),
  state: v.string(),
  user: v.object({ login: v.string(), type: v.string() }),
  head: v.object({
    sha: v.string(),
    ref: v.string(),
    repo: v.object({ fork: v.boolean(), full_name: v.string() }),
  }),
  base: v.object({
    sha: v.string(),
    ref: v.string(),
    repo: v.object({ full_name: v.string() }),
  }),
})
export type PullRequest = v.infer<typeof PullRequest>

export type GateDecision =
  | { run: true; prNumber: number; headSha: string; baseSha: string }
  | { run: false; reason: GateSkipReason }

export type GateSkipReason =
  | 'not-created'
  | 'not-pull-request'
  | 'not-command'
  | 'bot-commenter'
  | 'not-org-member'
  | 'draft'
  | 'fork'
  | 'bot-author'
  | 'pr-closed'
  | 'pr-mismatch'
