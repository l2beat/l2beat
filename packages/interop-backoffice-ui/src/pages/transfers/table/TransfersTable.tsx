import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { cn } from '~/utils/cn'
import type { TransferStatsRow } from '../types'
import { buildTransferDetailsPath } from '../utils'
import { transferStatsColumns } from './columns'
import { TransferPairsTable } from './TransferPairsTable'

function getTransferRowId(row: TransferStatsRow) {
  return `${row.plugin}:${row.type}`
}

interface TransfersTableProps {
  data: TransferStatsRow[]
  enableCsvExport?: boolean
  enablePairsCsvExport?: boolean
}

export function TransfersTable({
  data,
  enableCsvExport = false,
  enablePairsCsvExport = false,
}: TransfersTableProps) {
  const navigate = useNavigate()
  const [selectedRowId, setSelectedRowId] = useState<string>()

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
    data,
    columns: transferStatsColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: getTransferRowId,
    searchPlaceholder: 'Search transfer plugins and types',
  })

  useEffect(() => {
    const firstRow = data.at(0)

    if (firstRow === undefined) {
      setSelectedRowId(undefined)
      return
    }

    if (selectedRowId === undefined) {
      setSelectedRowId(getTransferRowId(firstRow))
      return
    }

    const exists = data.some((row) => getTransferRowId(row) === selectedRowId)
    if (!exists) {
      setSelectedRowId(getTransferRowId(firstRow))
    }
  }, [data, selectedRowId])

  const selectedRow = selectedRowId
    ? data.find((row) => getTransferRowId(row) === selectedRowId)
    : undefined

  return (
    <>
      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No transfer stats found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-transfer-stats-${new Date().toISOString()}.csv`
        }
        onRowClick={(row) => setSelectedRowId(getTransferRowId(row.original))}
        getRowDataState={(row) =>
          selectedRowId === getTransferRowId(row.original)
            ? 'selected'
            : undefined
        }
        rowClassName={(row) => {
          const isSelected = selectedRowId === getTransferRowId(row.original)

          return cn(
            'odd:bg-muted/20 hover:bg-muted/70',
            isSelected && 'bg-primary/10 hover:bg-primary/20',
          )
        }}
        totalRowsCount={totalRowsCount}
        filteredRowsCount={filteredRowsCount}
        searchValue={isSearchEnabled ? searchValue : undefined}
        onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
        searchPlaceholder={searchPlaceholder}
        isSearchPending={isSearchPending}
      />

      {selectedRow ? (
        <div className="border-t">
          <div className="px-6 py-4">
            <h3 className="font-medium text-sm">
              Chain pairs for {selectedRow.plugin} / {selectedRow.type}
            </h3>
            <p className="text-muted-foreground text-xs">
              {selectedRow.chains.length} pairs available.
            </p>
            <p className="text-muted-foreground text-xs">
              Click a pair row to open detailed transfers for that route.
            </p>
          </div>
          <TransferPairsTable
            data={selectedRow.chains}
            enableCsvExport={enablePairsCsvExport}
            onPairClick={(pair) => {
              navigate(
                buildTransferDetailsPath({
                  type: selectedRow.type,
                  plugin: selectedRow.plugin,
                  srcChain: pair.srcChain,
                  dstChain: pair.dstChain,
                }),
              )
            }}
          />
        </div>
      ) : null}
    </>
  )
}
