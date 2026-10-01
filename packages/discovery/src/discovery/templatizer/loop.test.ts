import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { MemoryArtifactSink } from './artifacts'
import type { Draft } from './draft/Draft'
import type { DryRunRecord } from './draft/dryRun'
import type { Finding } from './draft/Finding'
import type { ContractFacts } from './facts'
import { authorDraft, repairMessage } from './loop'
import { FakeModelClient } from './model/FakeModelClient'
import { buildWorklist } from './worklist'

describe(authorDraft.name, () => {
  const ADDRESS = ChainSpecificAddress(
    'eth:0x1111111111111111111111111111111111111111',
  )
  const ABI = [
    'function owner() view returns (address)',
    'function isValidator(address who) view returns (bool)',
    'function setValidator(address who, bool active)',
    'event ValidatorUpdated(address indexed validator, bool active)',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  ]
  const SOURCE = `contract Registry is Ownable {
  mapping(address => bool) public isValidator;

  function setValidator(address who, bool active) external onlyOwner {
    isValidator[who] = active;
    emit ValidatorUpdated(who, active);
  }
}`
  const facts: ContractFacts = {
    project: 'proj',
    chain: 'ethereum',
    address: ADDRESS,
    blockNumber: 100,
    name: 'Registry',
    proxyValues: {},
    implementationNames: {},
    abi: ABI,
    bundles: [],
    sources: [{ address: ADDRESS, name: 'Registry', flattened: SOURCE }],
    shapeHash: Hash256(`0x${'ab'.repeat(32)}`),
    baseline: {
      fields: {
        owner: {
          kind: 'getter',
          value: 'eth:0x2222222222222222222222222222222222222222',
        },
      },
    },
  }
  const validation = { facts, worklist: buildWorklist(ABI) }
  const PROMPT = 'the authoring prompt'

  const VALID: Draft = {
    fields: {
      validators: {
        handler: {
          type: 'event',
          select: 'validator',
          add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
          remove: {
            event: 'ValidatorUpdated',
            where: ['!=', '#active', true],
          },
        },
        covers: ['isValidator(address)', 'ValidatorUpdated'],
        reason:
          'isValidator is written only by setValidator (onlyOwner), which emits ValidatorUpdated',
      },
    },
    skips: [{ item: 'OwnershipTransferred', reason: 'covered' }],
  }
  const MISSING_SKIP: Draft = { ...VALID, skips: [] }

  const passingDryRun = () => dryRunReturning([])

  function dryRunReturning(findings: Finding[]) {
    const calls: Draft[] = []
    const run = (draft: Draft) => {
      calls.push(draft)
      const record: DryRunRecord = { blockNumber: 100, fields: [] }
      return Promise.resolve({ record, findings })
    }
    return { run, calls }
  }

  function run(
    responses: (string | Error)[],
    dryRun: (draft: Draft) => Promise<{
      record: DryRunRecord
      findings: Finding[]
    }> = passingDryRun().run,
    maxRounds?: number,
  ) {
    const model = new FakeModelClient(responses)
    const artifacts = new MemoryArtifactSink()
    const result = authorDraft(
      { model, artifacts, logger: Logger.SILENT, dryRun },
      { prompt: PROMPT, validation, trail: { promptTruncated: false } },
      { maxRounds },
    )
    return { model, artifacts, result }
  }

  it('accepts a clean draft on the first turn and leaves a complete trail', async () => {
    const { model, artifacts, result } = run([JSON.stringify(VALID)])

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.status === 'accepted' && outcome.draft).toEqual(VALID)
    expect(model.calls).toEqual([{ kind: 'start', prompt: PROMPT }])
    expect([...artifacts.files.keys()].sort()).toEqual([
      'draft.json',
      'events.jsonl',
      'round-1.dryrun.json',
      'round-1.findings.json',
      'round-1.prompt.md',
      'round-1.response.txt',
      'summary.json',
    ])
    const summary = JSON.parse(artifacts.files.get('summary.json') ?? '')
    expect(summary.status).toEqual('accepted')
    expect(summary.promptTruncated).toEqual(false)
    expect(summary.rounds[0].usage).toEqual({
      inputTokens: 100,
      outputTokens: 10,
    })
  })

  it('sends the findings back on the same thread and accepts the repaired draft', async () => {
    const { model, result } = run([
      JSON.stringify(MISSING_SKIP),
      JSON.stringify(VALID),
    ])

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.rounds.length).toEqual(2)
    expect(model.calls[1]?.kind).toEqual('resume')
    expect(model.calls[1]?.threadId).toEqual('fake-thread')
    expect(model.prompts[1] ?? '').toInclude('OwnershipTransferred')
    expect(model.prompts[1] ?? '').toInclude(
      'Return the whole corrected draft as one JSON object',
    )
  })

  it('runs the dry run only on statically clean drafts and repairs its errors', async () => {
    let failing = true
    const calls: Draft[] = []
    const dryRun = (draft: Draft) => {
      calls.push(draft)
      const findings: Finding[] = failing
        ? [
            {
              severity: 'error',
              path: 'fields.validators',
              message: 'dry run at block 100 failed: boom',
            },
          ]
        : []
      failing = false
      return Promise.resolve({
        record: { blockNumber: 100, fields: [] },
        findings,
      })
    }
    const { model, result } = run(
      [
        JSON.stringify(MISSING_SKIP),
        JSON.stringify(VALID),
        JSON.stringify(VALID),
      ],
      dryRun,
    )

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.rounds.length).toEqual(3)
    expect(calls.length).toEqual(2)
    expect(model.prompts[2] ?? '').toInclude('dry run at block 100 failed')
  })

  it('gives up after the round cap with the last errors as the failure', async () => {
    const { model, result } = run([
      JSON.stringify(MISSING_SKIP),
      JSON.stringify(MISSING_SKIP),
      JSON.stringify(MISSING_SKIP),
      JSON.stringify(VALID),
    ])

    const outcome = await result
    expect(outcome.status).toEqual('failed')
    expect(outcome.rounds.length).toEqual(3)
    expect(model.calls.length).toEqual(3)
    expect(outcome.status === 'failed' ? outcome.failure : '').toInclude(
      'no acceptable draft after 3 round(s)',
    )
  })

  it('counts a refused turn as a round and asks the same message again', async () => {
    const { model, artifacts, result } = run([
      Object.assign(new Error('codex turn used tools'), {
        events: [{ type: 'item.completed' }],
      }),
      JSON.stringify(VALID),
    ])

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.rounds[0]?.refused).toEqual('codex turn used tools')
    expect(model.calls).toEqual([
      { kind: 'start', prompt: PROMPT },
      { kind: 'start', prompt: PROMPT },
    ])
    expect(artifacts.files.has('round-1.refused-events.jsonl')).toEqual(true)
  })

  describe('advisories', () => {
    const ADVISORY: Finding = {
      severity: 'advisory',
      path: 'fields.validators',
      message: 'the value holds 21 addresses',
    }

    it('asks about them once and accepts the reply even when they still apply', async () => {
      const { model, result } = run(
        [JSON.stringify(VALID), JSON.stringify(VALID)],
        dryRunReturning([ADVISORY]).run,
      )

      const outcome = await result
      expect(outcome.status).toEqual('accepted')
      expect(outcome.rounds.length).toEqual(2)
      expect(
        outcome.status === 'accepted' && outcome.acceptedRound.index,
      ).toEqual(2)
      expect(model.prompts[1] ?? '').toInclude('judgments, not errors')
      expect(model.prompts[1] ?? '').toInclude(
        '1. advisory at fields.validators: the value holds 21 addresses',
      )
    })

    it('accepts the draft it asked about when the reply cannot be repaired', async () => {
      const { result } = run(
        [
          JSON.stringify(VALID),
          JSON.stringify(MISSING_SKIP),
          JSON.stringify(MISSING_SKIP),
        ],
        dryRunReturning([ADVISORY]).run,
      )

      const outcome = await result
      expect(outcome.status).toEqual('accepted')
      expect(outcome.rounds.length).toEqual(3)
      expect(outcome.status === 'accepted' && outcome.draft).toEqual(VALID)
      expect(
        outcome.status === 'accepted' && outcome.acceptedRound.index,
      ).toEqual(1)
    })

    it('does not spend the last round asking about them', async () => {
      const { model, result } = run(
        [JSON.stringify(VALID)],
        dryRunReturning([ADVISORY]).run,
        1,
      )

      expect((await result).status).toEqual('accepted')
      expect(model.calls.length).toEqual(1)
    })
  })

  it('turns an unparsable reply into a finding for the next round', async () => {
    const { model, result } = run(['Sure! Here is my answer.'], undefined, 1)

    await expect(result).not.toBeRejected()
    expect(model.calls.length).toEqual(1)
    expect((await result).rounds[0]?.findings[0]?.path).toEqual('draft')
  })
})

