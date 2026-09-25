import { createColumnHelper, type VisibilityState } from '@tanstack/react-table'
import { expect } from 'earl'
import { createElement } from 'react'
import {
  createTestTable,
  getColumnCellTags,
  renderOnServer,
} from '~/test/table'
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

const FIRST_SHOWN_ATTRIBUTE = ' data-first-shown=""'
const LAST_SHOWN_ATTRIBUTE = ' data-last-shown=""'

const LEAF_COLUMN_IDS = ['name', 'tvs', 'activity', 'stage']

describe(BasicTable.name, () => {
  it('names the table in a visually hidden caption', () => {
    const html = render({ caption: 'Rollups' })

    expect(html).toInclude('<caption class="sr-only">Rollups</caption>')
  })

  it('names active filters in the caption', () => {
    const html = renderOnServer(
      createElement(
        TableFilterContext.Provider,
        {
          value: {
            state: { stack: { values: ['OP Stack'] } },
            dispatch: () => {},
          },
        },
        createElement(BasicTable<Row>, {
          table: createTestTable({ data: ROWS, columns: COLUMNS }),
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

  it('keeps hidden columns in the markup, hidden with CSS', () => {
    const html = render({
      columnVisibility: { activity: false, stage: false },
    })

    for (const id of LEAF_COLUMN_IDS) {
      const isHidden = id === 'activity' || id === 'stage'
      for (const tag of [getTag(html, 'th', id), getTag(html, 'td', id)]) {
        expect(tag.includes(' hidden=""')).toEqual(isHidden)
      }
    }
    expect(html).toInclude('>S1<')
  })

  it('lays out shown cells exactly as if hidden columns did not exist', () => {
    const withHiddenColumns = render({
      columnVisibility: { activity: false, stage: false },
    })
    const withoutColumns = render({
      columns: [
        NAME_COLUMN,
        columnHelper.group({
          id: 'metrics',
          header: 'Metrics',
          columns: [columnHelper.accessor('tvs', { header: 'TVS' })],
        }),
      ],
    })

    // Edge marks stand in for :last-child and have their own test below.
    expect(
      withoutHiddenCells(withHiddenColumns).replaceAll(
        LAST_SHOWN_ATTRIBUTE,
        '',
      ),
    ).toEqual(withoutColumns)
  })

  it('marks the last shown cell when hidden cells follow it', () => {
    const html = render({ columnVisibility: { stage: false } })

    expect(getTag(html, 'th', 'activity')).toInclude(LAST_SHOWN_ATTRIBUTE)
    expect(getTag(html, 'td', 'activity')).toInclude(LAST_SHOWN_ATTRIBUTE)
    expect(getTag(html, 'td', 'tvs')).not.toInclude(LAST_SHOWN_ATTRIBUTE)
  })

  it('leaves edge marks out when no hidden cell sits beyond the edge', () => {
    const html = render({})

    expect(html).not.toInclude(LAST_SHOWN_ATTRIBUTE)
    expect(html).not.toInclude(FIRST_SHOWN_ATTRIBUTE)
  })
})

function render(params: {
  caption?: string
  columns?: typeof COLUMNS
  columnVisibility?: VisibilityState
}) {
  return renderOnServer(
    createElement(BasicTable<Row>, {
      table: createTestTable({
        data: ROWS,
        columns: params.columns ?? COLUMNS,
        columnVisibility: params.columnVisibility,
      }),
      caption: params.caption ?? 'Projects',
    }),
  )
}

function withoutHiddenCells(html: string) {
  return html.replace(/<(th|td)\b[^>]* hidden=""[^>]*>.*?<\/\1>/g, '')
}

function getTag(html: string, tagName: 'th' | 'td', columnId: string) {
  const [tag] = getColumnCellTags(html, tagName, columnId)
  if (!tag) {
    throw new Error(`No <${tagName}> for column ${columnId}`)
  }
  return tag
}
