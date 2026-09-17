import { describe, expect, it } from 'vitest'
import { commentEvent, pullRequest } from '../test/fixtures/comment.js'
import { evaluateTrigger, isCommand } from './evaluateTrigger.js'
import type { GateSkipReason } from './types.js'

describe(evaluateTrigger.name, () => {
  it('runs for an org member on an open, non-draft, non-fork, non-bot PR', () => {
    expect(evaluateTrigger(commentEvent(), pullRequest())).toEqual({
      run: true,
      prNumber: 42,
      headSha: 'aaa111',
      baseSha: 'bbb222',
    })
  })

  it('accepts OWNER association', () => {
    const event = commentEvent({ author_association: 'OWNER' })
    expect(evaluateTrigger(event, pullRequest()).run).toBe(true)
  })

  const skips: [string, Parameters<typeof evaluateTrigger>, GateSkipReason][] =
    [
      ['edited comment', [commentEvent(), pullRequest()], 'not-created'],
      [
        'issue comment',
        [commentEvent({}, { pull_request: undefined }), pullRequest()],
        'not-pull-request',
      ],
      [
        'other text',
        [commentEvent({ body: 'lgtm' }), pullRequest()],
        'not-command',
      ],
      [
        'command mid-text',
        [commentEvent({ body: 'please /ai-review' }), pullRequest()],
        'not-command',
      ],
      [
        'bot commenter',
        [
          commentEvent({ user: { login: 'x[bot]', type: 'Bot' } }),
          pullRequest(),
        ],
        'bot-commenter',
      ],
      [
        'contributor',
        [commentEvent({ author_association: 'CONTRIBUTOR' }), pullRequest()],
        'not-org-member',
      ],
      [
        'collaborator',
        [commentEvent({ author_association: 'COLLABORATOR' }), pullRequest()],
        'not-org-member',
      ],
      [
        'none',
        [commentEvent({ author_association: 'NONE' }), pullRequest()],
        'not-org-member',
      ],
      ['draft', [commentEvent(), pullRequest({ draft: true })], 'draft'],
      [
        'fork flag',
        [
          commentEvent(),
          pullRequest({
            head: {
              sha: 'a',
              ref: 'f',
              repo: { fork: true, full_name: 'l2beat/l2beat' },
            },
          }),
        ],
        'fork',
      ],
      [
        'fork by repo name',
        [
          commentEvent(),
          pullRequest({
            head: {
              sha: 'a',
              ref: 'f',
              repo: { fork: false, full_name: 'other/l2beat' },
            },
          }),
        ],
        'fork',
      ],
      [
        'bot author',
        [
          commentEvent(),
          pullRequest({ user: { login: 'dependabot[bot]', type: 'Bot' } }),
        ],
        'bot-author',
      ],
      [
        'closed PR',
        [commentEvent(), pullRequest({ state: 'closed' })],
        'pr-closed',
      ],
      [
        'PR number mismatch',
        [commentEvent(), pullRequest({ number: 7 })],
        'pr-mismatch',
      ],
    ]
  skips[0][1][0].action = 'edited'

  for (const [name, args, reason] of skips) {
    it(`skips: ${name}`, () => {
      expect(evaluateTrigger(...args)).toEqual({ run: false, reason })
    })
  }

  it('membership is checked before PR properties', () => {
    const event = commentEvent({ author_association: 'NONE' })
    const result = evaluateTrigger(event, pullRequest({ draft: true }))
    expect(result).toEqual({ run: false, reason: 'not-org-member' })
  })
})

describe(isCommand.name, () => {
  it('matches the bare command and command with arguments', () => {
    expect(isCommand('/ai-review')).toBe(true)
    expect(isCommand('  /ai-review  \n')).toBe(true)
    expect(isCommand('/ai-review focus on tests')).toBe(true)
    expect(isCommand('/ai-review\nmore context')).toBe(true)
  })

  it('rejects prefixes and embedded mentions', () => {
    expect(isCommand('/ai-reviewer')).toBe(false)
    expect(isCommand('run /ai-review')).toBe(false)
    expect(isCommand('')).toBe(false)
  })
})
