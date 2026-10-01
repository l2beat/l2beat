import { expect } from 'earl'
import { checkReferences } from './checkReferences'
import type { DraftHandler } from './Draft'
import type { Finding } from './Finding'
import type { ValidationContext } from './ruleContext'
import { contextFor, draftOf, field, runRule } from './test/drafts'

describe(checkReferences.name, () => {
  const scroll = contextFor('ScrollChain')
  const factory = contextFor('DisputeGameFactory')
  const guardian = 'function guardian() view returns (address)'

  function check(
    fields: Record<string, DraftHandler>,
    ctx: ValidationContext = scroll,
    skips = draftOf({}).skips,
  ): Finding[] {
    const draft = draftOf(
      Object.fromEntries(
        Object.entries(fields).map(([name, handler]) => [name, field(handler)]),
      ),
      skips,
    )
    return runRule(checkReferences, draft, ctx)
  }

  const messages = (findings: Finding[]) =>
    findings.map(
      (finding) => `${finding.severity} ${finding.path}: ${finding.message}`,
    )

  it('accepts baseline, draft, kept and special references of the right shape', () => {
    expect(
      check(
        {
          guardian: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ systemConfig }}',
          },
          council: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ guardian }}',
          },
          prover: { type: 'call', method: 'isProver', args: ['{{ owner }}'] },
          kept: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ keptField }}',
          },
          self: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ $.address }}',
          },
          batches: {
            type: 'array',
            method: 'finalizedStateRoots',
            length: '{{ miscData.flags }}',
          },
        },
        { ...scroll, lockedFieldNames: ['keptField'] },
      ),
    ).toEqual([])
  })

  it('rejects names that are no field, proxy values and unknown specials', () => {
    expect(
      messages(
        check({
          a: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ systemConfg }}',
          },
          b: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ $implementation }}',
          },
          c: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ $.chain }}',
          },
        }),
      ),
    ).toEqual([
      'error fields.a.handler.address: there is no field "systemConfg" to reference; a reference names a baseline field, another draft field, or one of {{ $.address }}, {{ $$.blockNumber }} and {{ $$.chainName }}; closest: systemConfig, miscData, c',
      'error fields.b.handler.address: $implementation is a proxy value, not a handler result, so V1 cannot resolve {{ $implementation }} ("Missing dependency"); the only $ references are {{ $.address }}, {{ $$.blockNumber }} and {{ $$.chainName }}',
      'error fields.c.handler.address: V1 provides only {{ $.address }}, {{ $$.blockNumber }} and {{ $$.chainName }}; {{ $.chain }} is none of them',
    ])
  })

  it('checks the referenced baseline value against what the position needs', () => {
    expect(
      messages(
        check({
          a: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ layer2ChainId }}',
          },
          b: {
            type: 'array',
            method: 'finalizedStateRoots',
            length: '{{ owner }}',
          },
          c: { type: 'call', method: 'isProver', args: ['{{ paused }}'] },
          d: { type: 'call', method: 'isProver', args: ['{{ $.address }}'] },
        }),
      ),
    ).toEqual([
      'error fields.a.handler.address: {{ layer2ChainId }} is 534352: `address` needs a field holding an address',
      'error fields.b.handler.length: {{ owner }} is "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6": `length` needs a field holding a non-negative integer',
      'error fields.c.handler.args[0]: {{ paused }} is false: expected an address (0x + 40 hex digits, lowercase or checksummed, optionally chain-prefixed), got false',
      'error fields.d.handler.args[0]: {{ $.address }} is this contract\'s chain-prefixed address, which ethers cannot encode as a call argument; write it as the literal "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"',
    ])
    expect(
      messages(
        check(
          {
            games: {
              type: 'array',
              method: 'gameImpls',
              indices: '{{ gameCount }}',
            },
          },
          factory,
        ),
      ),
    ).toEqual([
      'error fields.games.handler.indices: {{ gameCount }} is 18567: `indices` needs a field holding an array of keys',
    ])
  })

  it('applies the array maxLength cap to a referenced length, as it does to a literal', () => {
    const games = (extra: object): DraftHandler => ({
      type: 'array',
      method: 'gameAtIndex',
      length: '{{ gameCount }}',
      ...extra,
    })
    expect(messages(check({ games: games({}) }, factory))).toEqual([
      'error fields.games.handler.length: {{ gameCount }} is 18567: V1 reads at most `maxLength` (100) elements and reports "Too many values" when `length` is larger; set "maxLength" to at least 18567',
    ])
    expect(check({ games: games({ maxLength: 20000 }) }, factory)).toEqual([])
  })

  it('walks sub-paths through object keys only, as resolveReference does', () => {
    expect(
      messages(
        check({
          a: {
            type: 'array',
            method: 'finalizedStateRoots',
            length: '{{ miscData.lastIndex }}',
          },
          b: {
            type: 'call',
            method: guardian,
            args: [],
            address: '{{ owner.x }}',
          },
        }),
      ),
    ).toEqual([
      'error fields.a.handler.length: miscData has no key "lastIndex"; its keys are lastCommittedBatchIndex, lastFinalizedBatchIndex, lastFinalizeTimestamp, flags, reserved',
      'error fields.b.handler.address: V1 walks reference paths through object keys only, and owner is "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"',
    ])
  })

  it('rejects self-references, cycles and strings V1 would pass on literally', () => {
    const call = (address: string): DraftHandler => ({
      type: 'call',
      method: guardian,
      args: [],
      address,
    })
    expect(
      messages(
        check({
          a: call('{{ b }}'),
          b: call('{{ a }}'),
          c: call('{{ c }}'),
          d: { type: 'call', method: 'isProver', args: ['{{ owner-x }}'] },
        }),
      ),
    ).toEqual([
      'error fields.c.handler.address: a field cannot reference itself: V1 would wait for {{ c }} forever and fail the whole contract ("Impossible to resolve dependencies")',
      'error fields.d.handler.args[0]: V1 reads a reference only when the whole string is "{{ name }}" or "{{ name.key }}" with a field name; "{{ owner-x }}" would be passed on literally',
      'error fields.a.handler: fields a -> b -> a reference each other in a cycle, so V1 cannot order them and fails the whole contract ("Impossible to resolve dependencies"); read one of them from the baseline or a literal',
    ])
  })

  it('warns about a baseline field without a value and rejects one a skip removes', () => {
    const facts = scroll.facts
    const ctx: ValidationContext = {
      ...scroll,
      facts: {
        ...facts,
        baseline: {
          fields: {
            ...facts.baseline.fields,
            verifier: { kind: 'getter', error: 'Execution reverted' },
            committedBatches: { kind: 'probe', value: ['0x00'] },
          },
        },
      },
    }
    expect(
      messages(
        check(
          {
            a: {
              type: 'call',
              method: guardian,
              args: [],
              address: '{{ verifier }}',
            },
            b: { type: 'storage', slot: '{{ committedBatches }}' },
          },
          ctx,
          [{ item: 'committedBatches(uint256)', reason: 'unbounded' }],
        ),
      ),
    ).toEqual([
      'warning fields.a.handler.address: baseline field "verifier" has no value (Execution reverted), so this field fails unless it reads at run time',
      'error fields.b.handler.slot: the draft skips committedBatches(uint256), which puts "committedBatches" into the template\'s ignoreMethods, so V1 no longer reads {{ committedBatches }}; cover that item instead of skipping it, or reference something else',
    ])
  })
})
