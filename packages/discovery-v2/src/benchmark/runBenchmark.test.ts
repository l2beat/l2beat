import { Logger } from '@l2beat/backend-tools'
import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import type { AuthoringResult } from '../author/author'
import type { AuthorFiles } from '../commands/authorCommand'
import { createContext } from '../commands/context'
import { FILE_NAMES, writeJson } from '../commands/files'
import type { PipelineArgs, PipelineResult } from '../commands/pipelineCommand'
import type { Plan } from '../plan/Plan'
import { decisionHash } from '../plans/decisionHash'
import {
  fixtureBaseline,
  fixturePrepared,
  fixtureWorklist,
} from '../testing/fixture'
import { fixturePlan } from '../testing/fixturePlan'
import type { BenchmarkProject } from './loadProject'
import { CONTRACTS_DIR, runBenchmark } from './runBenchmark'

/**
 * Drives the runner with a fake pipeline and a fake author, no RPC and no
 * model: one contract compares cleanly, one throws, one has no plan. What is
 * checked is the orchestration the real runs depend on: a throw is recorded
 * on its contract and the next contract still runs; verdicts and facts are
 * computed against the V1 entry; tokens, rounds and model time are summed
 * from the authoring rounds; and `--repeat` counts distinct decision hashes
 * across the pipeline's plan and the repeats while never saving.
 */
