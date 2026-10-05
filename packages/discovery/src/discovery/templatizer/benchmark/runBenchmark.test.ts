import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import type { EntryParameters } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { TemplatizationFailedError } from '../TemplatizationFailedError'
import type {
  HiddenTemplateResult,
  HiddenTemplateRun,
} from './analyzeWithHiddenTemplate'
import type { BenchmarkProject, SuiteProject } from './loadProject'
import {
  type BenchmarkDeps,
  REPORT_JSON,
  REPORT_MARKDOWN,
  runBenchmark,
} from './runBenchmark'
import type { BenchmarkReport, EffectiveConfig, TrailSummary } from './types'

/**
 * Drives the harness with fakes, no RPC, no model and no templates: a
 * project whose contracts each hit one outcome (authored, threw, matched
 * another committed template, authoring failed), a project whose provider
 * sits at the wrong block, and quota refusals. What is checked is the
 * orchestration a real run depends on: committed values are compared with
 * the generated ones and attributed from the committed config, handler
 * fields are counted as found only when their values are there, a throw is
 * recorded on its contract and the next one still runs, and a quota refusal
 * stops authoring for the rest of the run.
 */
describe(runBenchmark.name, () => {
  const AUTHORED = 'eth:0x1111111111111111111111111111111111111111'
  const THROWS = 'eth:0x2222222222222222222222222222222222222222'
  const MATCHED = 'eth:0x3333333333333333333333333333333333333333'
  const UNAUTHORED = 'eth:0x4444444444444444444444444444444444444444'
  const NO_TEMPLATE = 'eth:0x5555555555555555555555555555555555555555'

  const OWNER = 'eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'
  const V1 = 'eth:0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
  const V2 = 'eth:0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'

  let outDir: string
  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), 'templatizer-benchmark-run-'))
  })
  afterEach(() => rmSync(outDir, { recursive: true, force: true }))

  const committedConfig: EffectiveConfig = {
    fields: {
      validators: {
        handler: {
          type: 'event',
          select: 'validator',
          add: { event: 'ValidatorAdded' },
        },
      },
      sequencers: {
        handler: {
          type: 'event',
          select: 'account',
          add: { event: 'SequencerAdded' },
        },
      },
      batchers: {
        handler: { type: 'array', method: 'batchers', length: 1 },
      },
      Proposer: {
        handler: { type: 'accessControl', pickRoleMembers: 'PROPOSER_ROLE' },
      },
    } as EffectiveConfig['fields'],
    ignoreMethods: ['registry'],
    overrideFields: [],
  }

  function entry(
    address: string,
    values: EntryParameters['values'] = {},
  ): EntryParameters {
    return {
      type: 'Contract',
      address: ChainSpecificAddress(address),
      name: `Contract${address.slice(-1)}`,
      template: 'fixture/Foo',
      values,
    }
  }

  function project(
    name: string,
    entries: EntryParameters[],
    blockNumber = 1000,
  ): BenchmarkProject {
    return {
      name,
      chain: 'ethereum',
      timestamp: UnixTime(1_700_000_000),
      blockNumber,
      entries,
      entryConfig: () => {
        throw new Error('the fake analysis builds no config')
      },
      committedConfig: () => committedConfig,
    }
  }

  function trail(extra: Partial<TrailSummary> = {}): TrailSummary {
    return {
      status: 'accepted',
      model: 'fake-model',
      rounds: 2,
      tokens: { input: 300, cached: 20, output: 30, reasoning: 5 },
      modelMs: 3000,
      ...extra,
    }
  }

  function deps(
    projects: BenchmarkProject[],
    analyze: (run: HiddenTemplateRun) => Promise<HiddenTemplateResult>,
    providerBlock = 1000,
  ): BenchmarkDeps & { analyzed: string[] } {
    const analyzed: string[] = []
    return {
      analyzed,
      logger: Logger.SILENT,
      loadProject: (suiteProject) => {
        const found = projects.find((p) => p.name === suiteProject.name)
        if (found === undefined) throw new Error('config.jsonc is broken')
        return found
      },
      providerFor: async () =>
        // `then: undefined` keeps the mock from looking like a promise when awaited.
        mockObject<IProvider & { then: undefined }>({
          chain: 'ethereum',
          blockNumber: providerBlock,
          then: undefined,
        }),
      analyzeWithHiddenTemplate: async (run) => {
        analyzed.push(run.entry.address)
        return await analyze(run)
      },
      now: () => new Date(0),
    }
  }

  const options = { outDir: '', model: 'fake-model', maxRounds: 3 }
  const suite = (...names: string[]): SuiteProject[] =>
    names.map((name) => ({ name, chain: 'ethereum' }))

  function staleTemplate(project: string, address: string): void {
    const directory = join(outDir, project, 'templates')
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(directory, `${address}.jsonc`), '// stale\n')
  }

  it('compares every templated contract and isolates a throw to its contract', async () => {
    const fixture = project('fixture', [
      entry(AUTHORED, {
        $implementation: V2,
        GnosisSafe_modules: [],
        owner: OWNER,
        validators: [V1, V2],
        sequencers: [V1],
        batchers: [V2],
        Proposer: [OWNER],
      }),
      entry(THROWS),
      { ...entry(NO_TEMPLATE, { owner: OWNER }), template: undefined },
      entry(MATCHED, { owner: OWNER }),
      entry(UNAUTHORED, { owner: OWNER, validators: [V1] }),
    ])
    const results: Record<string, HiddenTemplateResult> = {
      [AUTHORED]: {
        values: {
          $implementation: V2,
          GnosisSafe_modules: [],
          owner: OWNER,
          isValidator: [V1, V2],
          sequencers: [V1, V2],
          registry: V1,
        },
        proxyValueNames: ['$implementation', 'GnosisSafe_modules'],
        template: { kind: 'authored', id: 'fixture/Foo', text: '{}\n' },
        trail: trail(),
      },
      [MATCHED]: {
        values: { owner: OWNER },
        proxyValueNames: [],
        template: { kind: 'matched', id: 'shared/Foo' },
      },
      [UNAUTHORED]: {
        values: { owner: OWNER },
        proxyValueNames: [],
        trail: trail({
          status: 'failed',
          failure: 'no acceptable draft after 3 round(s); last errors: x',
          rounds: 3,
        }),
      },
    }
    const fakes = deps([fixture], async ({ entry }) => {
      const result = results[entry.address]
      if (result === undefined) throw new Error('explorer is down')
      return result
    })

    // Left by an earlier run into the same directory: one for an address this
    // run matches and one for an address whose analysis throws.
    staleTemplate('fixture', MATCHED)
    staleTemplate('fixture', THROWS)

    const report = await runBenchmark(fakes, suite('fixture'), {
      ...options,
      outDir,
      unreachable: {
        [AUTHORED.toLowerCase()]: { batchers: 'the length getter reverts' },
      },
    })

    const [authored, threw, matched, unauthored] =
      report.projects[0]?.contracts ?? []
    expect(report.projects[0]?.contracts.length).toEqual(4)
    expect(fakes.analyzed).toEqual([AUTHORED, THROWS, MATCHED, UNAUTHORED])

    expect(verdicts(authored?.fields)).toEqual({
      $implementation: 'equal',
      // A detector name without `$` is still proxy, so it never counts as a getter.
      GnosisSafe_modules: 'equal',
      owner: 'equal',
      validators: 'equal-renamed',
      sequencers: 'different',
      batchers: 'v1-only',
      Proposer: 'v1-only',
      registry: 'v2-only',
    })
    expect(
      authored?.fields.find((f) => f.name === 'GnosisSafe_modules'),
    ).toEqual({
      verdict: 'equal',
      name: 'GnosisSafe_modules',
      attribution: { kind: 'proxy' },
    })
    expect(authored?.fields.find((f) => f.name === 'registry')).toEqual({
      verdict: 'v2-only',
      name: 'registry',
      class: 'ignored-by-v1',
    })
    // validators found under another name; sequencers differ; batchers missed;
    // Proposer is a projection and stays out of the handler numbers.
    expect([
      authored?.counts.handlerFound,
      authored?.counts.handlerFields,
    ]).toEqual([1, 3])
    // batchers is marked unreachable for this contract, so it leaves the
    // headline denominator; nothing the template did not author was lost.
    expect([
      authored?.counts.reachableFound,
      authored?.counts.reachableFields,
      authored?.counts.regressions,
    ]).toEqual([1, 2, 0])
    expect(authored?.fields.find((f) => f.name === 'batchers')).toEqual({
      verdict: 'v1-only',
      name: 'batchers',
      attribution: {
        kind: 'handler',
        handlerType: 'array',
        unreachable: 'the length getter reverts',
      },
    })
    expect(authored?.authoring).toEqual({
      kind: 'authored',
      template: 'fixture/Foo',
    })
    expect([authored?.rounds, authored?.model, authored?.modelMs]).toEqual([
      2,
      'fake-model',
      3000,
    ])

    expect([threw?.status, threw?.error]).toEqual([
      'failed',
      'explorer is down',
    ])
    expect([matched?.authoring, matched?.rounds]).toEqual([
      { kind: 'matched', template: 'shared/Foo' },
      0,
    ])
    expect(unauthored?.authoring).toEqual({
      kind: 'failed',
      failure: 'no acceptable draft after 3 round(s); last errors: x',
    })
    // The untemplatized analysis is still compared: the missed handler field counts.
    expect([
      unauthored?.counts.handlerFound,
      unauthored?.counts.handlerFields,
      unauthored?.counts.reachableFields,
    ]).toEqual([0, 1, 1])

    const totals = report.totals
    expect([totals.contracts, totals.compared, totals.failed]).toEqual([
      4, 3, 1,
    ])
    expect([totals.authored, totals.matched, totals.authoringFailed]).toEqual([
      1, 1, 1,
    ])
    expect([totals.handlerFound, totals.handlerFields]).toEqual([1, 4])
    expect([totals.reachableFound, totals.reachableFields]).toEqual([1, 3])
    expect(totals.regressions).toEqual(0)
    expect(totals.tokens).toEqual({
      input: 600,
      cached: 40,
      output: 60,
      reasoning: 10,
    })
    expect(totals.roundsDistribution).toEqual({ '2': 1, '3': 1 })
    expect(report.reportedModel).toEqual('fake-model')

    expect(
      readFileSync(
        join(outDir, 'fixture', 'templates', `${AUTHORED}.jsonc`),
        'utf8',
      ),
    ).toEqual('{}\n')
    expect(
      existsSync(join(outDir, 'fixture', 'templates', `${MATCHED}.jsonc`)),
    ).toEqual(false)
    expect(
      existsSync(join(outDir, 'fixture', 'templates', `${THROWS}.jsonc`)),
    ).toEqual(false)
    expect(readReport(outDir)).toEqual(JSON.parse(JSON.stringify(report)))
    expect(readFileSync(join(outDir, REPORT_MARKDOWN), 'utf8')).toInclude(
      '# Templatizer benchmark',
    )
  })

  it('passes the command-line restriction and limit to the contract selection', async () => {
    const fakes = deps(
      [project('fixture', [entry(AUTHORED), entry(THROWS), entry(MATCHED)])],
      async () => ({ values: {}, proxyValueNames: [] }),
    )
    await runBenchmark(fakes, suite('fixture'), {
      ...options,
      outDir,
      onlyAddresses: [THROWS, MATCHED],
      limit: 1,
    })
    expect(fakes.analyzed).toEqual([THROWS])
  })

  it('records a project it cannot load or whose provider is at another block, runs the next, and leaves neither an earlier run’s templates', async () => {
    const fakes = deps(
      [project('elsewhere', [entry(AUTHORED)], 999)],
      async () => ({ values: {}, proxyValueNames: [] }),
    )
    staleTemplate('broken', AUTHORED)
    staleTemplate('elsewhere', AUTHORED)
    const report = await runBenchmark(fakes, suite('broken', 'elsewhere'), {
      ...options,
      outDir,
    })
    expect(report.projects.map((p) => p.failure)).toEqual([
      'config.jsonc is broken',
      'The ethereum provider at the committed timestamp 1700000000 is at block 1000, but elsewhere/discovered.json was read at block 999',
    ])
    expect(fakes.analyzed).toEqual([])
    for (const name of ['broken', 'elsewhere']) {
      expect(existsSync(join(outDir, name, 'templates'))).toEqual(false)
    }
  })

  it('stops authoring after a quota refusal, across projects, and records the rest as skipped', async () => {
    const quotaTrail = trail({
      status: 'failed',
      failure:
        'no acceptable draft after 3 round(s); the last turn was refused: usage limit reached',
      lastRefusal: 'You have hit your usage limit. Try again later.',
    })
    // Quota wording inside validator findings is not a refusal and must not stop the run.
    const findingsTrail = trail({
      status: 'failed',
      failure:
        'no acceptable draft; last errors: fields.withdrawalQuota: unknown method',
    })
    const fakes = deps(
      [
        project('first', [entry(AUTHORED), entry(THROWS), entry(MATCHED)]),
        project('second', [entry(UNAUTHORED)]),
      ],
      async ({ entry }) => ({
        values: {},
        proxyValueNames: [],
        trail: entry.address === AUTHORED ? findingsTrail : quotaTrail,
      }),
    )
    staleTemplate('first', MATCHED)
    const report = await runBenchmark(fakes, suite('first', 'second'), {
      ...options,
      outDir,
    })
    expect(fakes.analyzed).toEqual([AUTHORED, THROWS])
    expect(
      existsSync(join(outDir, 'first', 'templates', `${MATCHED}.jsonc`)),
    ).toEqual(false)
    const statuses = report.projects.map((p) =>
      p.contracts.map((c) => c.status),
    )
    expect(statuses).toEqual([['compared', 'compared', 'skipped'], ['skipped']])
    expect(report.projects[1]?.contracts[0]?.error).toEqual(
      'skipped: You have hit your usage limit. Try again later.',
    )
    expect(report.totals.skipped).toEqual(2)
  })

  it('stops authoring once the model does not answer, and records the rest as skipped', async () => {
    const fakes = deps(
      [project('first', [entry(AUTHORED), entry(THROWS), entry(MATCHED)])],
      async ({ entry }) => {
        if (entry.address === AUTHORED) {
          throw new TemplatizationFailedError(
            'model-unavailable',
            { failedTo: '--ai could not templatize X', bypass: 'rerun' },
            'the model did not answer: connection reset',
          )
        }
        return { values: {}, proxyValueNames: [] }
      },
    )
    const report = await runBenchmark(fakes, suite('first'), {
      ...options,
      outDir,
    })

    expect(fakes.analyzed).toEqual([AUTHORED])
    expect(report.projects[0]?.contracts.map((c) => c.status)).toEqual([
      'failed',
      'skipped',
      'skipped',
    ])
    expect(report.projects[0]?.contracts[1]?.error).toEqual(
      'skipped: the model did not answer: connection reset',
    )
  })

  function verdicts(fields: { name: string; verdict: string }[] | undefined) {
    return Object.fromEntries((fields ?? []).map((f) => [f.name, f.verdict]))
  }

  function readReport(directory: string): BenchmarkReport {
    return JSON.parse(readFileSync(join(directory, REPORT_JSON), 'utf8'))
  }
})
