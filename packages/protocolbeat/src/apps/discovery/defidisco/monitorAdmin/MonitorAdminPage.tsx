import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMonitorHealth,
  listMonitorRows,
  type MonitorRowSummary,
} from '../../../../api/api'
import { ErrorState } from '../../../../components/ErrorState'
import { Title } from '../../../../components/Title'
import { RowDetailPanel } from './RowDetailPanel'

export function MonitorAdminPage() {
  const health = useQuery({
    queryKey: ['monitor', 'health'],
    queryFn: getMonitorHealth,
  })

  const rowsQuery = useQuery({
    queryKey: ['monitor', 'rows'],
    queryFn: listMonitorRows,
    enabled: health.data?.available === true,
  })

  const [expandedId, setExpandedId] = useState<number | null>(null)

  const grouped = useMemo(() => {
    if (!rowsQuery.data) return []
    const byProject = new Map<string, MonitorRowSummary[]>()
    for (const row of rowsQuery.data.rows) {
      const list = byProject.get(row.projectId) ?? []
      list.push(row)
      byProject.set(row.projectId, list)
    }
    return [...byProject.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [rowsQuery.data])

  const totalRows = rowsQuery.data?.rows.length ?? 0
  const totalFields =
    rowsQuery.data?.rows.reduce((s, r) => s + r.fieldCount, 0) ?? 0

  return (
    <>
      <Title title="DiscoUI - Monitor Admin" />
      <div className="mx-auto max-w-screen-xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl">Monitor Admin</h1>
            <p className="text-coffee-400 text-sm">
              Browse and clean up <code>UpdateNotifier</code> rows from the DB.
            </p>
          </div>
          <Link
            to="/ui"
            className="border border-coffee-600 px-4 py-2 text-coffee-400 text-sm transition-colors duration-100 hover:cursor-pointer hover:bg-coffee-600"
          >
            ← Back to projects
          </Link>
        </div>

        {health.isPending && <p className="text-coffee-400">Checking…</p>}

        {health.data && health.data.available === false && (
          <div className="border border-coffee-600 bg-coffee-800 p-6">
            <p className="font-semibold">Monitor admin unavailable</p>
            <p className="mt-2 text-coffee-400 text-sm">
              <code>DATABASE_URL</code> is not set on the server. Restart{' '}
              <code>l2b ui</code> with the env var set to enable this page.
            </p>
          </div>
        )}

        {health.data?.available === true && health.data.readonly && (
          <div className="mb-4 border border-yellow-700 bg-yellow-900/30 p-3 text-sm text-yellow-300">
            Server is in readonly mode — mutations will fail with 403.
          </div>
        )}

        {rowsQuery.isError && <ErrorState />}

        {rowsQuery.isPending && health.data?.available && (
          <p className="text-coffee-400">Loading rows…</p>
        )}

        {rowsQuery.data && (
          <>
            <div className="mb-4 flex gap-6 border-coffee-600 border-b pb-3 text-sm">
              <div>
                <span className="text-coffee-400">Total rows: </span>
                <span className="font-semibold">{totalRows}</span>
              </div>
              <div>
                <span className="text-coffee-400">Total fields: </span>
                <span className="font-semibold">{totalFields}</span>
              </div>
              <div>
                <span className="text-coffee-400">Projects: </span>
                <span className="font-semibold">{grouped.length}</span>
              </div>
            </div>

            {grouped.map(([project, rows]) => (
              <div key={project} className="mb-6">
                <h2 className="mb-2 font-semibold text-coffee-200 text-sm uppercase">
                  {project}{' '}
                  <span className="ml-2 text-coffee-400 text-xs normal-case">
                    {rows.length} row{rows.length !== 1 ? 's' : ''}
                  </span>
                </h2>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-coffee-600 border-b text-coffee-400 text-xs uppercase">
                      <th className="py-2 pr-2 text-left">ID</th>
                      <th className="py-2 pr-2 text-left">Timestamp</th>
                      <th className="py-2 pr-2 text-right">Contracts</th>
                      <th className="py-2 pr-2 text-right">Fields</th>
                      <th className="py-2 pr-2 text-left">Top contracts</th>
                      <th className="py-2 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <RowLine
                        key={row.id}
                        row={row}
                        expanded={expandedId === row.id}
                        onToggle={() =>
                          setExpandedId(expandedId === row.id ? null : row.id)
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}

function RowLine(props: {
  row: MonitorRowSummary
  expanded: boolean
  onToggle: () => void
}) {
  const { row, expanded, onToggle } = props
  return (
    <>
      <tr
        className={`border-coffee-700 border-b hover:bg-coffee-800 ${
          expanded ? 'bg-coffee-800' : ''
        }`}
      >
        <td className="py-2 pr-2 font-mono text-xs">{row.id}</td>
        <td className="py-2 pr-2 text-coffee-300">
          {new Date(row.timestamp).toLocaleString()}
        </td>
        <td className="py-2 pr-2 text-right">{row.contractCount}</td>
        <td className="py-2 pr-2 text-right">{row.fieldCount}</td>
        <td className="py-2 pr-2 text-coffee-400 text-xs">
          {row.topContracts
            .map((c) => `${c.name} (${c.fieldCount})`)
            .join(', ')}
        </td>
        <td className="py-2 pr-2 text-right">
          <button
            className="border border-coffee-600 px-3 py-1 text-coffee-300 text-xs transition-colors duration-100 hover:cursor-pointer hover:bg-coffee-600"
            onClick={onToggle}
          >
            {expanded ? 'Collapse' : 'Inspect'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-coffee-900 p-0">
            <RowDetailPanel rowId={row.id} onClose={onToggle} />
          </td>
        </tr>
      )}
    </>
  )
}
