import { v } from '@l2beat/validate'
import type { RowSelectionState } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '~/components/core/Button'
import { Checkbox } from '~/components/core/Checkbox'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { useLocalStorage } from '~/hooks/useLocalStorage'
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [clickedActionIds, setClickedActionIds] = useLocalStorage(
    CLICKED_ACTIONS_STORAGE_KEY,
    [],
    v.array(v.string()),
  )
  const clickedActionIdsSetRef = useRef(new Set(clickedActionIds))
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
    setRowSelection((current) => {
      let didChange = false
      const next: RowSelectionState = {}

      for (const [rowId, isSelected] of Object.entries(current)) {
        if (isSelected && selectableRowIds.has(rowId)) {
          next[rowId] = true
        } else {
          didChange = true
        }
      }

      return didChange ? next : current
    })
  }, [selectableRowIds])

  useEffect(() => {
    clickedActionIdsSetRef.current = new Set(clickedActionIds)
  }, [clickedActionIds])

  useEffect(() => {
    const nextIds = clickedActionIds.filter((rowId) => currentRowIds.has(rowId))
    if (nextIds.length !== clickedActionIds.length) {
      setClickedActionIds(nextIds)
    }
  }, [clickedActionIds, currentRowIds, setClickedActionIds])

  const columns = useMemo(
    () =>
      createMissingTokensColumns({
        getExplorerUrl,
        isActionVisited: (row) =>
          clickedActionIdsSetRef.current.has(getMissingTokensSelectionId(row)),
        onActionVisited: (row) => {
          const rowId = getMissingTokensSelectionId(row)
          const clickedActionIdsSet = clickedActionIdsSetRef.current

          if (clickedActionIdsSet.has(rowId)) {
            return
          }

          setClickedActionIds([...clickedActionIdsSet, rowId])
        },
      }),
    [getExplorerUrl, setClickedActionIds],
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
    rowSelection,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) => row.original.tokenDbStatus !== 'unsupported',
  })

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
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
              setRowSelection({})
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