describe(runBenchmark.name, () => {
  let outDir: string
  const ctx = createContext({
    logger: Logger.SILENT,
    createProviders: () => {
      throw new Error('the fake pipeline must not create providers')
    },
  })

  beforeEach(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-bench-'))
  })
  afterEach(() => {
    fs.rmSync(outDir, { recursive: true, force: true })
  })

  const OK = 'eth:0x1111111111111111111111111111111111111111'
  const THROWS = 'eth:0x2222222222222222222222222222222222222222'
  const MISSING = 'eth:0x3333333333333333333333333333333333333333'

  const project: BenchmarkProject = {
    name: 'fixture',
    chain: 'ethereum',
    blockNumber: 1000,
    entries: [
      v1Entry(OK, {
        $implementation: 'eth:0x2222222222222222222222222222222222222222',
        owner: 'eth:0x4444444444444444444444444444444444444444',
        validatorSet: ['eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'],
        Proposer: ['eth:0x4444444444444444444444444444444444444444'],
      }),
      v1Entry(THROWS, {}),
      v1Entry(MISSING, {
        owner: 'eth:0x4444444444444444444444444444444444444444',
      }),
    ],
    effectiveConfig: () => ({
      fields: {
        validatorSet: {
          handler: {
            type: 'event',
            select: 'validatorAddress',
            add: { event: 'ValidatorStatusUpdate' },
          },
        },
        Proposer: {
          handler: {
            type: 'accessControl',
            pickRoleMembers: 'PROPOSER_ROLE',
          },
        },
      },
      ignoreMethods: ['registry'],
    }),
  }

  it('with noPlan passes the flag to every pipeline run and records it on the report', async () => {
    const seen: PipelineArgs[] = []
    const report = await runBenchmark(
      {
        ctx,
        runPipeline: (c, args) => {
          seen.push(args)
          return fakePipeline(c, args)
        },
        now: () => new Date(0),
      },
      project,
      { author: false, repeat: 0, noPlan: true, outDir },
    )
    expect(report.noPlan).toEqual(true)
    expect(seen.map((a) => a.noPlan)).toEqual([true, true, true])
  })

  it('records a throw on its contract, compares the others and sums the cost', async () => {
    const report = await runBenchmark(
      { ctx, runPipeline: fakePipeline, now: () => new Date(0) },
      project,
      { author: true, repeat: 0, outDir },
    )
    expect(report.contracts.map((c) => c.status)).toEqual([
      'compared',
      'failed',
      'compared',
    ])
    const [ok, threw, missing] = report.contracts
    expect(threw?.error).toEqual('explorer is down')
    expect(missing?.planStatus).toEqual('missing')
    expect(missing?.planSource).toEqual('none')

    expect(ok?.planSource).toEqual('model')
    expect(ok?.rounds).toEqual(2)
    expect(ok?.tokens).toEqual({
      input: 300,
      cached: 20,
      output: 30,
      reasoning: 5,
    })
    expect(ok?.modelMs).toEqual(3000)
    expect(ok?.model).toEqual('fake-model')
    expect(ok?.decisionHash).toEqual(decisionHash(fixturePlan()))
    const verdicts = Object.fromEntries(
      (ok?.fields ?? []).map((f) => [f.name, f.verdict]),
    )
    expect(verdicts).toEqual({
      $implementation: 'equal',
      owner: 'equal',
      validatorSet: 'equal-renamed',
      Proposer: 'v1-only',
      registry: 'v2-only',
    })
    expect(ok?.fields.find((f) => f.name === 'registry')).toEqual({
      verdict: 'v2-only',
      name: 'registry',
      class: 'ignored-by-v1',
    })
    expect(ok?.facts.map((f) => f.equal)).toEqual([true, true, true, true])

    expect(report.totals.failed).toEqual(1)
    expect(report.totals.compared).toEqual(2)
    expect(report.totals.equal).toEqual(3)
    expect(report.totals.equalRenamed).toEqual(1)
    expect(report.totals.v1Only['template-projection']).toEqual(1)
    expect(report.totals.roundsDistribution).toEqual({ '2': 1 })
    expect(report.model).toEqual('fake-model')
    expect(report.startedAt).toEqual('1970-01-01T00:00:00.000Z')
  })

  it('repeats authoring with the store bypassed and counts distinct decision hashes', async () => {
    const seen: { outDir: string; store?: boolean }[] = []
    const plans = [fixturePlan(), reworded(fixturePlan()), otherDecision()]
    let calls = 0
    const fakeAuthor = async (
      _ctx: unknown,
      _provider: unknown,
      _input: unknown,
      repeatDir: string,
      options: { store?: boolean },
    ): Promise<AuthorFiles> => {
      seen.push({ outDir: repeatDir, store: options.store })
      const plan = plans[++calls] as Plan
      return {
        result: authoringResult(plan, 1),
        planFile: undefined,
        artifactsDir: repeatDir,
      }
    }
    const withProvider = createContext({
      logger: Logger.SILENT,
      createProviders: () =>
        ({
          getByBlockNumber: async () => ({}),
        }) as never,
    })
    const report = await runBenchmark(
      { ctx: withProvider, runPipeline: fakePipeline, runAuthor: fakeAuthor },
      { ...project, entries: [project.entries[0] as EntryParameters] },
      { author: true, repeat: 2, outDir },
    )
    const repeats = report.contracts[0]?.repeats
    expect(repeats?.attempts.length).toEqual(2)
    expect(repeats?.plans).toEqual(3)
    // pipeline plan, a reworded copy (same decisions), a changed skip: two distinct.
    expect(repeats?.distinctDecisionHashes).toEqual(2)
    expect(seen.map((s) => s.store)).toEqual([false, false])
    expect(seen.map((s) => path.basename(s.outDir))).toEqual([
      'repeat-1',
      'repeat-2',
    ])
    expect(report.totals.tokens.input).toEqual(300 + 2 * 100)
  })

  it('does not repeat without --author or for a contract that got no plan', async () => {
    const report = await runBenchmark(
      { ctx, runPipeline: fakePipeline },
      { ...project, entries: [project.entries[2] as EntryParameters] },
      { author: true, repeat: 2, outDir },
    )
    expect(report.contracts[0]?.repeats).toEqual(undefined)
  })

  async function fakePipeline(
    _ctx: unknown,
    args: { address: string; out?: string },
  ): Promise<PipelineResult> {
    if (args.address === THROWS) {
      throw new Error('explorer is down')
    }
    const runDir = args.out ?? outDir
    const prepared = fixturePrepared({
      address: ChainSpecificAddress(args.address),
    })
    writeJson(path.join(runDir, FILE_NAMES.prepared), prepared)
    writeJson(path.join(runDir, FILE_NAMES.baseline), fixtureBaseline())
    writeJson(path.join(runDir, FILE_NAMES.worklist), fixtureWorklist())
    const entry: EntryParameters = {
      address: prepared.address,
      type: 'Contract',
      name: 'Fixture',
      proxyType: 'EIP1967 proxy',
      sourceHashes: ['0x11', '0x22'],
      sinceBlock: 500,
      implementationNames: {},
      values:
        args.address === MISSING
          ? { owner: 'eth:0x4444444444444444444444444444444444444444' }
          : {
              $implementation: 'eth:0x2222222222222222222222222222222222222222',
              owner: 'eth:0x4444444444444444444444444444444444444444',
              registry: 'eth:0x5555555555555555555555555555555555555555',
              validators: ['eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'],
            },
    }
    const missing = args.address === MISSING
    return {
      runDir,
      planStatus: missing ? 'missing' : 'ok',
      planSource: missing ? undefined : 'model',
      authoring: missing ? undefined : authoringResult(fixturePlan(), 2),
      output: {
        entry,
        meta: {
          version: 1,
          planStatus: missing ? 'missing' : 'ok',
          planHash: missing ? undefined : '0xplan',
          decisionHash: missing ? undefined : decisionHash(fixturePlan()),
          shapeHash: prepared.shapeHash,
          stepCount: 0,
          failedSteps: [],
          skipCount: 0,
          model: missing ? undefined : 'fake-model',
        },
        relatives: [],
      },
      entryFile: path.join(runDir, FILE_NAMES.entry),
      metaFile: path.join(runDir, FILE_NAMES.entryMeta),
    }
  }

  function authoringResult(plan: Plan, rounds: number): AuthoringResult {
    return {
      status: 'ok',
      plan,
      model: 'fake-model',
      promptTruncated: false,
      rounds: Array.from({ length: rounds }, (_, i) => ({
        index: i + 1,
        prompt: '',
        response: '',
        findings: [],
        durationMs: 1500,
        usage: {
          inputTokens: 100 + i * 100,
          cachedInputTokens: 10,
          outputTokens: 15,
          reasoningOutputTokens: i === 0 ? 5 : 0,
        },
      })),
    }
  }

  function v1Entry(
    address: string,
    values: EntryParameters['values'],
  ): EntryParameters {
    return {
      address: ChainSpecificAddress(address),
      type: 'Contract',
      name: 'Fixture',
      proxyType: 'EIP1967 proxy',
      sourceHashes: ['0x11', '0x22'],
      sinceBlock: 500,
      implementationNames: {},
      values,
    }
  }

  function reworded(plan: Plan): Plan {
    return {
      ...plan,
      steps: plan.steps.map((step) => ({ ...step, reason: 'other words' })),
    }
  }

  function otherDecision(): Plan {
    const plan = fixturePlan()
    return {
      ...plan,
      skips: plan.skips.map((skip) =>
        skip.item === 'quote(uint256)'
          ? { ...skip, reason: 'not-state' }
          : skip,
      ),
    }
  }

  it('places each contract run under contracts/<address>', async () => {
    await runBenchmark(
      { ctx, runPipeline: fakePipeline },
      { ...project, entries: [project.entries[0] as EntryParameters] },
      { author: false, repeat: 0, outDir },
    )
    expect(
      fs.existsSync(
        path.join(outDir, CONTRACTS_DIR, OK.slice(4), FILE_NAMES.prepared),
      ),
    ).toEqual(true)
  })
})
