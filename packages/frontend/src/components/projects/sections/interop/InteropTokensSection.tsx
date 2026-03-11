import type { ProjectId } from '@l2beat/shared-pure'
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
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import {
  getTopItemsColumns,
  type TopItemRow,
} from '~/pages/interop/components/top-items/columns'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

const TOKENS_PER_PAGE = 6

export interface InteropTokensSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

export function InteropTokensSection({
  projectId,
  ...sectionProps
}: InteropTokensSectionProps) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data: protocolData, isLoading: isProtocolLoading } =
    api.interop.protocol.useQuery({
      ...selectionForApi,
      id: projectId,
    })

  const resolvedType =
    protocolData?.entry?.bridgeTypes?.length === 1
      ? protocolData.entry.bridgeTypes[0]
      : undefined

  const { data, isLoading: isTokensLoading } = api.interop.tokens.useQuery(
    {
      ...selectionForApi,
      id: projectId,
      type: resolvedType,
    },
    {
      enabled: protocolData !== undefined,
    },
  )

  const tableData = useMemo(
    () =>
      data?.map((token) => ({
        ...token,
        displayName: token.symbol,
      })) ?? [],
    [data],
  )

  const columns = useMemo(() => getTopItemsColumns('tokens'), [])
  const isLoading = isProtocolLoading || isTokensLoading

  const table = useTable<TopItemRow>({
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
      <BetweenChainsInfo className="mb-3" />
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
    </ProjectSection>
  )
}
