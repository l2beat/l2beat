import { expect } from 'earl'
import { renderBlockStatsPage } from './BlockStatsPage'

describe(renderBlockStatsPage.name, () => {
  it('aggregates using raw totals and rounds only for final display', () => {
    const html = renderBlockStatsPage([
      {
        cluster: 'cluster-a',
        chain: 'ethereum',
        totalMs: 1.2,
        cpuMs: 0.2,
        count: 1,
        avgMs: 1.2,
        avgCpuMs: 0.2,
      },
      {
        cluster: 'cluster-b',
        chain: 'ethereum',
        totalMs: 1.3,
        cpuMs: 0.3,
        count: 1,
        avgMs: 1.3,
        avgCpuMs: 0.3,
      },
    ])

    expect(html).toInclude('>1.25<')
    expect(html).toInclude('>0.25<')
    expect(html).toInclude('data-order="1.25"')
    expect(html).toInclude('data-order="0.25"')
  })
})
