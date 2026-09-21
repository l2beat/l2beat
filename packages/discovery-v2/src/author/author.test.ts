import type { IProvider } from '@l2beat/discovery'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Library } from '../library/Library'
import type { Plan } from '../plan/Plan'
import { PlanStore } from '../plans/PlanStore'
import {
  FIXTURE_ABI,
  fixtureBaseline,
  fixturePrepared,
  fixtureWorklist,
  REGISTRY,
  SELF,
  VALIDATOR_A,
} from '../testing/fixture'
import { MemoryArtifactSink } from './ArtifactSink'
import { author, repairMessage } from './author'
import { FakeModelClient } from './codex/FakeModelClient'
import { SECTION_HEADERS } from './prompt/buildAuthoringPrompt'

/**
 * Drives the loop with scripted model answers against a scripted provider
 * and a real plan store in a temporary directory. Each test is one path
 * through the loop: accept in one round; repair a validator finding; repair
 * a dry-run failure; give up after the rounds run out; tolerate a code
 * fence; turn unparsable text into a finding. In every case the prompts the
 * model saw, the rounds on record, the artifacts written and what reached
 * the store are asserted, because those are the loop's outputs.
 */
describe(author.name, () => {
  const library = Library.load()
  after(() => library.close())

  const prepared = fixturePrepared()
  const ctx = {
    prepared,
    baseline: fixtureBaseline(),
    worklist: fixtureWorklist(),
  }
  const NOW = new Date('2026-09-21T12:00:00.000Z')

  let plansDir: string
  beforeEach(() => {
    plansDir = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-author-'))
  })
  afterEach(() => {
    fs.rmSync(plansDir, { recursive: true, force: true })
  })

  const coder = new utils.Interface(FIXTURE_ABI)
  const statusLog: providers.Log = {
    ...coder.encodeEventLog(coder.getEvent('ValidatorStatusUpdate'), [
      VALIDATOR_A.slice(4),
      true,
    ]),
    blockNumber: 10,
    logIndex: 0,
    address: SELF.slice(4),
    blockHash: '0x',
    transactionHash: '0x',
    transactionIndex: 0,
    removed: false,
  }

  function provider(): IProvider {
    return mockObject<IProvider>({
      chain: prepared.chain,
      blockNumber: prepared.blockNumber,
      getLogs: async (address, topics) =>
        address === SELF && topics[0] === statusLog.topics[0]
          ? [statusLog]
          : [],
      callMethod: async (address) =>
        (address === REGISTRY ? undefined : '0x') as never,
    })
  }

  const validatorsStep: Plan['steps'][number] = {
    id: 'validators',
    covers: ['validators(address)'],
    fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
    use: 'set@1',
    args: {
      key: 'validatorAddress',
      add: [
        {
          event: 'ValidatorStatusUpdate',
          when: { arg: 'isActive', equals: true },
        },
      ],
      remove: [
        {
          event: 'ValidatorStatusUpdate',
          when: { arg: 'isActive', equals: true, negate: true },
        },
      ],
    },
    reason:
      'validators is written only by setValidator (onlyOwner), which emits ValidatorStatusUpdate',
  }

  const skips: Plan['skips'] = [
    { item: 'balanceOf(address)', reason: 'user-activity' },
    { item: 'committeeThresholds(uint8,uint256)', reason: 'unbounded' },
    { item: 'getRoleAdmin(bytes32)', reason: 'unbounded' },
    { item: 'hasRole(bytes32,address)', reason: 'unbounded' },
    { item: 'quote(uint256)', reason: 'computation' },
    { item: 'supportsInterface(bytes4)', reason: 'not-state' },
    { item: 'validatorAt(uint256)', reason: 'unbounded' },
  ]

  /** A plan without `shapeHash`, as a model that follows the prompt may return it. */
  const validPlan = {
    version: 1,
    contract: 'Fixture',
    steps: [validatorsStep],
    skips,
  }
  const json = (value: unknown) => JSON.stringify(value)

  function run(responses: string[], options = {}) {
    const model = new FakeModelClient(responses)
    const artifacts = new MemoryArtifactSink()
    const planStore = new PlanStore(plansDir)
    const result = author(
      {
        model,
        provider: provider(),
        library,
        planStore,
        artifacts,
        now: () => NOW,
      },
      ctx,
      options,
    )
    return { model, artifacts, planStore, result }
  }

  it('accepts a valid first answer in one round, fills the shape hash and stores the plan with provenance', async () => {
    const {
      model,
      artifacts,
      planStore,
      result: pending,
    } = run([json(validPlan)])
    const result = await pending

    expect(result.status).toEqual('ok')
    expect(result.rounds.length).toEqual(1)
    expect(result.plan).toEqual({
      ...validPlan,
      shapeHash: prepared.shapeHash,
    } as Plan)
    expect(result.threadId).toEqual('fake-thread')
    expect(result.model).toEqual('fake-model')
    expect(result.promptTruncated).toEqual(false)
    expect(result.rounds[0]?.dryRun).toEqual({ status: 'ok', failedSteps: [] })
    expect(result.rounds[0]?.findings).toEqual([])
    expect(result.rounds[0]?.usage).toEqual({
      inputTokens: 100,
      outputTokens: 10,
    })

    expect(model.calls.map((call) => call.kind)).toEqual(['start'])
    expect(model.prompts[0] ?? '').toInclude(SECTION_HEADERS.rules)
    expect(model.prompts[0] ?? '').toInclude(SECTION_HEADERS.source)

    expect(result.storedFile).toEqual(
      planStore.pathFor(prepared.shapeHash as string),
    )
    expect(planStore.load(prepared.shapeHash as string)).toEqual({
      plan: result.plan as Plan,
      provenance: {
        source: 'model',
        createdAt: NOW.toISOString(),
        model: 'fake-model',
        rounds: 1,
      },
    })

    expect([...artifacts.files.keys()].sort()).toEqual([
      'codex-events.jsonl',
      'round-1.dryrun.json',
      'round-1.findings.json',
      'round-1.prompt.md',
      'round-1.response.txt',
      'summary.json',
    ])
    expect(artifacts.files.get('round-1.response.txt')).toEqual(json(validPlan))
    expect(artifacts.files.get('codex-events.jsonl')).toEqual(
      '{"type":"fake","turn":1}\n',
    )
    const summary = JSON.parse(artifacts.files.get('summary.json') ?? '')
    expect(summary.status).toEqual('ok')
    expect(summary.model).toEqual('fake-model')
    expect(summary.rounds[0].parsed).toEqual(true)
  })

  it('repairs a missing verdict: the resume prompt carries the finding, the second answer is accepted', async () => {
    const incomplete = { ...validPlan, skips: skips.slice(1) }
    const { model, result: pending } = run([json(incomplete), json(validPlan)])
    const result = await pending

    expect(result.status).toEqual('ok')
    expect(result.rounds.length).toEqual(2)
    expect(result.rounds[0]?.findings).toEqual([
      {
        severity: 'error',
        path: 'plan',
        message:
          "1 worklist item(s) have no verdict: balanceOf(address); add each to a step's covers or to skips with a reason",
      },
    ])
    expect(result.rounds[0]?.dryRun).toEqual(undefined)
    expect(model.calls.map((call) => call.kind)).toEqual(['start', 'resume'])
    expect(model.calls[1]?.threadId).toEqual('fake-thread')
    expect(model.prompts[1] ?? '').toInclude(
      '1. error at plan: 1 worklist item(s) have no verdict: balanceOf(address)',
    )
    expect(model.prompts[1] ?? '').toInclude('Return the whole corrected plan')
    expect(
      new PlanStore(plansDir).load(prepared.shapeHash as string)?.provenance
        .rounds,
    ).toEqual(2)
  })

  it('turns a dry-run revert into a finding, repairs it, and records the failed step', async () => {
    const withReverting = {
      ...validPlan,
      steps: [
        validatorsStep,
        {
          id: 'guardian',
          fetch: {
            kind: 'call',
            method: 'function guardian() view returns (address)',
            at: '$baseline.registry',
          },
          reason: 'the registry guardian can pause this contract',
        },
      ],
    }
    const { model, result: pending } = run([
      json(withReverting),
      json(validPlan),
    ])
    const result = await pending

    expect(result.status).toEqual('ok')
    expect(result.rounds.length).toEqual(2)
    expect(result.rounds[0]?.dryRun).toEqual({
      status: 'partial',
      failedSteps: [{ id: 'guardian', error: 'Execution reverted' }],
    })
    expect(result.rounds[0]?.findings).toEqual([
      {
        severity: 'error',
        path: 'steps[1]',
        message:
          'dry run at block 1000 failed: Execution reverted; fix the fetch (method, args, keys, at) or skip the item',
      },
    ])
    expect(model.prompts[1] ?? '').toInclude(
      '1. error at steps[1]: dry run at block 1000 failed: Execution reverted',
    )
    expect(result.rounds[1]?.dryRun?.status).toEqual('ok')
  })

  it('gives up after the first turn plus maxRepairRounds, stores nothing and keeps every round', async () => {
    const bad = json({ ...validPlan, version: 2 })
    const {
      model,
      artifacts,
      result: pending,
    } = run([bad, bad, bad, json(validPlan)])
    const result = await pending

    expect(result.status).toEqual('failed')
    expect(result.rounds.length).toEqual(3)
    expect(result.plan).toEqual(undefined)
    expect(result.failure ?? '').toMatchRegex(
      /no acceptable plan after 3 round\(s\); last findings: version: expected 1, got 2/,
    )
    expect(model.calls.map((call) => call.kind)).toEqual([
      'start',
      'resume',
      'resume',
    ])
    expect(fs.readdirSync(plansDir)).toEqual([])
    expect(artifacts.files.has('round-3.findings.json')).toEqual(true)
    expect(
      JSON.parse(artifacts.files.get('summary.json') ?? '').status,
    ).toEqual('failed')
  })

  it('keeps the last statically valid plan on failure, so the run directory shows what almost passed', async () => {
    const withReverting = {
      ...validPlan,
      steps: [
        {
          id: 'guardian',
          fetch: {
            kind: 'call',
            method: 'function guardian() view returns (address)',
            at: '$baseline.registry',
          },
          reason: 'reverts in the dry run',
        },
        validatorsStep,
      ],
    }
    const { result: pending } = run([json(withReverting)], {
      maxRepairRounds: 0,
    })
    const result = await pending
    expect(result.status).toEqual('failed')
    expect(result.plan?.steps.map((step) => step.id)).toEqual([
      'guardian',
      'validators',
    ])
    expect(fs.readdirSync(plansDir)).toEqual([])
  })

  it('accepts a plan wrapped in a code fence', async () => {
    const { result: pending } = run([
      `Here is the plan:\n\`\`\`json\n${json(validPlan)}\n\`\`\``,
    ])
    const result = await pending
    expect(result.status).toEqual('ok')
    expect(result.rounds.length).toEqual(1)
  })

  it('treats unparsable text as a finding and repairs it', async () => {
    const { model, result: pending } = run([
      'I would rather not.',
      json(validPlan),
    ])
    const result = await pending
    expect(result.status).toEqual('ok')
    expect(result.rounds.length).toEqual(2)
    expect(result.rounds[0]?.parsed).toEqual(undefined)
    expect(result.rounds[0]?.findings[0]?.message ?? '').toMatchRegex(
      /^the response is not valid JSON \(.*\); reply with exactly one JSON object/,
    )
    expect(model.prompts[1] ?? '').toInclude(
      '1. error at plan: the response is not valid JSON',
    )
  })

  it('warns, without failing, when a logs step matched no logs', async () => {
    const quiet = mockObject<IProvider>({
      chain: prepared.chain,
      blockNumber: prepared.blockNumber,
      getLogs: async () => [],
    })
    const result = await author(
      {
        model: new FakeModelClient([json(validPlan)]),
        provider: quiet,
        library,
        artifacts: new MemoryArtifactSink(),
      },
      ctx,
    )
    expect(result.status).toEqual('ok')
    expect(result.rounds[0]?.findings).toEqual([
      {
        severity: 'warning',
        path: 'steps[0].fetch.events',
        message:
          'no logs found for events ValidatorStatusUpdate up to block 1000; confirm the event names and that this contract emits them',
      },
    ])
    expect(result.storedFile).toEqual(undefined)
  })

  it('reports a model failure as a failed authoring instead of throwing', async () => {
    const { result: pending } = run([])
    const result = await pending
    expect(result.status).toEqual('failed')
    expect(result.failure ?? '').toMatchRegex(
      /FakeModelClient has no response left/,
    )
    expect(result.rounds).toEqual([])
  })

  describe(repairMessage.name, () => {
    it('numbers errors before warnings and asks for the whole plan back', () => {
      const message = repairMessage([
        { severity: 'warning', path: 'steps[0].id', message: 'w' },
        { severity: 'error', path: 'plan', message: 'e' },
      ])
      expect(message).toEqual(
        [
          'The plan has 1 error(s) and 1 warning(s). Fix every error; treat warnings as hints to check.',
          '',
          '1. error at plan: e',
          '2. warning at steps[0].id: w',
          '',
          'Return the whole corrected plan as one JSON object and nothing else.',
        ].join('\n'),
      )
    })
  })
})
