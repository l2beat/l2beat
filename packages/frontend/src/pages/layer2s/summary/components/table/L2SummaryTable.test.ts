import {
  createTable,
  getCoreRowModel,
  type VisibilityState,
} from '@tanstack/react-table'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { BasicTable } from '~/components/table/BasicTable'
import { isChangeSortColumn } from '~/components/table/utils/renderedTableColumns'
import type { L2SummaryTableRow } from '../../utils/toTableRows'
import { getL2SummaryColumns } from './columns'

/*
 * Method: render the scaling summary columns through BasicTable to static
 * markup, the path the server takes, once with every column visible and once
 * with every hideable column hidden as if restored from the column picker.
 * The table is rendered in its loading state so no project fixture is needed;
 * body cells are covered by BasicTable's own tests.
 */

describe('scaling summary table', () => {
  before(() => {
    globalThis.__FIX_SSR_URL__ = '/scaling/summary'
  })

  it('renders a header cell for every column regardless of visibility', () => {
    const allVisible = render({})
    const hideableColumnIds = createSummaryTable()
      .getAllLeafColumns()
      .filter((column) => column.getCanHide())
      .map((column) => column.id)
    expect(hideableColumnIds.length).toBeGreaterThan(0)
    const allHidden = render(
      Object.fromEntries(hideableColumnIds.map((id) => [id, false])),
    )

    for (const html of [allVisible, allHidden]) {
      for (const id of getLeafColumnIds()) {
        expect(html).toInclude(`data-column-id="${id}"`)
      }
    }
  })

  it('has a caption and scoped column headers', () => {
    const html = render({})

    expect(html).toInclude('<caption class="sr-only">Scaling summary</caption>')
    const headerCells = html.match(/<th\b[^>]*data-column-id[^>]*>/g) ?? []
    expect(headerCells.length).toEqual(getLeafColumnIds().length)
    for (const headerCell of headerCells) {
      expect(headerCell).toInclude('scope="col"')
    }
  })
})

function render(columnVisibility: VisibilityState) {
  const table = createSummaryTable()
  table.setOptions((prev) => ({
    ...prev,
    state: { ...table.initialState, columnVisibility },
  }))
  return renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(BasicTable<L2SummaryTableRow>, {
        table,
        caption: 'Scaling summary',
        isLoading: true,
      }),
    ),
  )
}

function getLeafColumnIds() {
  return createSummaryTable()
    .getAllLeafColumns()
    .filter((column) => !isChangeSortColumn(column))
    .map((column) => column.id)
}

function createSummaryTable() {
  return createTable<L2SummaryTableRow>({
    data: [],
    columns: getL2SummaryColumns(),
    getCoreRowModel: getCoreRowModel(),
    renderFallbackValue: null,
    state: {},
    onStateChange: () => {},
  })
}
