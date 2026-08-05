import { expect } from 'earl'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { PrivacyProjectStats } from './PrivacyProjectStats'

const BASE_PROPS = {
  totalValueLockedUsd: 1_000_000,
  assetsCount: 2,
  bucketsCount: 4,
  deposits: {
    total: 100,
    last7d: 10,
    last30d: 50,
  },
}

describe(PrivacyProjectStats.name, () => {
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
})

function render(children: ReactNode): string {
  return renderToStaticMarkup(
    createElement(TooltipProvider, undefined, children),
  )
}
