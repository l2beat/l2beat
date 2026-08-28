import { expect } from 'earl'
import {
  CODEX_LOGIN,
  extractCodexFindings,
  extractHumanComments,
  parseCodexBody,
  type RawReview,
  type RawReviewComment,
} from './comments.js'

const CODEX_BODY = `**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  Filter ended projects out of later daily upserts**

When one project gets a lowered \`untilTimestamp\` the trim is undone.

Useful? React with 👍 / 👎.`

function comment(over: Partial<RawReviewComment>): RawReviewComment {
  return {
    id: 1,
    user: { login: 'reviewer', type: 'User' },
    path: 'a.ts',
    line: 10,
    original_line: 9,
    body: 'This is wrong because X',
    html_url: 'https://github.com/x/1',
    created_at: '2026-01-01T00:00:00Z',
    commit_id: 'abc',
    ...over,
  }
}

function review(over: Partial<RawReview>): RawReview {
  return {
    id: 100,
    user: { login: 'reviewer', type: 'User' },
    body: '',
    state: 'APPROVED',
    html_url: 'https://github.com/x/r1',
    submitted_at: '2026-01-01T00:00:00Z',
    commit_id: 'abc',
    ...over,
  }
}

describe(parseCodexBody.name, () => {
  it('extracts priority and strips badge and trailer', () => {
    expect(parseCodexBody(CODEX_BODY)).toEqual({
      priority: 'P1',
      body: '**Filter ended projects out of later daily upserts**\n\nWhen one project gets a lowered `untilTimestamp` the trim is undone.',
    })
  })
})

describe(extractHumanComments.name, () => {
  it('keeps thread roots from non-author humans only', () => {
    const comments = [
      comment({ id: 1 }),
      comment({ id: 2, in_reply_to_id: 1, body: 'agreed, fixing' }),
      comment({ id: 3, user: { login: 'author', type: 'User' } }),
      comment({ id: 4, user: { login: CODEX_LOGIN, type: 'Bot' } }),
      comment({ id: 5, in_reply_to_id: 4, body: 'Good catch, pre-existing' }),
    ]
    const result = extractHumanComments(comments, [], 'author')
    expect(result.map((c) => c.id)).toEqual([1])
    expect(result[0]?.line).toEqual(10)
  })

  it('keeps substantive review bodies and drops approvals', () => {
    const reviews = [
      review({ id: 100, body: 'LGTM' }),
      review({
        id: 101,
        body: 'The migration should be split, otherwise the deploy will lock the table for minutes.',
      }),
      review({
        id: 102,
        user: { login: 'author', type: 'User' },
        body: 'x'.repeat(50),
      }),
    ]
    const result = extractHumanComments([], reviews, 'author')
    expect(result.map((c) => c.id)).toEqual([101])
    expect(result[0]?.path).toEqual(undefined)
  })

  it('falls back to original_line when line is null', () => {
    const result = extractHumanComments([comment({ line: null })], [], 'author')
    expect(result[0]?.line).toEqual(9)
  })
})

describe(extractCodexFindings.name, () => {
  it('returns parsed codex thread roots', () => {
    const comments = [
      comment({ id: 1 }),
      comment({
        id: 2,
        user: { login: CODEX_LOGIN, type: 'Bot' },
        body: CODEX_BODY,
      }),
      comment({
        id: 3,
        user: { login: CODEX_LOGIN, type: 'Bot' },
        in_reply_to_id: 2,
      }),
    ]
    const result = extractCodexFindings(comments)
    expect(result.length).toEqual(1)
    expect(result[0]?.priority).toEqual('P1')
    expect(result[0]?.body.startsWith('**Filter')).toEqual(true)
  })
})
