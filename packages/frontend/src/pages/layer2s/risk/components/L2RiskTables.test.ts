import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { L2RiskEntry } from '~/server/features/layer2s/risks/getL2RiskEntries'
import { L2RiskTables } from './L2RiskTables'

// Renders the risk listing the way the server does and inspects the HTML a
// crawler receives: every tab's projects must be in it, not just the active
// tab's, with inactive panels hidden.
describe(L2RiskTables.name, () => {
  it('renders projects of inactive tabs into hidden panels', () => {
    const html = renderRiskTables('/layer2s/risk')

    expect(panel(html, 'rollups')).not.toInclude('hidden=""')
    expect(panel(html, 'rollups')).toInclude('Rollup One')
    expect(panel(html, 'validiumsAndOptimiums')).toInclude('hidden=""')
    expect(panel(html, 'validiumsAndOptimiums')).toInclude('Validium Two')
    expect(panel(html, 'others')).toInclude('hidden=""')
    expect(panel(html, 'others')).toInclude('Other Three')
  })

  it('renders an inactive panel with the same content as an active one', () => {
    const inactive = panel(renderRiskTables('/layer2s/risk'), 'others')
    const active = panel(renderRiskTables('/layer2s/risk?tab=others'), 'others')

    expect(inactive).toInclude('hidden=""')
    expect(active).not.toInclude('hidden=""')
    expect(panelContent(inactive)).toEqual(panelContent(active))
  })

  it('does not repeat element ids across panels', () => {
    const html = renderRiskTables('/layer2s/risk')

    expect(findDuplicates(ids(html))).toEqual([])
  })
})

function renderRiskTables(url: string): string {
  globalThis.__FIX_SSR_URL__ = url
  return renderToString(
    createElement(
      TooltipProvider,
      undefined,
      createElement(
        TableFilterContextProvider,
        undefined,
        createElement(L2RiskTables, {
          rollups: [mockEntry('rollup-one', 'Rollup One', 'rollups')],
          validiumsAndOptimiums: [
            mockEntry('validium-two', 'Validium Two', 'validiumsAndOptimiums'),
          ],
          others: [mockEntry('other-three', 'Other Three', 'others')],
        }),
      ),
    ),
  )
}

function mockEntry(
  slug: string,
  name: string,
  tab: L2RiskEntry['tab'],
): L2RiskEntry {
  const risk = { value: 'Mocked', sentiment: 'good' as const }
  return {
    id: ProjectId(slug),
    slug,
    name,
    icon: `/icons/${slug}.png`,
    backgroundColor: undefined,
    statuses: undefined,
    tab,
    isLayer3: false,
    filterable: [],
    risks: {
      stateValidation: risk,
      dataAvailability: risk,
      exitWindow: risk,
      sequencerFailure: risk,
      proposerFailure: risk,
    },
    tvsOrder: 0,
    hasStateValidationSection: false,
    hasDataAvailabilitySection: false,
    hasWithdrawalsSection: false,
    hasOperatorsSection: false,
  }
}

function panel(html: string, value: string): string {
  const start = html.search(new RegExp(`<div[^>]*id="[^"]*-content-${value}"`))
  if (start === -1) {
    throw new Error(`No panel "${value}" rendered`)
  }
  const next = html.slice(start + 1).search(/<div[^>]*role="tabpanel"/)
  return next === -1 ? html.slice(start) : html.slice(start, start + 1 + next)
}

function panelContent(panelHtml: string): string {
  return panelHtml.slice(panelHtml.indexOf('>') + 1)
}

function ids(html: string): string[] {
  return [...html.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1] ?? '')
}

function findDuplicates(values: string[]): string[] {
  return values.filter((value, i) => values.indexOf(value) !== i)
}
