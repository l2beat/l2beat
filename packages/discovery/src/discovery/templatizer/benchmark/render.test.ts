import { expect } from 'earl'
import { countVerdicts, emptyCounts } from './compare'
import { renderMarkdown } from './render'
import { totalsOf } from './runBenchmark'
import type {
  BenchmarkReport,
  ContractBenchmark,
  FieldVerdict,
  ProjectBenchmark,
} from './types'

/**
 * Renders a hand-built report with one contract of every outcome (authored,
 * matched another committed template, authoring failed, threw, skipped for
 * quota) and a project that never ran, and checks that each section
 * carries what a reviewer looks for: handler fields found per project and
 * in total, one row per contract naming the generated template or the
 * failure, every non-equal handler field with its cause, the failures
 * spelled out, and the cost. A pipe in a contract name is escaped so the
 * tables survive it.
 */
describe(renderMarkdown.name, () => {
  const tokens = { input: 12_000, cached: 100, output: 1_500, reasoning: 10 }
  const none = { input: 0, cached: 0, output: 0, reasoning: 0 }
  const event = { kind: 'handler', handlerType: 'event' } as const

  const fields: FieldVerdict[] = [
    { verdict: 'equal', name: 'owner', attribution: { kind: 'getter' } },
    {
      verdict: 'equal-renamed',
      name: 'sequencers',
      generatedName: 'isSequencer',
      attribution: event,
    },
    { verdict: 'equal', name: 'provers', attribution: event },
    { verdict: 'v1-only', name: 'revertedBatches', attribution: event },
    {
      verdict: 'different',
      name: 'verifierVersions',
      attribution: event,
      diff: 'arrays: V1 has 2 item(s), generated 1; only in V1: a|b (1)',
    },
    {
      verdict: 'v1-only',
      name: 'Proposer',
      attribution: {
        kind: 'template-projection',
        via: 'pickRoleMembers',
        handlerType: 'accessControl',
      },
    },
    { verdict: 'v2-only', name: 'committedBatches', class: 'ignored-by-v1' },
    {
      verdict: 'v1-only',
      name: 'layer2ChainId',
      attribution: {
        kind: 'handler',
        handlerType: 'hardcoded',
        unreachable: 'hardcoded handler',
      },
    },
    { verdict: 'v1-only', name: 'paused', attribution: { kind: 'getter' } },
  ]
  const authored: ContractBenchmark = {
    address: 'eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
    name: 'ScrollChain',
    committedTemplate: 'scroll/ScrollChain',
    status: 'compared',
    authoring: { kind: 'authored', template: 'scroll/ScrollChain' },
    model: 'gpt-5.6-sol',
    rounds: 2,
    tokens,
    wallMs: 45_000,
    modelMs: 40_000,
    fields,
    counts: countVerdicts(fields),
  }
  const matched: ContractBenchmark = {
    ...authored,
    address: 'eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F',
    name: 'Verifier',
    committedTemplate: 'scroll/Verifier',
    authoring: { kind: 'matched', template: 'shared/Verifier' },
    model: undefined,
    rounds: 0,
    tokens: none,
    wallMs: 1500,
    modelMs: 0,
    fields: [],
    counts: emptyCounts(),
  }
  const unauthored: ContractBenchmark = {
    ...matched,
    address: 'eth:0x0000000000000000000000000000000000000002',
    name: 'Stubborn',
    committedTemplate: 'scroll/Stubborn',
    authoring: {
      kind: 'failed',
      failure: 'no acceptable draft after 3 round(s); last errors: x',
    },
    rounds: 3,
    tokens,
  }
  const threw: ContractBenchmark = {
    ...matched,
    address: 'eth:0x0000000000000000000000000000000000000001',
    name: 'Odd|Name',
    committedTemplate: 'scroll/Odd',
    status: 'failed',
    authoring: undefined,
    error: 'explorer returned 500',
    wallMs: 300,
  }
  const skipped: ContractBenchmark = {
    ...threw,
    address: 'eth:0x0000000000000000000000000000000000000003',
    name: 'Later',
    status: 'skipped',
    error: 'skipped: usage limit reached',
    wallMs: 0,
  }
  const contracts = [authored, matched, unauthored, threw, skipped]
  const scroll: ProjectBenchmark = {
    project: 'scroll',
    chain: 'ethereum',
    blockNumber: 26076168,
    timestamp: 1790601073,
    contracts,
    totals: totalsOf(contracts),
  }
  const base: ProjectBenchmark = {
    project: 'base',
    chain: 'ethereum',
    failure: 'provider at block 1, committed at block 2',
    contracts: [],
    totals: totalsOf([]),
  }
  const report: BenchmarkReport = {
    model: 'codex default model',
    reportedModel: 'gpt-5.6-sol',
    maxRounds: 3,
    startedAt: '2026-09-29T00:00:00.000Z',
    finishedAt: '2026-09-29T01:00:00.000Z',
    projects: [scroll, base],
    totals: totalsOf(contracts),
  }
  const md = renderMarkdown(report)

  it('states the setup: model, rounds cap, dates and the block of every project', () => {
    expect(md).toInclude(
      '- Model: codex default model (the client reported gpt-5.6-sol)',
    )
    expect(md).toInclude('- Rounds cap: 3 model turn(s) per contract')
    expect(md).toInclude(
      '- Started 2026-09-29T00:00:00.000Z, finished 2026-09-29T01:00:00.000Z',
    )
    expect(md).toInclude('  - scroll: ethereum @ 26076168')
    expect(md).toInclude('  - base: ethereum @ unknown')
  })

  it('leads the summary with reachable fields found and regressions, per project and in total', () => {
    expect(md).toInclude(
      '| Project | Contracts (failed, skipped) | Reachable found | Regressions | Handler fields found | Handler different | Handler missed | V1 fields found |',
    )
    // 2 of 4 reachable handler fields found (equal and renamed), the
    // hardcoded one is unreachable; the missed getter is the one regression;
    // 2 of 5 handler fields found, 1 different, 2 missed; the missed
    // projection is out of the V1 denominator (8 - 1).
    expect(md).toInclude(
      '| scroll | 5 (1, 1) | 2/4 (50.0%) | 1 | 2/5 (40.0%) | 1 | 2 | 3/7 (42.9%) | 2 | 1 | 0 | 1 | 4 | 1 | 1 / 1 / 1 | 2 | 24k / 3k |',
    )
    expect(md).toInclude('| base (FAILED) | 0 (0, 0) | - | 0 | - | 0 | 0 | - |')
    expect(md).toInclude('| Total | 5 (1, 1) | 2/4 (50.0%) | 1 |')
  })

  it('lists every regression and every unreachable handler field with its reason', () => {
    expect(md).toInclude(
      '## Regressions\n\n- scroll: ScrollChain (0xa13B…E556) `paused`: v1-only (getter)\n',
    )
    expect(md).toInclude(
      '## Unreachable handler fields\n\n- scroll: ScrollChain (0xa13B…E556) `layer2ChainId`: v1-only (handler (hardcoded), unreachable: hardcoded handler)\n',
    )
  })

  it('has one row per contract naming the generated template or why there is none', () => {
    expect(md).toInclude('### scroll (ethereum @ 26076168)')
    expect(md).toInclude(
      '| ScrollChain | eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556 | scroll/ScrollChain | scroll/ScrollChain | 2 | 12000 / 1500 | 2/4 | 1 | 2/5 |',
    )
    expect(md).toInclude(
      '| Verifier | eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F | scroll/Verifier | matched committed shared/Verifier | 0 | 0 / 0 | 0/0 | 0 | 0/0 |',
    )
    expect(md).toInclude(
      '| scroll/Stubborn | FAILED: no acceptable draft after 3 round(s); last errors: x | 3 |',
    )
    expect(md).toInclude(
      '| Odd\\|Name | eth:0x0000000000000000000000000000000000000001 | scroll/Odd | ERROR: explorer returned 500 | 0 | 0 / 0 | - | - | - |',
    )
    expect(md).toInclude('| scroll/Odd | SKIPPED |')
    expect(md).toInclude('### base (ethereum @ unknown)\n\n(no contracts)')
  })

  it('lists every handler field that is not equal, with its verdict and diff', () => {
    expect(md).toInclude(
      '- scroll: ScrollChain (0xa13B…E556) `sequencers`: equal-renamed → `isSequencer` (handler (event))',
    )
    expect(md).toInclude(
      '- scroll: ScrollChain (0xa13B…E556) `revertedBatches`: v1-only (handler (event))',
    )
    expect(md).toInclude(
      '- scroll: ScrollChain (0xa13B…E556) `verifierVersions`: different (handler (event)): arrays: V1 has 2 item(s), generated 1; only in V1: a|b (1)',
    )
    expect(md).toInclude(
      '- scroll: ScrollChain (0xa13B…E556) `layer2ChainId`: v1-only (handler (hardcoded), unreachable: hardcoded handler)',
    )
    expect(md).not.toInclude('`provers`')
    expect(md).not.toInclude('`Proposer`')
    expect(md).not.toInclude('`owner`')
  })

  it('spells out every failure in full', () => {
    expect(md).toInclude(
      '- base: not benchmarked: provider at block 1, committed at block 2',
    )
    expect(md).toInclude(
      '- scroll: Stubborn (0x0000…0002): authoring failed after 3 round(s), analysed untemplatized: no acceptable draft after 3 round(s); last errors: x',
    )
    expect(md).toInclude(
      '- scroll: Odd|Name (0x0000…0001): analysis threw: explorer returned 500',
    )
    expect(md).toInclude(
      '- scroll: Later (0x0000…0003): skipped: usage limit reached',
    )
  })

  it('sums the cost', () => {
    expect(md).toInclude(
      '- Tokens: 24000 input (200 cached) + 3000 output (20 reasoning)',
    )
    expect(md).toInclude(
      '- Model calls: 2 contract(s) asked the model; 1 contract(s) in 2 round(s), 1 contract(s) in 3 round(s)',
    )
    expect(md).toInclude(
      '- Time: 48.3 s across all contracts, of which 40.0 s inside model turns',
    )
  })
})