describe(repairMessage.name, () => {
  it('lists errors before warnings, numbered, with their paths', () => {
    const message = repairMessage([
      { severity: 'warning', path: 'fields.a', message: 'check this' },
      { severity: 'error', path: 'skips[0].item', message: 'unknown item' },
    ])

    expect(message).toEqual(
      [
        'The draft has 1 error(s) and 1 warning(s). Fix every error; treat warnings as hints to check.',
        '',
        '1. error at skips[0].item: unknown item',
        '2. warning at fields.a: check this',
        '',
        'Return the whole corrected draft as one JSON object and nothing else.',
      ].join('\n'),
    )
  })

  it('puts advisories between errors and warnings and says they may stand', () => {
    const message = repairMessage([
      { severity: 'warning', path: 'fields.a', message: 'check this' },
      { severity: 'advisory', path: 'skips[1].reason', message: 'privileged' },
      { severity: 'error', path: 'skips[0].item', message: 'unknown item' },
    ])

    expect(message.split('\n').slice(0, 5)).toEqual([
      'The draft has 1 error(s), 1 advisory point(s) and 1 warning(s). Fix every error; reconsider each advisory point, which may be right as it is; treat warnings as hints to check.',
      '',
      '1. error at skips[0].item: unknown item',
      '2. advisory at skips[1].reason: privileged',
      '3. warning at fields.a: check this',
    ])
  })
})
