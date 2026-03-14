import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { cn } from '~/utils/cn'
import { buildTransferDetailsPath } from '../transfers-details/utils'
import type { SummaryTransferRow } from '../types'
import { transfersColumns } from './columns'
import { TransferPairsTable } from './TransferPairsTable'

function getTransferRowId(row: SummaryTransferRow) {
  return `${row.plugin}:${row.type}`
}

interface TransfersTableProps {
  data: SummaryTransferRow[]
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

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: transfersColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: getTransferRowId,
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

  const selectedRow = useMemo(() => {
    if (!selectedRowId) {
      return undefined
    }

    return data.find((row) => getTransferRowId(row) === selectedRowId)
  }, [data, selectedRowId])

  return (
    <>
      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No transfer stats found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-transfers-${new Date().toISOString()}.csv`
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
