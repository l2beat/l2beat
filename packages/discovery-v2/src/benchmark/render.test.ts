import { expect } from 'earl'
import { renderMarkdown } from './render'
import { totalsOf } from './runBenchmark'
import type { ContractBenchmark, ProjectBenchmark } from './types'

/**
 * Renders a hand-built report with one contract of every outcome (compared
 * with a store plan, authored with repeats, pipeline failure, authoring
 * failure) and checks that each section carries what a reviewer looks for:
 * the summary row, one contract row each, every non-equal handler field with
 * its cause, every v2-only field, the failures spelled out, and the cost.
 * A pipe in a contract name is escaped so the tables survive it.
 */
describe(renderMarkdown.name, () => {
  const tokens = { input: 1000, cached: 100, output: 50, reasoning: 10 }
  const none = { input: 0, cached: 0, output: 0, reasoning: 0 }

  const compared: ContractBenchmark = {
    address: 'eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
    name: 'ScrollChain',
    template: 'scroll/ScrollChain',
    status: 'compared',
    planStatus: 'ok',
    planSource: 'store',
    planHash: '0xplan',
    decisionHash: '0xdecision',
    rounds: 0,
    tokens: none,
    wallMs: 1500,
    modelMs: 0,
    fields: [
      { verdict: 'equal', name: 'owner', attribution: { kind: 'getter' } },
      {
        verdict: 'equal-renamed',
        name: 'sequencers',
        v2Name: 'isSequencer',
        attribution: { kind: 'handler', handlerType: 'event' },
      },
      {
        verdict: 'v1-only',
        name: 'revertedBatches',
        attribution: { kind: 'handler', handlerType: 'event' },
      },
      {
        verdict: 'different',
        name: 'verifierVersions',
        attribution: { kind: 'handler', handlerType: 'event' },
        diff: 'arrays: V1 has 2 item(s), V2 1; only in V1: a|b (1)',
      },
      { verdict: 'v2-only', name: 'committedBatches', class: 'ignored-by-v1' },
      { verdict: 'v2-only', name: 'isProver', class: 'new' },
    ],
    facts: [
      { fact: 'proxyType', equal: true, v1: 'x', v2: 'x' },
      { fact: 'sinceBlock', equal: false, v1: 1, v2: 2 },
    ],
    counts: {
      v1Fields: 4,
      v2Fields: 5,
      equal: 1,
      equalRenamed: 1,
      different: 1,
      v1Only: { proxy: 0, getter: 0, handler: 1, 'template-projection': 0 },
      v2Only: { 'ignored-by-v1': 1, new: 1 },
    },
  }
  const authored: ContractBenchmark = {
    ...compared,
    address: 'eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F',
    name: 'MultipleVersionRollupVerifier',
    planSource: 'model',
    model: 'gpt-test',
    rounds: 2,
    tokens,
    modelMs: 40_000,
    wallMs: 45_000,
    fields: [],
    facts: [],
    counts: {
      ...compared.counts,
      v1Fields: 0,
      v2Fields: 0,
      equal: 0,
      equalRenamed: 0,
      different: 0,
      v1Only: { proxy: 0, getter: 0, handler: 0, 'template-projection': 0 },
      v2Only: { 'ignored-by-v1': 0, new: 0 },
    },
    repeats: {
      plans: 3,
      distinctDecisionHashes: 2,
      attempts: [
        {
          status: 'ok',
          rounds: 1,
          tokens,
          durationMs: 20_000,
          decisionHash: '0xdecision',
        },
        {
          status: 'ok',
          rounds: 1,
          tokens,
          durationMs: 20_000,
          decisionHash: '0xother00000',
        },
      ],
    },
  }
  const threw: ContractBenchmark = {
    address: 'eth:0x0000000000000000000000000000000000000001',
    name: 'Odd|Name',
    status: 'failed',
    error: 'explorer returned 500',
    planSource: 'none',
    rounds: 0,
    tokens: none,
    wallMs: 300,
    modelMs: 0,
    fields: [],
    facts: [],
    counts: authored.counts,
  }
  const unauthorable: ContractBenchmark = {
    ...threw,
    address: 'eth:0x0000000000000000000000000000000000000002',
    name: 'Stubborn',
    status: 'compared',
    error: undefined,
    planStatus: 'failed',
    planSource: 'model',
    rounds: 3,
    tokens,
    authoringFailure: 'no acceptable plan after 3 round(s)',
  }
  const contracts = [compared, authored, threw, unauthorable]
  const report: ProjectBenchmark = {
    project: 'scroll',
    chain: 'ethereum',
    blockNumber: 25789575,
    model: 'gpt-test',
    author: true,
    noPlan: false,
    repeat: 2,
    startedAt: '2026-09-22T00:00:00.000Z',
    finishedAt: '2026-09-22T01:00:00.000Z',
    planStoreBefore: [`0x${'ab'.repeat(32)}`],
    contracts,
    totals: totalsOf(contracts),
  }

  it('renders every section with the rows and lines a reviewer needs', () => {
    const md = renderMarkdown(report)
    expect(md).toInclude('# Benchmark: scroll (ethereum @ 25789575)')
    expect(md).toInclude('- Model: gpt-test')
    expect(md).toInclude('Plan store before the run: 1 plan(s) (0xabababab)')
    expect(md).toInclude(
      '| scroll | 4 (1) | 4 | 5 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 1 | 1 |',
    )
    expect(md).toInclude('## Consistency (--repeat)')
    expect(md).toInclude(
      '| MultipleVersionRollupVerifier (0x4CEA…ad3F) | 2 | 0 | 3 | 2 | 0xdecision, 0xother000 |',
    )
    expect(md).toInclude(
      '| ScrollChain (0xa13B…E556) | scroll/ScrollChain | ok | store | 0 | 0+0 | 1.5 | 1 | 1 | 1 | 1 | 2 | - |',
    )
    expect(md).toInclude(
      '- ScrollChain (0xa13B…E556) `revertedBatches`: v1-only (handler (event))',
    )
    expect(md).toInclude(
      '- ScrollChain (0xa13B…E556) `sequencers`: equal-renamed → `isSequencer` (handler (event))',
    )
    expect(md).toInclude('only in V1: a|b (1)')
    expect(md).toInclude('| Odd\\|Name (0x0000…0001) | - | FAILED | none |')
    expect(md).not.toInclude('`owner`')
    expect(md).toInclude(
      '- ScrollChain (0xa13B…E556) `committedBatches`: v2-only (ignored-by-v1)',
    )
    expect(md).toInclude(
      '- ScrollChain (0xa13B…E556) `isProver`: v2-only (new)',
    )
    expect(md).toInclude('`sinceBlock`: V1 1 vs V2 2')
    expect(md).toInclude(
      '- Odd|Name (0x0000…0001): pipeline threw: explorer returned 500',
    )
    expect(md).toInclude(
      '- Stubborn (0x0000…0002): authoring failed after 3 round(s): no acceptable plan after 3 round(s)',
    )
    expect(md).toInclude(
      '- Rounds: 1 contract(s) in 2 round(s), 1 contract(s) in 3 round(s)',
    )
    expect(md).toInclude(
      '- Failures: 1 pipeline(s) threw; 1 authoring(s) failed',
    )
  })

  it('sums tokens and model time over repeats and counts compared and failed contracts', () => {
    expect(report.totals.contracts).toEqual(4)
    expect(report.totals.compared).toEqual(3)
    expect(report.totals.failed).toEqual(1)
    // authored + unauthorable + two repeats
    expect(report.totals.tokens).toEqual({
      input: 4000,
      cached: 400,
      output: 200,
      reasoning: 40,
    })
    expect(report.totals.modelMs).toEqual(80_000)
    expect(report.totals.wallMs).toEqual(1500 + 45_000 + 300 + 300)
    expect(report.totals.roundsDistribution).toEqual({ '2': 1, '3': 1 })
  })
})
