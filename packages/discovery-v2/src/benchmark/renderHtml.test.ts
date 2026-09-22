import { expect } from 'earl'
import { describe, it } from 'mocha'
import { renderHtml } from './renderHtml'
import type { ProjectBenchmark } from './types'

/**
 * The page is read, not parsed, so the tests check what a reader relies on:
 * every run is on the page under its label, the data survives embedding
 * (a `</script>` inside a diff string must not end the data block), and the
 * output is one file with no external references.
 */
describe(renderHtml.name, () => {
  const report = (over: Partial<ProjectBenchmark>): ProjectBenchmark => ({
    project: 'scroll',
    chain: 'ethereum',
    blockNumber: 1,
    author: false,
    noPlan: true,
    repeat: 0,
    startedAt: '',
    finishedAt: '',
    planStoreBefore: [],
    contracts: [],
    totals: {
      contracts: 0,
      compared: 0,
      failed: 0,
      v1Fields: 0,
      v2Fields: 0,
      equal: 0,
      equalRenamed: 0,
      equalByValue: 0,
      different: 0,
      v1Only: { proxy: 0, getter: 0, handler: 0, 'template-projection': 0 },
      v2Only: { 'ignored-by-v1': 0, new: 0 },
      tokens: { input: 0, cached: 0, output: 0, reasoning: 0 },
      wallMs: 0,
      modelMs: 0,
      roundsDistribution: {},
    },
    ...over,
  })

  it('embeds every run with its label and no external resources', () => {
    const html = renderHtml([
      { label: 'floor', report: report({}) },
      {
        label: 'gpt-test',
        report: report({ noPlan: false, model: 'gpt-test' }),
      },
    ])
    const data = JSON.parse(dataBlock(html))
    expect(data.map((r: { label: string }) => r.label)).toEqual([
      'floor',
      'gpt-test',
    ])
    expect(html).not.toInclude('<link')
    expect(html).not.toInclude('src="http')
  })

  it('keeps a </script> inside the data from ending the data block', () => {
    const html = renderHtml([
      {
        label: 'x',
        report: report({ contracts: [], startedAt: '</script><b>' }),
      },
    ])
    const data = JSON.parse(dataBlock(html))
    expect(data[0].startedAt).toEqual('</script><b>')
  })
})

function dataBlock(html: string): string {
  const match = html.match(
    /<script id="data" type="application\/json">([\s\S]*?)<\/script>/,
  )
  if (match?.[1] === undefined) {
    throw new Error('no data block')
  }
  return match[1]
}
