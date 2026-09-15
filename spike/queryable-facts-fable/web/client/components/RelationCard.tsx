import { useEffect, useMemo, useState } from 'react'
import type { RelationView, RowsResult } from '../../shared/types'

const STRENGTH_HINT: Record<string, string> = {
  exact:
    'exact: restates what the compiler resolved, or follows from it by definition',
  over: 'over-approximation: may list too much, never too little',
  pattern: 'recognised pattern: a common idiom, not a proof',
}

/** Formats a tuple the way Soufflé's explain shell expects it. */
function atomOf(rel: RelationView, cols: string[]): string {
  return `${rel.name}(${cols
    .map((v, i) =>
      rel.columns[i]?.type === 'number' || rel.columns[i]?.type === 'unsigned'
        ? v
        : JSON.stringify(v),
    )
    .join(', ')})`
}

/**
 * One relation of the current level: its declaration and comment, its strength, its row count, and
 * on demand the rows themselves with a filter, a "why?" button and a jump to the source.
 */
export function RelationCard({
  rel,
  open,
  onToggle,
  loadRows,
  onWhy,
  onLocate,
  knownIds,
}: {
  rel: RelationView
  open: boolean
  onToggle: () => void
  loadRows: (relation: string) => Promise<RowsResult>
  onWhy: (atom: string) => void
  /** Called with an id that has a source location (see the `location` relation). */
  onLocate: (id: string) => void
  knownIds: Set<string>
}) {
  const [rows, setRows] = useState<RowsResult | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [filter, setFilter] = useState('')
  useEffect(() => {
    if (!open) return
    let alive = true
    setRows(undefined)
    loadRows(rel.name)
      .then((r) => alive && setRows(r))
      .catch(
        (e: unknown) =>
          alive && setError(e instanceof Error ? e.message : String(e)),
      )
    return () => {
      alive = false
    }
  }, [open, rel.name, loadRows])
  const shown = useMemo(() => {
    if (!rows) return []
    const words = filter.toLowerCase().split(/\s+/).filter(Boolean)
    return rows.rows
      .filter((r) => {
        const line = r.join('\t').toLowerCase()
        return words.every((w) => line.includes(w))
      })
      .slice(0, 500)
  }, [rows, filter])
  const decl = `${rel.name}(${rel.columns.map((c) => `${c.name}: ${c.type}`).join(', ')})`
  return (
    <div className={`card ${open ? 'open' : ''}`} data-card={rel.name}>
      <button type="button" className="card-head" onClick={onToggle}>
        <span className="fold">{open ? '▾' : '▸'}</span>
        <code className="decl">{decl}</code>
        <span className="grow" />
        {rel.strength && (
          <span
            className={`tag ${rel.strength}`}
            title={STRENGTH_HINT[rel.strength] ?? rel.strength}
          >
            {rel.strength}
          </span>
        )}
        {rel.isInput && <span className="tag fact">fact</span>}
        <span className="count">
          {rel.rows >= 0 ? `${rel.rows} row${rel.rows === 1 ? '' : 's'}` : ''}
        </span>
      </button>
      {open && (
        <div className="card-body">
          {rel.comment && (
            <pre className="comment">
              {rel.comment.replace(/^strength:.*$/m, '').trim()}
            </pre>
          )}
          <div className="row small">
            <input
              value={filter}
              placeholder="filter rows: words that must appear"
              onChange={(e) => setFilter(e.target.value)}
            />
            {rows && (
              <span className="muted">
                {shown.length < rows.total
                  ? `${shown.length} of ${rows.total}`
                  : `${rows.total}`}{' '}
                rows
              </span>
            )}
          </div>
          {error && <div className="err">{error}</div>}
          {rows && rows.total === 0 && (
            <div className="muted small">no rows</div>
          )}
          {rows && shown.length > 0 && (
            <table className="rows">
              <thead>
                <tr>
                  {rel.columns.map((c) => (
                    <th key={c.name}>{c.name}</th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={`${i}-${r.join('|')}`}>
                    {r.map((v, j) => (
                      <td key={`${j}-${v}`}>
                        {knownIds.has(v) ? (
                          <button
                            type="button"
                            className="id link"
                            title="show in the source"
                            onClick={() => onLocate(v)}
                          >
                            {v}
                          </button>
                        ) : (
                          <span className="val">{v}</span>
                        )}
                      </td>
                    ))}
                    <td className="why">
                      {!rel.isInput && (
                        <button
                          type="button"
                          className="btn tiny"
                          onClick={() => onWhy(atomOf(rel, r))}
                        >
                          why?
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
