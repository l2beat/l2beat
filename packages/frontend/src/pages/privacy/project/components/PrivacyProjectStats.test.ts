import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PrivacyProjectStats } from './PrivacyProjectStats'

const props = {
  assetsCount: 2,
  bucketsCount: 3,
  deposits: {
    total: 10,
    last7d: 2,
    last30d: 5,
  },
}

describe(PrivacyProjectStats.name, () => {
  it('renders N/A when TVL is not configured', () => {
    const html = renderStats({ hasTvl: false, totalValueLockedUsd: undefined })

    expect(html).toInclude('N/A')
    expect(html).not.toInclude('No data')
  })

  it('renders No data when TVL is configured but has no value', () => {
    const html = renderStats({ hasTvl: true, totalValueLockedUsd: undefined })

    expect(html).toInclude('No data')
    expect(html).not.toInclude('N/A')
  })

  it('renders a measured zero', () => {
    const html = renderStats({ hasTvl: true, totalValueLockedUsd: 0 })

    expect(html).toInclude('$0.00')
    expect(html).not.toInclude('No data')
    expect(html).not.toInclude('N/A')
  })
})

function renderStats({
  hasTvl,
  totalValueLockedUsd,
}: {
  hasTvl: boolean
  totalValueLockedUsd: number | undefined
}) {
  return renderToStaticMarkup(
    createElement(PrivacyProjectStats, {
      ...props,
      hasTvl,
      totalValueLockedUsd,
    }),
  )
}
