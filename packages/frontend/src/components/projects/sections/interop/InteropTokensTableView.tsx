import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/Pagination'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import {
  getTopTokensColumns,
  type TokenRow,
} from '~/pages/interop/components/tokens/columns'
import type { InteropSelection } from '~/pages/interop/utils/types'
import type { TokenData } from '~/server/features/layer2s/interop/types'

const TOKENS_PER_PAGE = 6

export function InteropTokensTableView({
  tokens,
  isLoading,
  apiSelection,
}: {
  tokens: TokenData[] | undefined
  isLoading: boolean
  apiSelection: InteropSelection
}) {
  const columns = useMemo(
    () =>
      getTopTokensColumns({
        showFlowsColumn: false,
        selectedChains: apiSelection,
      }),
    [apiSelection],
  )

  const tableData = useMemo(() => tokens ?? [], [tokens])

  const table = useTable<TokenRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['icon'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
      pagination: {
        pageSize: TOKENS_PER_PAGE,
        pageIndex: 0,
      },
    },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

  return (
    <>
      <BasicTable
        skeletonCount={TOKENS_PER_PAGE}
        table={table}
        tableWrapperClassName="pb-0"
        isLoading={isLoading}
      />
      {!isLoading && pageCount > 1 && (
        <div className="mt-4">
          <Pagination className="min-w-full px-1">
            <PaginationContent className="justify-center">
              {paginationItems.map((item) =>
                item.type === 'ellipsis' ? (
                  <PaginationItem key={item.key}>
                    <PaginationEllipsis className="text-secondary" />
                  </PaginationItem>
                ) : (
                  <PaginationLink
                    key={item.index}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      table.setPageIndex(item.index)
                    }}
                    isActive={currentPage === item.index}
                  >
                    {item.index + 1}
                  </PaginationLink>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
