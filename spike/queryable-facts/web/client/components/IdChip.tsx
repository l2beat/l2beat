import type { Column } from '../../shared/types'
import { useRun } from '../lib/context'

const KIND_LABEL: Record<string, string> = {
  contract: 'contract',
  function: 'fn',
  modifier: 'mod',
  variable: 'var',
  param: 'param',
  local: 'local',
  stmt: 'stmt',
  block: 'block',
  call: 'call',
  write: 'write',
  assembly: 'asm',
  asm: 'asm',
  result: 'result',
  event: 'event',
  other: '',
}

/** A stable id rendered as a clickable chip: click highlights where it lives in the source. */
export function IdChip({ id, onClick }: { id: string; onClick?: () => void }) {
  const { index, showId } = useRun()
  const kind = index.kindOf(id)
  const label = index.shortLabel(id)
  return (
    <button
      type="button"
      className={`chip ${kind}`}
      title={id}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick()
        else showId(id)
      }}
    >
      {KIND_LABEL[kind] && <span className="k">{KIND_LABEL[kind]}</span>}
      <span>{label}</span>
    </button>
  )
}

/** An AST node id (a number in the base facts) as a chip: `#18 Assignment`; click highlights the node. */
export function NodeChip({
  id,
  onClick,
}: {
  id: number
  onClick?: (id: number) => void
}) {
  const { index, showRange } = useRun()
  const node = index.nodeOfNumId(id)
  const loc = index.locOfNode.get(id)
  return (
    <button
      type="button"
      className="chip node"
      title={
        node
          ? `${node.nodeType} #${id}${loc ? ` · line ${loc.startLine}` : ''}`
          : `node #${id}`
      }
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(id)
        else showRange(index.rangeOfNodeId(id))
      }}
    >
      <span className="k">#{id}</span>
      <span>{node?.nodeType ?? '?'}</span>
    </button>
  )
}

/** Which columns of the base relations hold AST node ids. */
export const NODE_COLUMN_NAMES = new Set(['Id', 'Parent', 'Child', 'AstId'])

/** A table cell value: ids become chips, numbers align right, long text truncates. */
export function Cell({
  value,
  type,
  column,
  onNodeClick,
}: {
  value: string
  type?: string
  column?: Column
  onNodeClick?: (id: number) => void
}) {
  const { index } = useRun()
  if (type === 'number') {
    if (column && NODE_COLUMN_NAMES.has(column.name) && value !== '') {
      const id = Number(value)
      if (!Number.isNaN(id) && index.locOfNode.has(id))
        return <NodeChip id={id} onClick={onNodeClick} />
    }
    return <span className="mono">{value}</span>
  }
  if (value !== '' && index.isId(value)) return <IdChip id={value} />
  if (value === '') return <span className="muted">—</span>
  return (
    <span className="txt" title={value}>
      {value}
    </span>
  )
}
