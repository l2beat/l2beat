import { useEffect, useState } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { cn } from '~/utils/cn'
import type { MessageStatsRow } from '../types'
import { messageStatsColumns } from './columns'
import { MessagePairsTable } from './MessagePairsTable'

function getMessageRowId(row: MessageStatsRow) {
  return `${row.plugin}:${row.type}`
}

interface MessagesTableProps {
  data: MessageStatsRow[]
  enableCsvExport?: boolean
  enablePairsCsvExport?: boolean
}

export function MessagesTable({
  data,
  enableCsvExport = false,
  enablePairsCsvExport = false,
}: MessagesTableProps) {
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
    columns: messageStatsColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: getMessageRowId,
    searchPlaceholder: 'Search message plugins and types',
  })

  useEffect(() => {
    const firstRow = data.at(0)

    if (firstRow === undefined) {
      setSelectedRowId(undefined)
      return
    }

    if (selectedRowId === undefined) {
      setSelectedRowId(getMessageRowId(firstRow))
      return
    }

    const exists = data.some((row) => getMessageRowId(row) === selectedRowId)
    if (!exists) {
      setSelectedRowId(getMessageRowId(firstRow))
    }
  }, [data, selectedRowId])

  const selectedRow = selectedRowId
    ? data.find((row) => getMessageRowId(row) === selectedRowId)
    : undefined

  return (
    <>
      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No message stats found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-message-stats-${new Date().toISOString()}.csv`
        }
        onRowClick={(row) => setSelectedRowId(getMessageRowId(row.original))}
        getRowDataState={(row) =>
          selectedRowId === getMessageRowId(row.original)
            ? 'selected'
            : undefined
        }
        rowClassName={(row) => {
          const isSelected = selectedRowId === getMessageRowId(row.original)

          return cn(
            'odd:bg-muted/20 hover:bg-muted/70',
            isSelected && '!bg-blue-200',
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
              Click a pair row to open detailed messages for that route.
            </p>
          </div>
          <MessagePairsTable
            data={selectedRow.chains}
            plugin={selectedRow.plugin}
            type={selectedRow.type}
            enableCsvExport={enablePairsCsvExport}
          />
        </div>
      ) : null}
    </>
  )
}
