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

/** A table cell value: ids become chips, numbers align right, long text truncates. */
export function Cell({ value, type }: { value: string; type?: string }) {
  const { index } = useRun()
  if (type === 'number') return <span className="mono">{value}</span>
  if (value !== '' && index.isId(value)) return <IdChip id={value} />
  if (value === '') return <span className="muted">—</span>
  return (
    <span className="txt" title={value}>
      {value}
    </span>
  )
}
