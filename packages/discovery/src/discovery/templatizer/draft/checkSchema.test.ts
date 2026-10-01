import { expect } from 'earl'
import { checkSchema } from './checkSchema'
import { type Finding, Findings } from './Finding'
import { scrollChainDraft } from './test/drafts'

describe(checkSchema.name, () => {
  function check(value: unknown): Finding[] {
    const findings = new Findings()
    checkSchema(value, findings)
    return findings.list
  }

  function withField(field: unknown): unknown {
    const draft = scrollChainDraft() as unknown as {
      fields: Record<string, unknown>
    }
    return { ...draft, fields: { ...draft.fields, delay: field } }
  }

  const error = (path: string, message: string): Finding => ({
    severity: 'error',
    path,
    message,
  })

  it('accepts the ScrollChain draft', () => {
    expect(check(scrollChainDraft())).toEqual([])
  })

  it('reports the envelope: not an object, unknown keys, missing keys', () => {
    expect(check([1])).toEqual([
      error(
        'draft',
        'the draft must be one JSON object { "fields": { … }, "skips": [ … ] }, got [1]',
      ),
    ])
    expect(check({ version: 1, fields: {} })).toEqual([
      error('version', 'unexpected key; allowed keys are fields, skips'),
      error('skips', 'missing; expected an array, each element an object'),
    ])
  })

  it('reports every problem of a field at once', () => {
    expect(
      check(
        withField({
          handler: { type: 'call', methd: 'getDelay' },
          reason: ' ',
          severity: 'HIGH',
        }),
      ),
    ).toEqual([
      error(
        'fields.delay.severity',
        'unexpected key; allowed keys are handler, edit, covers, reason',
      ),
      error(
        'fields.delay.covers',
        'missing; expected an array, each element a string',
      ),
      error(
        'fields.delay.reason',
        'must be one sentence naming the function that writes this state and its modifier, e.g. "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer"',
      ),
      error(
        'fields.delay.handler.methd',
        'unexpected key (did you mean "method"?); allowed keys are type, method, args, ignoreRelative, expectRevert, address',
      ),
      error(
        'fields.delay.handler.args',
        'missing; expected an array, each element a string or a number',
      ),
    ])
  })

  it('names the seven handler types and settles the event mode before its schema', () => {
    const field = (handler: unknown) => ({ handler, covers: [], reason: 'r' })
    expect(check(withField(field({ type: 'eventCount', topics: [] })))).toEqual(
      [
        error(
          'fields.delay.handler.type',
          'must be one of call, array, event, accessControl, storage, constructorArgs, hardcoded; got "eventCount"',
        ),
      ],
    )
    expect(
      check(
        withField(
          field({ type: 'event', set: { event: 'A' }, add: { event: 'B' } }),
        ),
      ),
    ).toEqual([
      error(
        'fields.delay.handler',
        'an event handler either keeps the latest matching log (`set`) or replays logs into a set of values (`add`, optionally `remove`), not both',
      ),
    ])
    expect(check(withField(field({ type: 'event', select: 'a' })))).toEqual([
      error(
        'fields.delay.handler',
        'an event handler needs `set` (the latest matching log) or `add` (a set of values, optionally with `remove`)',
      ),
    ])
    expect(check(withField(field(undefined)))).toEqual([
      error(
        'fields.delay.handler',
        'every field needs a handler object such as { "type": "call", "method": "getDelay", "args": [] }, got nothing',
      ),
    ])
  })

  it('checks each handler against its own V1 definition, strictly for events too', () => {
    const field = (handler: unknown) => ({ handler, covers: [], reason: 'r' })
    expect(
      check(withField(field({ type: 'array', method: 'owners', length: -1 }))),
    ).toEqual([
      error(
        'fields.delay.handler.length',
        'expected a non-negative integer or a reference such as "{{ field }}", got -1',
      ),
    ])
    expect(
      check(
        withField(field({ type: 'event', add: [{ event: 'A', filter: 1 }] })),
      ),
    ).toEqual([
      error(
        'fields.delay.handler.add[0].filter',
        'unexpected key; allowed keys are event, where',
      ),
    ])
    expect(
      check(
        withField(
          field({
            type: 'accessControl',
            roleNames: { PROPOSER_ROLE: '0x12' },
          }),
        ),
      ),
    ).toEqual([
      error(
        'fields.delay.handler.roleNames.PROPOSER_ROLE',
        '"PROPOSER_ROLE" is not a valid key here; expected a 0x-prefixed 32-byte hex string',
      ),
    ])
    expect(check(withField(field({ type: 'storage', slot: '12' })))).toEqual([])
    expect(check(withField(field({ type: 'hardcoded' })))).toEqual([
      error(
        'fields.delay.handler.value',
        'missing; a hardcoded field holds exactly the `value` given here',
      ),
    ])
  })

  it('applies the blip whitelist to edit and to every where', () => {
    const draft = scrollChainDraft() as unknown as {
      fields: Record<
        string,
        { handler: Record<string, unknown>; edit?: unknown }
      >
    }
    draft.fields.sequencers!.handler.remove = [
      { event: 'UpdateSequencer', where: ['not', ['=', '#status', true]] },
    ]
    draft.fields.provers!.edit = ['format', 'Undecimal']
    expect(check(draft).map((finding) => finding.path)).toEqual([
      'fields.sequencers.handler.remove[0].where',
      'fields.provers.edit',
    ])
  })

  it('lists the skip reasons with their meaning', () => {
    const draft = scrollChainDraft()
    draft.skips[0] = {
      item: 'committedBatches(uint256)',
      reason: 'unused' as never,
    }
    expect(check(draft)).toEqual([
      error(
        'skips[0].reason',
        'expected one of "user-activity", "computation", "unbounded", "covered", "not-state", got "unused"; covered = another field or a baseline getter already holds it, computation = derivable from its inputs or other values, unbounded = privileged but not enumerable or growing per batch, user-activity = per-user or per-operation state, not-state = interface checks, versions, helpers',
      ),
    ])
  })
})
