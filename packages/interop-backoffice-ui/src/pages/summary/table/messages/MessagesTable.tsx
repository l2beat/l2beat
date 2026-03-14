import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { cn } from '~/utils/cn'
import { buildMessageDetailsPath } from '../messages-details/utils'
import type { SummaryMessageRow } from '../types'
import { messagesColumns } from './columns'
import { MessagePairsTable } from './MessagePairsTable'

function getMessageRowId(row: SummaryMessageRow) {
  return `${row.plugin}:${row.type}`
}

interface MessagesTableProps {
  data: SummaryMessageRow[]
  enableCsvExport?: boolean
  enablePairsCsvExport?: boolean
}

export function MessagesTable({
  data,
  enableCsvExport = false,
  enablePairsCsvExport = false,
}: MessagesTableProps) {
  const navigate = useNavigate()
  const [selectedRowId, setSelectedRowId] = useState<string>()

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: messagesColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: getMessageRowId,
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

  const selectedRow = useMemo(() => {
    if (!selectedRowId) {
      return undefined
    }

    return data.find((row) => getMessageRowId(row) === selectedRowId)
  }, [data, selectedRowId])

  return (
    <>
      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No message stats found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-messages-${new Date().toISOString()}.csv`
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
              Click a pair row to open detailed messages for that route.
            </p>
          </div>
          <MessagePairsTable
            data={selectedRow.chains}
            enableCsvExport={enablePairsCsvExport}
            onPairClick={(pair) => {
              navigate(
                buildMessageDetailsPath({
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
