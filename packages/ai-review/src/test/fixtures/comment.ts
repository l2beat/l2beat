import type { CommentEvent, PullRequest } from '../../gate/types.js'

export function commentEvent(
  overrides: Partial<CommentEvent['comment']> = {},
  issue: Partial<CommentEvent['issue']> = {},
): CommentEvent {
  return {
    action: 'created',
    comment: {
      body: '/ai-review',
      user: { login: 'alice', type: 'User' },
      author_association: 'MEMBER',
      ...overrides,
    },
    issue: {
      number: 42,
      pull_request: {
        url: 'https://api.github.com/repos/l2beat/l2beat/pulls/42',
      },
      ...issue,
    },
  }
}

export function pullRequest(overrides: Partial<PullRequest> = {}): PullRequest {
  return {
    number: 42,
    draft: false,
    state: 'open',
    user: { login: 'bob', type: 'User' },
    head: {
      sha: 'aaa111',
      ref: 'feature',
      repo: { fork: false, full_name: 'l2beat/l2beat' },
    },
    base: { sha: 'bbb222', ref: 'main', repo: { full_name: 'l2beat/l2beat' } },
    ...overrides,
  }
}
