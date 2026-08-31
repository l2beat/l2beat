export interface CommentEvent {
  action: string
  comment: {
    body: string
    user: { login: string; type: string }
    author_association: string
  }
  issue: {
    number: number
    pull_request?: { url: string }
  }
}

export interface PullRequest {
  number: number
  draft: boolean
  state: string
  user: { login: string; type: string }
  head: { sha: string; ref: string; repo: { fork: boolean; full_name: string } }
  base: { sha: string; ref: string; repo: { full_name: string } }
}

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
