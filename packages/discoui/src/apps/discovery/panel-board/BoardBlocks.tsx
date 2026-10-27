import {
  Fragment,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Markdown } from '../../../components/Markdown'
import { IconNodes } from '../../../icons/IconNodes'
import { cn } from '../../../utils/cn'
import type { AgentViewSpec } from '../agent/applyView'
import { receiveView } from '../agent/viewStore'
import { useDockingStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'
import type { BoardBlock, BoardRow, CellPart, TableBlock } from './boardApi'
import { frameDocument, readFrameMessage } from './htmlFrame'
import {
  nextSort,
  onlyView,
  shortAddress,
  sortRows,
  type TableSort,
  tableContracts,
  tableWidthPx,
  wideColumns,
} from './table'

export function BoardBlockView(props: { project: string; block: BoardBlock }) {
  const { block } = props
  switch (block.type) {
    case 'text':
      return (
        <Markdown allowHtml={false} className="mdc-chat">
          {block.text}
        </Markdown>
      )
    case 'table':
      return <TableView project={props.project} block={block} />
    case 'view':
      return (
        <button
          type="button"
          onClick={() => showInGraph(props.project, block.view)}
          title="Change the graph; keep or discard it from its banner"
          className="group flex items-center gap-2 rounded-md border border-coffee-700 px-3 py-2 text-left text-[13px] text-coffee-200 transition-colors hover:border-coffee-600 hover:bg-coffee-800"
        >
          <IconNodes className="size-3.5 shrink-0 text-coffee-400" />
          <span className="min-w-0 flex-1">{block.label}</span>
          <span className="text-coffee-600 transition-colors group-hover:text-[#d68ae0]">
            →
          </span>
        </button>
      )
    case 'html':
      return <HtmlBlock html={block.html} heightPx={block.heightPx} />
    case 'problem':
      return (
        <p className="rounded-md border border-aux-orange/40 bg-aux-orange/5 px-3 py-2 text-aux-orange text-xs">
          {block.text}
        </p>
      )
  }
}

// The graph changes the way an agent view does, so the researcher keeps or
// discards it from the same banner.
function showInGraph(project: string, view: AgentViewSpec) {
  useDockingStore.getState().ensureLeaf('nodes')
  receiveView({
    type: 'view',
    id: `board-${crypto.randomUUID()}`,
    project,
    view,
  })
}

function select(address: string) {
  usePanelStore.getState().select([address])
}

function TableView(props: { project: string; block: TableBlock }) {
  const { block } = props
  const [sort, setSort] = useState<TableSort>()
  const rows = useMemo(() => sortRows(block.rows, sort), [block.rows, sort])
  const wide = useMemo(() => wideColumns(block), [block])
  const [section, widthPx] = useWidthPx<HTMLElement>()
  const asCards = widthPx !== undefined && widthPx < tableWidthPx(wide)

  return (
    <section ref={section} className="flex flex-col gap-2">
      <TableTitle project={props.project} block={block} />
      {asCards ? (
        <RowCards columns={block.columns} rows={rows} />
      ) : (
        <ScrollFrame>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                {block.columns.map((label, index) => (
                  <th
                    key={index}
                    onClick={() => setSort(nextSort(sort, index))}
                    title="Sort"
                    className={cn(
                      'cursor-pointer select-none whitespace-nowrap bg-coffee-800 px-2.5 py-1.5 text-left font-medium text-[11px] text-coffee-400 hover:text-coffee-200',
                      index === 0 && 'sticky left-0 z-[2]',
                    )}
                  >
                    {label}
                    {sort?.column === index && (sort.descending ? ' ↓' : ' ↑')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <TableRow
                  key={`${row.address ?? ''}-${index}`}
                  row={row}
                  wide={wide}
                />
              ))}
            </tbody>
          </table>
        </ScrollFrame>
      )}
    </section>
  )
}

function TableTitle(props: { project: string; block: TableBlock }) {
  const { block } = props
  const contracts = useMemo(() => tableContracts(block), [block])
  const title = block.title ?? 'Table'
  return (
    <div className="flex items-center gap-2">
      <h3 className="min-w-0 truncate font-bold text-[13px] text-coffee-200">
        {title}
      </h3>
      <span className="shrink-0 text-[11px] text-coffee-400">
        {block.rows.length} {block.rows.length === 1 ? 'row' : 'rows'}
      </span>
      <div className="flex-1" />
      <button
        type="button"
        disabled={contracts.length === 0}
        onClick={() => showInGraph(props.project, onlyView(title, contracts))}
        title="Show only these contracts in the graph"
        className="flex shrink-0 items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[11px] text-coffee-400 enabled:hover:bg-coffee-700 enabled:hover:text-coffee-200 disabled:opacity-40"
      >
        <IconNodes className="size-3" />
        Show in graph
      </button>
    </div>
  )
}

// Measured before the first paint, so a narrow panel never flashes the
// table it then swaps for cards.
function useWidthPx<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [widthPx, setWidthPx] = useState<number>()
  useLayoutEffect(() => {
    const element = ref.current
    if (element === null) return
    setWidthPx(element.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) setWidthPx(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, widthPx] as const
}

// A panel too narrow for the columns reads each row as a card: its first
// cell on top, then every other column by its label.
function RowCards(props: { columns: string[]; rows: readonly BoardRow[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {props.rows.map((row, index) => (
        <RowCard
          key={`${row.address ?? ''}-${index}`}
          columns={props.columns}
          row={row}
        />
      ))}
    </div>
  )
}

function RowCard(props: { columns: string[]; row: BoardRow }) {
  const { row } = props
  const address = row.address
  const selected = useIsSelected(address)
  return (
    <div
      onClick={address ? () => select(address) : undefined}
      className={cn(
        'rounded-md border px-3 py-2 text-xs',
        selected ? 'border-coffee-600 bg-coffee-800' : 'border-coffee-700',
        address && 'cursor-pointer hover:bg-coffee-800',
      )}
    >
      <div className="font-medium text-[13px]">
        <Cell parts={row.cells[0] ?? []} />
      </div>
      <dl className="mt-1.5 grid grid-cols-[minmax(4rem,max-content)_minmax(0,1fr)] gap-x-3 gap-y-1">
        {props.columns.slice(1).map((label, index) => (
          <Fragment key={index}>
            <dt className="max-w-36 text-coffee-400">{label}</dt>
            <dd>
              <Cell parts={row.cells[index + 1] ?? []} />
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  )
}

function useIsSelected(address: string | undefined): boolean {
  return usePanelStore(
    (state) => address !== undefined && state.selected.includes(address),
  )
}

// The first column stays put while the rest scroll sideways, so every row
// keeps its name; it takes the row's background to cover what slides under.
function TableRow(props: { row: BoardRow; wide: boolean[] }) {
  const { row } = props
  const address = row.address
  const selected = useIsSelected(address)
  return (
    <tr
      onClick={address ? () => select(address) : undefined}
      className={cn(
        'border-coffee-700 border-t',
        selected ? 'bg-coffee-800' : 'bg-coffee-900',
        address && 'cursor-pointer hover:bg-coffee-800',
      )}
    >
      {row.cells.map((cell, column) => (
        <td
          key={column}
          className={cn(
            'px-2.5 py-1.5 align-top',
            props.wide[column] ? 'min-w-56' : 'min-w-16',
            column === 0 && 'sticky left-0 z-[1] bg-inherit',
          )}
        >
          <Cell parts={cell} />
        </td>
      ))}
    </tr>
  )
}

// A table wider than the panel scrolls inside its frame, and the faded edge
// says there is more to the side.
function ScrollFrame(props: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [moreRight, setMoreRight] = useState(false)

  useEffect(() => {
    const element = scroller.current
    if (element === null) return
    const update = () =>
      setMoreRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      )
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    element.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-md border border-coffee-700">
      <div ref={scroller} className="overflow-x-auto">
        {props.children}
      </div>
      {moreRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-10 bg-linear-to-l from-coffee-900 to-transparent" />
      )}
    </div>
  )
}

const CELL_PARTS_SHOWN = 4

function Cell(props: { parts: CellPart[] }) {
  const [expanded, setExpanded] = useState(false)
  if (props.parts.length === 0) {
    return <span className="text-coffee-600">–</span>
  }
  const hidden = props.parts.length - CELL_PARTS_SHOWN
  // "+1 more" takes the place the one part would.
  const shown =
    expanded || hidden <= 1
      ? props.parts
      : props.parts.slice(0, CELL_PARTS_SHOWN)
  const isList = props.parts.length > 1 && props.parts.every(isContract)
  return (
    <span
      className={cn(
        'flex',
        isList ? 'flex-col items-start gap-0.5' : 'flex-wrap gap-x-1.5',
      )}
    >
      {shown.map((part, index) => (
        <CellPartView key={index} part={part} />
      ))}
      {shown.length < props.parts.length && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setExpanded(true)
          }}
          className="text-left text-coffee-400 hover:text-coffee-200"
        >
          +{hidden} more
        </button>
      )}
    </span>
  )
}

function isContract(part: CellPart): boolean {
  return 'address' in part
}

function CellPartView(props: { part: CellPart }) {
  const { part } = props
  if (!('address' in part)) {
    return (
      <span className="wrap-anywhere min-w-0 whitespace-pre-wrap tabular-nums">
        {part.text}
      </span>
    )
  }
  const unnamed = part.name === part.address
  return (
    <button
      type="button"
      title={part.address}
      onClick={(event) => {
        event.stopPropagation()
        select(part.address)
      }}
      className={cn(
        'text-left text-aux-blue hover:underline',
        unnamed && 'whitespace-nowrap font-mono text-[11px]',
      )}
    >
      {unnamed ? <ShortAddress address={part.address} /> : part.name}
    </button>
  )
}

function ShortAddress(props: { address: string }) {
  const short = shortAddress(props.address)
  const separator = short.indexOf(':')
  return (
    <>
      <span className="text-coffee-400">{short.slice(0, separator + 1)}</span>
      {short.slice(separator + 1)}
    </>
  )
}

const HTML_HEIGHT_MIN_PX = 24
const HTML_HEIGHT_MAX_PX = 2000

// As tall as its content says, unless the board fixed a height.
function HtmlBlock(props: { html: string; heightPx?: number }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [contentHeight, setContentHeight] = useState<number>()
  const document = useMemo(() => frameDocument(props.html), [props.html])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return
      const message = readFrameMessage(event.data)
      if (message?.type === 'select') select(message.address)
      if (message?.type === 'height') setContentHeight(message.height)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const height = props.heightPx ?? contentHeight ?? HTML_HEIGHT_MIN_PX
  return (
    <iframe
      ref={frame}
      title="Board page"
      sandbox="allow-scripts"
      srcDoc={document}
      // Matching the page's color scheme keeps the frame transparent.
      style={{
        colorScheme: 'dark',
        height: Math.min(
          Math.max(height, HTML_HEIGHT_MIN_PX),
          HTML_HEIGHT_MAX_PX,
        ),
      }}
      className="w-full shrink-0"
    />
  )
}
