import { expect } from 'earl'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { PrivacyProjectStats } from './PrivacyProjectStats'

const BASE_PROPS = {
  totalValueLockedUsd: 1_000_000,
  hasTvl: true,
  assetsCount: 2,
  bucketsCount: 4,
  deposits: {
    total: 100,
    last7d: 10,
    last30d: 50,
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

  it('shows the active relayer count when tracking is configured', () => {
    const html = render(
      createElement(PrivacyProjectStats, {
        ...BASE_PROPS,
        activeRelayers30d: 12,
      }),
    )

    expect(html).toInclude('Active Relayers 30D')
    expect(html).toInclude('>12</span>')
  })

  it('shows a zero active relayer count', () => {
    const html = render(
      createElement(PrivacyProjectStats, {
        ...BASE_PROPS,
        activeRelayers30d: 0,
      }),
    )

    expect(html).toInclude('Active Relayers 30D')
  })

  it('hides the metric when relayer tracking is not configured', () => {
    const html = render(createElement(PrivacyProjectStats, BASE_PROPS))

    expect(html).not.toInclude('Active Relayers 30D')
  })

  it('shows relayers when flow tracking is not configured', () => {
    const html = render(
      createElement(PrivacyProjectStats, {
        ...BASE_PROPS,
        assetsCount: 1,
        bucketsCount: 0,
        activeRelayers30d: 3,
      }),
    )

    expect(html).toInclude('Live asset metrics')
    expect(html).toInclude('Not tracked')
    expect(html).toInclude('Active Relayers 30D')
    expect(html).toInclude('>3</span>')
  })
})

function renderStats({
  hasTvl,
  totalValueLockedUsd,
}: {
  hasTvl: boolean
  totalValueLockedUsd: number | undefined
}) {
  return render(
    createElement(PrivacyProjectStats, {
      ...BASE_PROPS,
      hasTvl,
      totalValueLockedUsd,
    }),
  )
}

function render(children: ReactNode): string {
  return renderToStaticMarkup(
    createElement(TooltipProvider, undefined, children),
  )
}
