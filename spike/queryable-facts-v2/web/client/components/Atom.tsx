import type { Column } from '../../shared/types'
import { parseAtom, shortAddress } from '../lib/atoms'
import { useApp } from '../lib/context'

/** One cell of a tuple: strings quoted, numbers bare, addresses shortened with the full value on hover. */
export function Cell({ value, type }: { value: string; type?: string }) {
  if (type === 'number' || type === 'unsigned')
    return <span className="num">{value}</span>
  const short = shortAddress(value)
  return (
    <span className="str" title={short !== value ? value : undefined}>
      "{short}"
    </span>
  )
}

/**
 * A tuple rendered as a Datalog atom: `relation("a", "b", 3)`. Clicking it asks why it holds
 * (the proof drawer), unless `plain`.
 */
export function Atom({
  relation,
  cols,
  columns,
  ask,
  plain,
  status,
}: {
  relation: string
  cols: string[]
  columns?: Column[]
  ask?: string
  plain?: boolean
  /** From a citation check: verified / missing / unknown-relation. */
  status?: string
}) {
  const app = useApp()
  const types = columns?.map((c) => c.type) ?? []
  const text = `${relation}(${cols
    .map((c, i) =>
      types[i] === 'number' || types[i] === 'unsigned' ? c : JSON.stringify(c),
    )
    .join(', ')})`
  const body = (
    <>
      <span className="rn">{relation}</span>(
      {cols.map((c, i) => (
        <span key={i}>
          <Cell value={c} type={types[i]} />
          {i < cols.length - 1 ? ', ' : ''}
        </span>
      ))}
      )
    </>
  )
  if (plain) return <span className={`atom ${status ?? ''}`}>{body}</span>
  return (
    <button
      type="button"
      className={`atom link ${status ?? ''}`}
      title={
        status === 'missing'
          ? 'no such tuple in this run'
          : 'why does this hold?'
      }
      onClick={() => app.why(text, ask)}
    >
      {status === 'verified' && <span className="mark ok">✓</span>}
      {status === 'missing' && <span className="mark bad">✗</span>}
      {body}
    </button>
  )
}

/** An atom given as text (from a proof, an answer, a command output). Non-atoms render as code. */
export function AtomText({
  text,
  ask,
  plain,
  status,
}: {
  text: string
  ask?: string
  plain?: boolean
  status?: string
}) {
  const app = useApp()
  const parsed = parseAtom(text)
  if (!parsed) return <code>{text}</code>
  const rec = app.relation(parsed.relation)
  return (
    <Atom
      relation={parsed.relation}
      cols={parsed.cols}
      columns={rec?.columns}
      ask={ask}
      plain={plain}
      status={status}
    />
  )
}
