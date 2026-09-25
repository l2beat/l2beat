import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createElement } from 'react'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { L2RiskEntry } from '~/server/features/layer2s/risks/getL2RiskEntries'
import { getTabPanelHtml, renderServerHtml } from '~/test/serverHtml'
import { L2RiskTables } from './L2RiskTables'

// Renders the risk listing the way the server does and inspects the HTML a
// crawler receives: every tab's projects must be in it, not just the active
// tab's, with inactive panels hidden. Every mock project carries all row
// warnings, so icons that repeat per row appear in every panel.
describe(L2RiskTables.name, () => {
  it('renders projects of inactive tabs into hidden panels', () => {
    const html = renderRiskTables('/layer2s/risk')

    expect(getTabPanelHtml(html, 'rollups')).not.toInclude('hidden=""')
    expect(getTabPanelHtml(html, 'rollups')).toInclude('Rollup One')
    const validiums = getTabPanelHtml(html, 'validiumsAndOptimiums')
    expect(validiums).toInclude('hidden=""')
    expect(validiums).toInclude('Validium Two')
    expect(getTabPanelHtml(html, 'others')).toInclude('hidden=""')
    expect(getTabPanelHtml(html, 'others')).toInclude('Other Three')
  })

  it('renders an inactive panel with the same content as an active one', () => {
    const inactive = getTabPanelHtml(
      renderRiskTables('/layer2s/risk'),
      'others',
    )
    const active = getTabPanelHtml(
      renderRiskTables('/layer2s/risk?tab=others'),
      'others',
    )

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
  return renderServerHtml(
    url,
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
    statuses: {
      yellowWarning: 'Yellow warning',
      redWarning: { text: 'Red warning' },
      verificationWarnings: {
        contracts: 'Unverified contracts',
        programHashes: 'Unverified program hashes',
        programHashesDescription: undefined,
      },
      underReview: 'config',
      syncWarning: 'Out of sync',
      emergencyWarning: 'Emergency',
      ongoingAnomaly: true,
    },
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

function panelContent(panelHtml: string): string {
  return panelHtml.slice(panelHtml.indexOf('>') + 1)
}

function ids(html: string): string[] {
  return [...html.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1] ?? '')
}

function findDuplicates(values: string[]): string[] {
  return values.filter((value, i) => values.indexOf(value) !== i)
}
