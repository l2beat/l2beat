import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/core/Button'
import { Checkbox } from '~/components/core/Checkbox'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { MissingTokenRow } from '../types'
import { getMissingTokenRowId } from '../utils'
import {
  createMissingTokensColumns,
  getMissingTokensSelectionId,
} from './columns'

const CLICKED_ACTIONS_STORAGE_KEY = 'interop-missing-tokens-clicked-actions'

interface MissingTokensTableProps {
  data: MissingTokenRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
  isRequeuePending?: boolean
  onRequeue: (
    tokens: { chain: string; tokenAddress: string }[],
  ) => Promise<boolean>
}

export function MissingTokensTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
  isRequeuePending = false,
  onRequeue,
}: MissingTokensTableProps) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [clickedActionIds, setClickedActionIds] = useState<string[]>([])
  const [hideUnsupported, setHideUnsupported] = useState(false)

  const selectableRowIds = useMemo(
    () =>
      new Set(
        data
          .filter((row) => row.tokenDbStatus !== 'unsupported')
          .map(getMissingTokensSelectionId),
      ),
    [data],
  )
  const currentRowIds = useMemo(
    () => new Set(data.map((row) => getMissingTokenRowId(row))),
    [data],
  )
  const unsupportedRowsCount = useMemo(
    () => data.filter((row) => row.tokenDbStatus === 'unsupported').length,
    [data],
  )
  const visibleData = useMemo(
    () =>
      hideUnsupported
        ? data.filter((row) => row.tokenDbStatus !== 'unsupported')
        : data,
    [data, hideUnsupported],
  )

  useEffect(() => {
    setSelectedRowIds((current) =>
      current.filter((rowId) => selectableRowIds.has(rowId)),
    )
  }, [selectableRowIds])

  useEffect(() => {
    const storedIds = readClickedActionIds()
    const nextIds = storedIds.filter((rowId) => currentRowIds.has(rowId))

    setClickedActionIds(nextIds)

    if (nextIds.length !== storedIds.length) {
      writeClickedActionIds(nextIds)
    }
  }, [currentRowIds])

  const columns = useMemo(
    () =>
      createMissingTokensColumns({
        getExplorerUrl,
        isRowSelected: (row) =>
          selectedRowIds.includes(getMissingTokensSelectionId(row)),
        isRowSelectable: (row) => row.tokenDbStatus !== 'unsupported',
        setRowsSelected: (rows, selected) => {
          setSelectedRowIds((current) => {
            const next = new Set(current)

            for (const row of rows) {
              const rowId = getMissingTokensSelectionId(row)

              if (!selectableRowIds.has(rowId)) {
                continue
              }

              if (selected) {
                next.add(rowId)
              } else {
                next.delete(rowId)
              }
            }

            return Array.from(next)
          })
        },
        toggleRowSelected: (row, selected) => {
          const rowId = getMissingTokensSelectionId(row)

          if (!selectableRowIds.has(rowId)) {
            return
          }

          setSelectedRowIds((current) => {
            const next = new Set(current)
            if (selected) {
              next.add(rowId)
            } else {
              next.delete(rowId)
            }
            return Array.from(next)
          })
        },
        isActionVisited: (row) =>
          clickedActionIds.includes(getMissingTokensSelectionId(row)),
        onActionVisited: (row) => {
          const rowId = getMissingTokensSelectionId(row)

          setClickedActionIds((current) => {
            if (current.includes(rowId)) {
              return current
            }

            const next = [...current, rowId]
            writeClickedActionIds(next)
            return next
          })
        },
      }),
    [clickedActionIds, getExplorerUrl, selectableRowIds, selectedRowIds],
  )

  const {
    filteredRowsCount,
    isSearchEnabled,
    isSearchPending,
    pageSizeOption,
    searchPlaceholder,
    searchValue,
    setPageSizeOption,
    setSearchValue,
    table,
    totalRowsCount,
  } = useTanStackTable({
    data: visibleData,
    columns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: getMissingTokensSelectionId,
    searchPlaceholder: 'Search chains, addresses, plugins, and status',
  })

  const selectedRows = useMemo(
    () =>
      data.filter((row) =>
        selectedRowIds.includes(getMissingTokensSelectionId(row)),
      ),
    [data, selectedRowIds],
  )
  const selectedReadyCount = selectedRows.filter(
    (row) => row.tokenDbStatus === 'ready',
  ).length

  return (
    <>
      <div className="flex flex-col gap-3 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span className="text-muted-foreground text-sm">
            {selectedRows.length === 0
              ? 'Select rows to requeue matching transfers.'
              : `${selectedRows.length} selected, ${selectedReadyCount} ready to requeue`}
          </span>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={hideUnsupported}
              disabled={unsupportedRowsCount === 0}
              onCheckedChange={(checked) =>
                setHideUnsupported(checked === true)
              }
            />
            <span>Hide unsupported ({unsupportedRowsCount})</span>
          </label>
        </div>

        <Button
          size="sm"
          onClick={async () => {
            const didRequeue = await onRequeue(
              selectedRows.map((row) => ({
                chain: row.chain,
                tokenAddress: row.tokenAddress,
              })),
            )

            if (didRequeue) {
              setSelectedRowIds([])
            }
          }}
          disabled={selectedRows.length === 0 || isRequeuePending}
        >
          {isRequeuePending ? 'Requeueing...' : 'Requeue selected'}
        </Button>
      </div>

      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage={
          hideUnsupported && unsupportedRowsCount > 0
            ? 'No supported missing tokens found. Disable "Hide unsupported" to review unsupported rows.'
            : 'No missing tokens found.'
        }
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-missing-tokens-${new Date().toISOString()}.csv`
        }
        rowClassName={(row) =>
          row.original.tokenDbStatus === 'unsupported'
            ? 'opacity-60'
            : undefined
        }
        totalRowsCount={totalRowsCount}
        filteredRowsCount={filteredRowsCount}
        searchValue={isSearchEnabled ? searchValue : undefined}
        onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
        searchPlaceholder={searchPlaceholder}
        isSearchPending={isSearchPending}
      />
    </>
  )
}

function readClickedActionIds() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(CLICKED_ACTIONS_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

function writeClickedActionIds(rowIds: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    CLICKED_ACTIONS_STORAGE_KEY,
    JSON.stringify(rowIds),
  )
}
