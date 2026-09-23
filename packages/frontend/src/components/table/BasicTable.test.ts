import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
  type VisibilityState,
} from '@tanstack/react-table'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BasicTable } from './BasicTable'
import { TableFilterContext } from './filters/TableFilterContext'

/*
 * Method: build a real TanStack table (no React hooks needed) and render
 * BasicTable to static markup, the same path the server uses. Assertions look
 * at individual opening tags so they do not depend on attribute order.
 */

interface Row {
  slug: string
  name: string
  tvs: number
  activity: number
  stage: string
}

const columnHelper = createColumnHelper<Row>()

const NAME_COLUMN = columnHelper.accessor('name', {
  header: 'Name',
  enableHiding: false,
})

const COLUMNS = [
  NAME_COLUMN,
  columnHelper.group({
    id: 'metrics',
    header: 'Metrics',
    columns: [
      columnHelper.accessor('tvs', { header: 'TVS' }),
      columnHelper.accessor('activity', { header: 'Activity' }),
    ],
  }),
  columnHelper.accessor('stage', { header: 'Stage' }),
]

const ROWS: Row[] = [
  { slug: 'arbitrum', name: 'Arbitrum', tvs: 1, activity: 2, stage: 'S1' },
]

const LEAF_COLUMN_IDS = ['name', 'tvs', 'activity', 'stage']

describe(BasicTable.name, () => {
  // Server rendering reads query params from the request URL, set per request.
  before(() => {
    globalThis.__FIX_SSR_URL__ = '/scaling/summary'
  })

  it('names the table in a visually hidden caption', () => {
    const html = render({ caption: 'Rollups' })

    expect(html).toInclude('<caption class="sr-only">Rollups</caption>')
  })

  it('names active filters in the caption', () => {
    const html = renderToStaticMarkup(
      createElement(
        TableFilterContext.Provider,
        {
          value: {
            state: { stack: { values: ['OP Stack'] } },
            dispatch: () => {},
          },
        },
        createElement(BasicTable<Row>, {
          table: createRowTable({}),
          caption: 'Rollups',
        }),
      ),
    )

    expect(html).toInclude(
      '<caption class="sr-only">Rollups. Filtered by Stack is OP Stack</caption>',
    )
  })

  it('scopes column headers to their column and group headers to their group', () => {
    const html = render({})

    for (const id of LEAF_COLUMN_IDS) {
      expect(getTag(html, 'th', id)).toInclude('scope="col"')
    }
    const groupHeader = html.match(/<th\b[^>]*>Metrics</)?.[0] ?? ''
    expect(groupHeader).toInclude('scope="colgroup"')
  })
})

function render(params: {
  caption?: string
  columns?: typeof COLUMNS
  columnVisibility?: VisibilityState
}) {
  return renderToStaticMarkup(
    createElement(BasicTable<Row>, {
      table: createRowTable(params),
      caption: params.caption ?? 'Projects',
    }),
  )
}

function createRowTable(params: {
  columns?: typeof COLUMNS
  columnVisibility?: VisibilityState
}) {
  const table = createTable<Row>({
    data: ROWS,
    columns: params.columns ?? COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    renderFallbackValue: null,
    state: {},
    onStateChange: () => {},
  })
  table.setOptions((prev) => ({
    ...prev,
    state: {
      ...table.initialState,
      columnVisibility: params.columnVisibility ?? {},
    },
  }))
  return table
}

function getTags(html: string, tagName: 'th' | 'td') {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? []
}

function getTag(html: string, tagName: 'th' | 'td', columnId: string) {
  const tag = getTags(html, tagName).find((tag) =>
    tag.includes(`data-column-id="${columnId}"`),
  )
  if (!tag) {
    throw new Error(`No <${tagName}> for column ${columnId}`)
  }
  return tag
}
