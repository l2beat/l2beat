import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { MemoryArtifactSink } from './artifacts'
import type { DryRunRecord } from './draft/dryRun'
import type { Finding } from './draft/Finding'
import type { CheckedDraft } from './draft/validateDraft'
import type { ContractFacts } from './facts'
import { authorDraft, repairMessage } from './loop'
import { FakeModelClient } from './model/FakeModelClient'
import { ModelUnavailableError } from './model/ModelClient'

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
  const validation = { facts, templateText: '{}', isNew: true }
  const PROMPT = 'the authoring prompt'

  const HANDLER = {
    type: 'event',
    select: 'validator',
    add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
    remove: { event: 'ValidatorUpdated', where: ['!=', '#active', true] },
  }
  const REASON =
    'isValidator is written only by setValidator (onlyOwner), which emits ValidatorUpdated'
  const VALID = {
    fields: { validators: { reason: REASON, handler: HANDLER } },
  }
  const NO_REASON = { fields: { validators: { handler: HANDLER } } }

  const passingDryRun = () => dryRunReturning([])

  function dryRunReturning(findings: Finding[]) {
    const calls: CheckedDraft[] = []
    const run = (draft: CheckedDraft) => {
      calls.push(draft)
      const record: DryRunRecord = { blockNumber: 100, fields: [] }
      return Promise.resolve({ record, findings })
    }
    return { run, calls }
  }

  function run(
    responses: (string | Error)[],
    dryRun: (draft: CheckedDraft) => Promise<{
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
    expect(outcome.status === 'accepted' && outcome.draft).toEqual({
      additions: { fields: { validators: { handler: HANDLER } } },
      reasons: { validators: REASON },
    })
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
      JSON.stringify(NO_REASON),
      JSON.stringify(VALID),
    ])

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.rounds.length).toEqual(2)
    expect(model.calls[1]?.kind).toEqual('resume')
    expect(model.calls[1]?.threadId).toEqual('fake-thread')
    expect(model.prompts[1] ?? '').toInclude('at fields.validators.reason')
    expect(model.prompts[1] ?? '').toInclude(
      'Return the whole corrected reply as one JSON object',
    )
  })

  it('runs the dry run only on statically clean drafts and repairs its errors', async () => {
    let failing = true
    const calls: CheckedDraft[] = []
    const dryRun = (draft: CheckedDraft) => {
      calls.push(draft)
      const findings: Finding[] = failing
        ? [
            {
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
      [JSON.stringify(NO_REASON), JSON.stringify(VALID), JSON.stringify(VALID)],
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
      JSON.stringify(NO_REASON),
      JSON.stringify(NO_REASON),
      JSON.stringify(NO_REASON),
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

  it('counts an unusable answer as a round, with its tokens, and asks the same message again', async () => {
    const { model, artifacts, result } = run([
      Object.assign(new Error('codex turn used tools'), {
        events: [{ type: 'item.completed' }],
        retryable: true,
        usage: { inputTokens: 7, outputTokens: 2 },
      }),
      JSON.stringify(VALID),
    ])

    const outcome = await result
    expect(outcome.status).toEqual('accepted')
    expect(outcome.rounds[0]?.refused).toEqual('codex turn used tools')
    expect(outcome.rounds[0]?.usage).toEqual({
      inputTokens: 7,
      outputTokens: 2,
    })
    const summary = JSON.parse(artifacts.files.get('summary.json') ?? '')
    expect(summary.rounds[0].usage).toEqual({ inputTokens: 7, outputTokens: 2 })
    expect(model.calls).toEqual([
      { kind: 'start', prompt: PROMPT },
      { kind: 'start', prompt: PROMPT },
    ])
    expect(artifacts.files.has('round-1.refused-events.jsonl')).toEqual(true)
  })

  it('stops at once when the model does not answer, and says so in the trail', async () => {
    const { model, artifacts, result } = run([
      new Error('opencode reported an error: insufficient quota'),
      JSON.stringify(VALID),
    ])

    await expect(result).toBeRejectedWith(
      ModelUnavailableError,
      'the model did not answer: opencode reported an error: insufficient quota',
    )
    expect(model.calls.length).toEqual(1)
    const summary = JSON.parse(artifacts.files.get('summary.json') ?? '')
    expect(summary.status).toEqual('failed')
    expect(summary.failure).toEqual(
      'the model did not answer: opencode reported an error: insufficient quota',
    )
  })

  it('turns an unparsable reply into a finding for the next round', async () => {
    const { model, result } = run(['Sure! Here is my answer.'], undefined, 1)

    await expect(result).not.toBeRejected()
    expect(model.calls.length).toEqual(1)
    expect((await result).rounds[0]?.findings[0]?.path).toEqual('draft')
  })
})

describe(repairMessage.name, () => {
  it('numbers the findings with their paths and asks for the whole draft back', () => {
    const message = repairMessage([
      { path: 'fields.a.reason', message: 'missing' },
      { path: 'fields.a', message: 'check this' },
    ])

    expect(message).toEqual(
      [
        'The draft has 2 error(s). Fix every one of them.',
        '',
        '1. at fields.a.reason: missing',
        '2. at fields.a: check this',
        '',
        'You have no tools: do not try to read files or run commands, fix the draft from the messages above alone.',
        'Return the whole corrected reply as one JSON object and nothing else.',
      ].join('\n'),
    )
  })
})
