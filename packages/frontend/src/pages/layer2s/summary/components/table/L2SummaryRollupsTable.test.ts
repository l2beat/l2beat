import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createElement, type ReactNode } from 'react'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { BasicTable } from '~/components/table/BasicTable'
import { isChangeSortColumn } from '~/components/table/utils/renderedTableColumns'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import {
  createTestTable,
  getColumnCellTags,
  renderOnServer,
} from '~/test/table'
import { type L2SummaryTableRow, toTableRows } from '../../utils/toTableRows'
import { getL2SummaryColumns } from './columns'
import { L2SummaryRollupsTable } from './L2SummaryRollupsTable'
import { renderL2SummaryRollupsTable } from './renderL2SummaryRollupsTable.testFixture'

/*
 * Method: server-render the real Rollups table inside the providers the page
 * gives it, with one project. The server never sees the visitor's persisted column
 * visibility, so the hidden case builds the same columns with every hideable
 * column switched off and renders them through BasicTable directly.
 */

const ENTRY: L2SummaryEntry = {
  id: ProjectId('arbitrum'),
  icon: '/icons/arbitrum.png',
  name: 'Arbitrum One',
  slug: 'arbitrum',
  backgroundColor: undefined,
  statuses: undefined,
  filterable: undefined,
  tab: 'rollups',
  isLayer3: false,
  capability: 'universal',
  stage: { stage: 'NotApplicable' },
  proofSystem: { type: 'Optimistic' },
  purposes: ['Universal'],
  stacks: undefined,
  dataAvailability: undefined,
  reasonsForBeingOther: undefined,
  tvs: { associatedTokens: [], warnings: [] },
  activity: {
    pastDayUops: 12.5,
    change: 0.1,
    changePeriod: '7D',
    isSynced: true,
  },
  tvsOrder: 1,
  risks: [
    'State Validation',
    'Data Availability',
    'Exit Window',
    'Sequencer Failure',
    'Proposer Failure',
  ].map((name) => ({ name, value: 'Fine', sentiment: 'good' as const })),
  baseLayerRisks: undefined,
}

const LEAF_COLUMN_IDS = getSummaryTable({})
  .getAllLeafColumns()
  .filter((column) => !isChangeSortColumn(column))
  .map((column) => column.id)

describe(L2SummaryRollupsTable.name, () => {
  it('server-renders a caption naming the tab', () => {
    const html = renderL2SummaryRollupsTable([ENTRY])

    expect(html).toInclude(
      '<caption class="sr-only">Scaling projects summary, Rollups tab</caption>',
    )
  })

  it('server-renders a scoped header cell and a body cell for every column', () => {
    const html = renderL2SummaryRollupsTable([ENTRY])

    for (const id of LEAF_COLUMN_IDS) {
      const [headerCell = ''] = getColumnCellTags(html, 'th', id)
      expect(headerCell).toInclude('scope="col"')
      expect(getColumnCellTags(html, 'td', id).length).toEqual(1)
    }
  })

  it('keeps every column in the markup when hideable columns are switched off', () => {
    const hideableColumnIds = getSummaryTable({})
      .getAllLeafColumns()
      .filter((column) => column.getCanHide())
      .map((column) => column.id)
    expect(hideableColumnIds.length).toBeGreaterThan(0)

    const html = renderOnServer(
      withTooltips(
        createElement(BasicTable<L2SummaryTableRow>, {
          table: getSummaryTable(
            Object.fromEntries(hideableColumnIds.map((id) => [id, false])),
          ),
          caption: 'Scaling projects summary, Rollups tab',
        }),
      ),
    )

    for (const id of LEAF_COLUMN_IDS) {
      const cells = [
        ...getColumnCellTags(html, 'th', id),
        ...getColumnCellTags(html, 'td', id),
      ]
      expect(cells.length).toEqual(2)
      for (const cell of cells) {
        expect(cell.includes(' hidden=""')).toEqual(
          hideableColumnIds.includes(id),
        )
      }
    }
  })
})

function getSummaryTable(columnVisibility: Record<string, boolean>) {
  return createTestTable<L2SummaryTableRow>({
    data: toTableRows({ entries: [ENTRY], data: undefined }),
    columns: getL2SummaryColumns(),
    columnVisibility,
  })
}

function withTooltips(children: ReactNode) {
  return createElement(TooltipProvider, null, children)
}
