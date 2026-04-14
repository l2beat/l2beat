import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  deleteMonitorRow,
  getMonitorRow,
  type MonitorMutationResult,
  type MonitorRowDetail,
  stripMonitorFields,
} from '../../../../api/api'

export function RowDetailPanel(props: { rowId: number; onClose: () => void }) {
  const { rowId, onClose } = props
  const queryClient = useQueryClient()

  const detailQuery = useQuery({
    queryKey: ['monitor', 'row', rowId],
    queryFn: () => getMonitorRow(rowId),
  })

  // selection key: `${address}|${key}`
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [addToIgnoreWatchMode, setAddToIgnoreWatchMode] = useState(false)
  const [lastResult, setLastResult] = useState<MonitorMutationResult | null>(
    null,
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const stripMutation = useMutation({
    mutationFn: () => {
      const fields = [...selected].map((s) => {
        const [address, ...keyParts] = s.split('|')
        return { address: address ?? '', key: keyParts.join('|') }
      })
      return stripMonitorFields(rowId, fields, { addToIgnoreWatchMode })
    },
    onSuccess: (data) => {
      setLastResult(data)
      setErrorMsg(null)
      setSelected(new Set())
      queryClient.invalidateQueries({ queryKey: ['monitor', 'rows'] })
      queryClient.invalidateQueries({ queryKey: ['monitor', 'row', rowId] })
    },
    onError: (e) => {
      setErrorMsg(e instanceof Error ? e.message : String(e))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteMonitorRow(rowId, { addToIgnoreWatchMode }),
    onSuccess: (data) => {
      setLastResult(data)
      setErrorMsg(null)
      queryClient.invalidateQueries({ queryKey: ['monitor', 'rows'] })
      // Row is gone — close the panel
      onClose()
    },
    onError: (e) => {
      setErrorMsg(e instanceof Error ? e.message : String(e))
    },
  })

  const totalFields = useMemo(() => {
    if (!detailQuery.data) return 0
    return detailQuery.data.contracts.reduce(
      (sum, c) => sum + c.fields.length,
      0,
    )
  }, [detailQuery.data])

  function toggleField(address: string, key: string) {
    const id = `${address}|${key}`
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  function toggleContract(detail: MonitorRowDetail, address: string) {
    const contract = detail.contracts.find((c) => c.address === address)
    if (!contract) return
    const ids = contract.fields.map((f) => `${address}|${f.key}`)
    const allSelected = ids.every((i) => selected.has(i))
    const next = new Set(selected)
    if (allSelected) {
      ids.forEach((i) => next.delete(i))
    } else {
      ids.forEach((i) => next.add(i))
    }
    setSelected(next)
  }

  function selectAll(detail: MonitorRowDetail) {
    const next = new Set<string>()
    for (const c of detail.contracts) {
      for (const f of c.fields) {
        next.add(`${c.address}|${f.key}`)
      }
    }
    setSelected(next)
  }

  if (detailQuery.isPending) {
    return <div className="p-4 text-coffee-400">Loading row…</div>
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <div className="p-4 text-red-400">Failed to load row</div>
  }

  const detail = detailQuery.data
  const isMutating = stripMutation.isPending || deleteMutation.isPending

  return (
    <div className="border-coffee-700 border-t p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-coffee-300 text-sm">
          <span className="font-semibold">Row {detail.id}</span>{' '}
          <span className="text-coffee-400">({detail.projectId})</span>
          {' · '}
          <span className="text-coffee-400">
            {detail.contracts.length} contract
            {detail.contracts.length !== 1 ? 's' : ''} · {totalFields} field
            {totalFields !== 1 ? 's' : ''} · selected {selected.size}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="border border-coffee-600 px-3 py-1 text-coffee-300 text-xs hover:cursor-pointer hover:bg-coffee-600"
            onClick={() => selectAll(detail)}
            disabled={isMutating}
          >
            Select all
          </button>
          <button
            className="border border-coffee-600 px-3 py-1 text-coffee-300 text-xs hover:cursor-pointer hover:bg-coffee-600"
            onClick={() => setSelected(new Set())}
            disabled={isMutating}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-h-[480px] overflow-auto border border-coffee-700">
        {detail.contracts.map((contract) => {
          const ids = contract.fields.map((f) => `${contract.address}|${f.key}`)
          const allSelected =
            ids.length > 0 && ids.every((i) => selected.has(i))
          return (
            <div
              key={contract.address}
              className="border-coffee-700 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2 bg-coffee-800 px-3 py-2">
                {contract.fields.length > 0 && (
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleContract(detail, contract.address)}
                    disabled={isMutating}
                  />
                )}
                <span className="font-semibold text-sm">
                  {contract.name ?? '(unnamed)'}
                </span>
                <span className="text-coffee-400 text-xs">
                  {contract.address}
                </span>
                {contract.type && (
                  <span className="rounded bg-coffee-700 px-2 py-0.5 text-xs">
                    {contract.type}
                  </span>
                )}
                <span className="ml-auto text-coffee-400 text-xs">
                  {contract.fields.length} field
                  {contract.fields.length !== 1 ? 's' : ''}
                </span>
              </div>
              {contract.fields.map((field) => {
                const id = `${contract.address}|${field.key}`
                const isSelected = selected.has(id)
                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 border-coffee-800 border-t px-3 py-1 text-xs ${
                      isSelected ? 'bg-coffee-800/50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(contract.address, field.key)}
                      disabled={isMutating}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-coffee-200">
                        {field.key}
                      </div>
                      <div className="mt-0.5 grid grid-cols-2 gap-2 text-coffee-400">
                        <div className="truncate">
                          <span className="text-coffee-500">before: </span>
                          {truncate(field.before)}
                        </div>
                        <div className="truncate">
                          <span className="text-coffee-500">after: </span>
                          {truncate(field.after)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={addToIgnoreWatchMode}
            onChange={(e) => setAddToIgnoreWatchMode(e.target.checked)}
            disabled={isMutating}
          />
          Also add to <code>ignoreInWatchMode</code>
        </label>
        <div className="flex gap-2">
          <button
            className="border border-red-700 bg-red-900/40 px-4 py-2 text-red-200 text-sm transition-colors hover:cursor-pointer hover:bg-red-800/60 disabled:opacity-50"
            onClick={() => {
              if (
                window.confirm(
                  `Delete row ${detail.id} entirely? This will drop ${totalFields} fields from activity.json and recompile the review.`,
                )
              ) {
                deleteMutation.mutate()
              }
            }}
            disabled={isMutating}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete whole row'}
          </button>
          <button
            className="border border-coffee-600 bg-coffee-700 px-4 py-2 text-sm transition-colors hover:cursor-pointer hover:bg-coffee-600 disabled:opacity-50"
            onClick={() => stripMutation.mutate()}
            disabled={isMutating || selected.size === 0}
          >
            {stripMutation.isPending
              ? 'Stripping…'
              : `Strip ${selected.size} field${selected.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 border border-red-700 bg-red-900/30 p-2 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      {lastResult && (
        <div className="mt-3 border border-green-700 bg-green-900/20 p-2 text-green-300 text-xs">
          {lastResult.rowDeleted && 'Row deleted. '}
          {lastResult.rowUpdated && 'Row updated. '}
          Dropped {lastResult.activityDropped} activity field change
          {lastResult.activityDropped !== 1 ? 's' : ''}.
          {lastResult.ignoreFieldsAdded > 0 &&
            ` Added ${lastResult.ignoreFieldsAdded} field${
              lastResult.ignoreFieldsAdded !== 1 ? 's' : ''
            } to ignoreInWatchMode across ${lastResult.configContractsUpdated} contract${
              lastResult.configContractsUpdated !== 1 ? 's' : ''
            }.`}{' '}
          Recompile: {lastResult.recompile?.status ?? 'n/a'}
          {lastResult.recompile?.status === 'error' &&
            ` — ${lastResult.recompile.error}`}
        </div>
      )}
    </div>
  )
}

function truncate(s: string | undefined): string {
  if (s === undefined) return '∅'
  if (s.length <= 80) return s
  return `${s.slice(0, 80)}…`
}
