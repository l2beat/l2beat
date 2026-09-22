import { expect } from 'earl'
import { renderComparisonMarkdown, summariseRun } from './renderComparison'
import type { ContractBenchmark, ProjectBenchmark } from './types'

/**
 * One contract with one field of each kind, so every column is shown to
 * count exactly what its header says: found includes equal, renamed and
 * by-value; display-only fields leave the denominator; handler columns see
 * only handler fields.
 */
describe(summariseRun.name, () => {
  const handler = { kind: 'handler', handlerType: 'event' } as const
  const contract: ContractBenchmark = {
    address: 'eth:0x0000000000000000000000000000000000000001',
    status: 'compared',
    planStatus: 'ok',
    planSource: 'model',
    rounds: 1,
    tokens: { input: 1000, cached: 0, output: 50, reasoning: 0 },
    wallMs: 2000,
    modelMs: 1500,
    fields: [
      { verdict: 'equal', name: 'owner', attribution: { kind: 'getter' } },
      { verdict: 'equal', name: 'isSequencer', attribution: handler },
      {
        verdict: 'equal-renamed',
        name: 'provers',
        v2Name: 'isProver',
        attribution: handler,
      },
      {
        verdict: 'equal-by-value',
        name: 'game0',
        v2Names: ['gameImpls'],
        attribution: handler,
      },
      { verdict: 'different', name: 'roles', attribution: handler, diff: 'x' },
      { verdict: 'v1-only', name: 'history', attribution: handler },
      {
        verdict: 'v1-only',
        name: 'Proposer',
        attribution: { kind: 'template-projection', via: 'pickRoleMembers' },
      },
      { verdict: 'v2-only', name: 'extra', class: 'new' },
    ],
    facts: [],
    counts: {
      v1Fields: 7,
      v2Fields: 6,
      equal: 2,
      equalRenamed: 1,
      equalByValue: 1,
      different: 1,
      v1Only: { proxy: 0, getter: 0, handler: 1, 'template-projection': 1 },
      v2Only: { 'ignored-by-v1': 0, new: 1 },
    },
  }
  const report: ProjectBenchmark = {
    project: 'scroll',
    chain: 'ethereum',
    blockNumber: 1,
    model: 'gpt-test',
    author: true,
    review: true,
    facts: false,
    noPlan: false,
    repeat: 0,
    startedAt: '',
    finishedAt: '',
    planStoreBefore: [],
    contracts: [contract],
    totals: {
      ...contract.counts,
      contracts: 1,
      compared: 1,
      failed: 0,
      tokens: contract.tokens,
      wallMs: 2000,
      modelMs: 1500,
      roundsDistribution: { '1': 1 },
    },
  }

  it('counts found, extracted and handler fields as the report defines them', () => {
    const row = summariseRun({ label: 'review', report })
    expect(row.found).toEqual(4)
    expect(row.extracted).toEqual(6)
    expect(row.handlerFields).toEqual(5)
    expect(row.handlerFound).toEqual(3)
    expect(row.handlerMissed).toEqual(1)
    expect(row.setup).toEqual('gpt-test, review')
    const table = renderComparisonMarkdown([{ label: 'review', report }])
    expect(table).toInclude(
      '| scroll | review | gpt-test, review | 1 | 4/6 (66.7%) | 3/5 (60.0%) | 1 | 1 | 1 | 1k / 0k | 2 s |',
    )
  })
})
