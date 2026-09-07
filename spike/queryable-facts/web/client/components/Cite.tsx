import { type Atom, parseAtom, parseLineRef } from '../lib/atoms'
import { useRun } from '../lib/context'
import type { Range, RowRef, RunIndex } from '../lib/run'
import { Cell, IdChip } from './IdChip'

/**
 * Inline code in the report or in an answer, made navigable when it names something in this run:
 * a Datalog atom opens its row (step 6, 4 or 3 by layer), an id highlights itself in the source,
 * `L25` / `L24-L27` show those lines. Anything else stays plain code. An atom whose relation exists
 * but whose row does not is marked, so a made-up citation is visible as such.
 */
export function Cite({ text }: { text: string }) {
  const { index, nav, setNav, showRange } = useRun()
  const unit = index.run.unit

  const lines = parseLineRef(text)
  if (lines) {
    const range = lineSpan(index.run.source, lines.from, lines.to)
    return (
      <button
        type="button"
        className="cite line"
        disabled={!range}
        title={range ? 'show these lines in the source' : 'no such line'}
        onClick={() => showRange(range)}
      >
        {text}
      </button>
    )
  }

  const atom = parseAtom(text)
  if (atom) {
    if (!index.relations.has(atom.relation)) return <code>{text}</code>
    const ref = locateRow(index, atom)
    if (!ref)
      return (
        <code
          className="cite unknown"
          title={`${atom.relation} is a relation of this program, but this run has no such row`}
        >
          {text}
        </code>
      )
    const cols = index.row(ref) ?? atom.cols
    const columns = index.relations.get(atom.relation)?.columns ?? []
    const layer = index.layerOf(atom.relation)
    const step = layer === 'base' ? 3 : layer === 'concept' ? 4 : 6
    const open = () => {
      const range = index.rangeOfRow(ref)
      const at = {
        range,
        line: range ? index.lineOf(range.start) : undefined,
        nonce: nav.nonce + 1,
      }
      if (layer === 'derived')
        setNav({
          ...at,
          step: 6,
          derivedRelation: atom.relation,
          derivedRow: cols,
        })
      else if (layer === 'concept')
        setNav({
          ...at,
          step: 4,
          relation: atom.relation,
          factRef: ref,
          filterLine: undefined,
          filterNodeId: undefined,
        })
      else
        setNav({
          ...at,
          step: 3,
          baseRelation: atom.relation,
          baseNodeId: index.anchorNodeId(ref),
          baseLine: undefined,
        })
    }
    return (
      <span className="cite atom">
        <button
          type="button"
          className="rn"
          onClick={open}
          title={`open this ${atom.relation} row in step ${step}`}
        >
          {atom.relation}
        </button>
        (
        {cols.map((c, i) => (
          <span key={i}>
            <Cell value={c} type={columns[i]?.type} column={columns[i]} />
            {i < cols.length - 1 ? ', ' : ''}
          </span>
        ))}
        )
      </span>
    )
  }

  if (index.isId(text)) return <IdChip id={text} />
  if (index.isId(`${unit}:${text}`)) return <IdChip id={`${unit}:${text}`} />
  const ctor = constructorId(index, text)
  if (ctor) return <IdChip id={ctor} />
  return <code>{text}</code>
}

/** The report writes deployment as `Contract.constructor()`; the function's id carries the parameter types. */
function constructorId(index: RunIndex, text: string): string | undefined {
  const m = /^(?:[\w.]+:)?([\w.]+)\.constructor\(\)$/.exec(text)
  if (!m) return undefined
  const prefix = `${index.run.unit}:${m[1]}.constructor(`
  return index.concepts
    .get('function')
    ?.map((row) => row[0] ?? '')
    .find((id) => id.startsWith(prefix))
}

/** The row an atom names, also when ids were written without their `<unit>:` prefix. */
function locateRow(index: RunIndex, atom: Atom): RowRef | undefined {
  const direct = index.findRow(atom.relation, atom.cols)
  if (direct) return direct
  const unit = index.run.unit
  const cols = atom.cols.map((c) =>
    !index.isId(c) && index.isId(`${unit}:${c}`) ? `${unit}:${c}` : c,
  )
  return index.findRow(atom.relation, cols)
}

/** Character range of lines `from`..`to` (1-based, inclusive). */
function lineSpan(source: string, from: number, to: number): Range | undefined {
  let start = 0
  for (let l = 1; l < from; l++) {
    const nl = source.indexOf('\n', start)
    if (nl < 0) return undefined
    start = nl + 1
  }
  let end = start
  for (let l = from; l <= to; l++) {
    const nl = source.indexOf('\n', end)
    if (nl < 0) {
      end = source.length
      break
    }
    end = l === to ? nl : nl + 1
  }
  return { start, end }
}
