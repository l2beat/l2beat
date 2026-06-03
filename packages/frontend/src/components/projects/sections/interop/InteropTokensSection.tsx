import type { ProjectId } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
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
import { useTRPC } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

const TOKENS_PER_PAGE = 6
const ALL_TOKENS_LIMIT = 10_000

export interface InteropTokensSectionProps extends ProjectSectionProps {
  /** A single protocol, or `protocolIds` for a selection. */
  projectId?: ProjectId
  protocolIds?: string[]
  apiSelection: InteropSelection
}

export function InteropTokensSection({
  projectId,
  protocolIds,
  apiSelection,
  ...sectionProps
}: InteropTokensSectionProps) {
  const trpc = useTRPC()
  const { data: tokensData, isLoading: isTokensLoading } = useQuery(
    trpc.interop.tokens.queryOptions(
      {
        ...apiSelection,
        id: projectId,
        protocolIds,
        limit: ALL_TOKENS_LIMIT,
      },
      {
        enabled:
          apiSelection.from.length > 0 &&
          apiSelection.to.length > 0 &&
          (!!projectId || (protocolIds?.length ?? 0) > 0),
      },
    ),
  )

  const columns = useMemo(
    () =>
      getTopTokensColumns({
        showFlowsColumn: false,
        selectedChains: apiSelection,
      }),
    [apiSelection],
  )

  const tableData = useMemo(() => tokensData?.items ?? [], [tokensData])

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
    <ProjectSection {...sectionProps}>
      <BasicTable
        skeletonCount={TOKENS_PER_PAGE}
        table={table}
        tableWrapperClassName="pb-0"
        isLoading={isTokensLoading}
      />
      {!isTokensLoading && pageCount > 1 && (
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
    </ProjectSection>
  )
}
