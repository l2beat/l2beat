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
  const { index, nav, setNav, showRange, project } = useRun()
  const unit = index.run.unit

  // In a project run: a project relation's atom opens its row in step 8; an id of another unit opens that unit.
  if (project) {
    const atom = parseAtom(text)
    const projectRows = atom
      ? (project.result.derived.find((d) => d.relation === atom.relation) ??
        project.result.discovery.find((d) => d.relation === atom.relation))
      : undefined
    if (atom && projectRows) {
      const key = atom.cols.join('\t')
      const found = projectRows.rows.some((r) => r.join('\t') === key)
      const columns =
        project.result.program.relations.find((r) => r.name === atom.relation)
          ?.columns ?? []
      if (!found)
        return (
          <code
            className="cite unknown"
            title={`${atom.relation} is a project relation, but this run has no such row`}
          >
            {text}
          </code>
        )
      return (
        <span className="cite atom">
          <button
            type="button"
            className="rn"
            title={`open this ${atom.relation} row in step 8`}
            onClick={() =>
              setNav({
                step: 8,
                projectTab: 'derived',
                projectRelation: atom.relation,
                projectRow: atom.cols,
              })
            }
          >
            {atom.relation}
          </button>
          (
          {atom.cols.map((c, i) => (
            <span key={i}>
              <ProjectCell value={c} type={columns[i]?.type} />
              {i < atom.cols.length - 1 ? ', ' : ''}
            </span>
          ))}
          )
        </span>
      )
    }
    if (!atom && !parseLineRef(text)) {
      const other = project.unitOf(text)
      if (other && other !== unit) return <ProjectCell value={text} />
      if (/^(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}$/.test(text))
        return (
          <code title={text} className="cite addr">
            {project.who(text)}
          </code>
        )
    }
  }

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

/**
 * A column of a project atom: a unit id becomes a chip that opens its unit in steps 2–7 and highlights it
 * there; an address shows discovery's name; anything else is plain.
 */
function ProjectCell({ value, type }: { value: string; type?: string }) {
  const { index, project, setNav, showId } = useRun()
  if (!project || type === 'number')
    return <span className="mono">{value}</span>
  const other = project.unitOf(value)
  if (other) {
    const slug = project.result.units.find((u) => u.unit === other)?.slug
    const here = other === index.run.unit
    if (here && index.isId(value)) return <IdChip id={value} />
    return (
      <button
        type="button"
        className="chip function"
        title={`${value} — open unit ${other}`}
        onClick={(e) => {
          e.stopPropagation()
          if (!slug) return
          project.selectUnit(slug, (idx) => {
            const range = idx.rangeOfId(value)
            setNav({
              step: 6,
              range,
              line: range ? idx.lineOf(range.start) : undefined,
            })
            if (range) showId(value)
          })
        }}
      >
        <span className="k">
          {other
            .replace(/\.sol$/, '')
            .split('/')
            .pop()}
        </span>
        <span>{value.slice(other.length + 1)}</span>
      </button>
    )
  }
  if (/^(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}$/.test(value))
    return (
      <span className="txt" title={value}>
        {project.who(value)}
      </span>
    )
  if (value === '') return <span className="muted">—</span>
  return (
    <span className="txt" title={value}>
      {value}
    </span>
  )
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
