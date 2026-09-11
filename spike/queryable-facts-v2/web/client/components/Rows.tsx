import { useEffect, useState } from 'react'
import type { Column, RowsPage } from '../../shared/types'
import { Atom } from './Atom'

/**
 * A page of tuples rendered as atoms, with a filter box and a pager. `load` fetches a page; the
 * component owns offset and filter.
 */
export function Rows({
  load,
  pageSize = 100,
  ask,
  plain,
  emptyText = 'no rows',
}: {
  load: (offset: number, filter: string, limit: number) => Promise<RowsPage>
  pageSize?: number
  ask?: string
  plain?: boolean
  emptyText?: string
}) {
  const [filter, setFilter] = useState('')
  const [applied, setApplied] = useState('')
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState<RowsPage | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let alive = true
    setLoading(true)
    load(offset, applied, pageSize)
      .then((p) => {
        if (alive) {
          setPage(p)
          setError(undefined)
        }
      })
      .catch(
        (e: unknown) =>
          alive && setError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [load, offset, applied, pageSize])
  const total = page?.total ?? 0
  return (
    <div className="rows">
      <div className="row small rows-bar">
        <input
          value={filter}
          placeholder="filter: words that must appear in a row"
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setOffset(0)
              setApplied(filter)
            }
          }}
        />
        <button
          type="button"
          className="btn small"
          onClick={() => {
            setOffset(0)
            setApplied(filter)
          }}
        >
          filter
        </button>
        <span className="muted">
          {loading
            ? 'loading…'
            : `${total} row${total === 1 ? '' : 's'}${applied ? ` matching "${applied}"` : ''}`}
        </span>
        {total > pageSize && (
          <span className="pager">
            <button
              type="button"
              className="btn small"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - pageSize))}
            >
              ‹
            </button>
            {offset + 1}–{Math.min(total, offset + pageSize)}
            <button
              type="button"
              className="btn small"
              disabled={offset + pageSize >= total}
              onClick={() => setOffset(offset + pageSize)}
            >
              ›
            </button>
          </span>
        )}
      </div>
      {error && <div className="err">{error}</div>}
      {page && page.rows.length === 0 && !loading && (
        <div className="muted small">{emptyText}</div>
      )}
      {page && (
        <div className="atoms">
          {page.rows.map((r, i) => (
            <div className="atom-line" key={`${offset}-${i}`}>
              <Atom
                relation={page.relation}
                cols={r}
                columns={page.columns as Column[]}
                ask={ask}
                plain={plain}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
