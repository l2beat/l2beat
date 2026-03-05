import type { ProjectId } from '@l2beat/shared-pure'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
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
        <div className="mt-4 overflow-x-auto">
          <Pagination className="w-max min-w-full px-1">
            <PaginationContent className="flex-nowrap justify-center gap-1.5">
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

type PaginationItem =
  | { type: 'page'; index: number }
  | { type: 'ellipsis'; key: string }

function getPaginationItems(pageCount: number, currentPage: number) {
  const edgeCount = 2
  const siblingCount = 1

  const pages = new Set<number>()

  for (let i = 0; i < Math.min(edgeCount, pageCount); i++) {
    pages.add(i)
  }

  for (let i = Math.max(pageCount - edgeCount, 0); i < pageCount; i++) {
    pages.add(i)
  }

  for (
    let i = Math.max(currentPage - siblingCount, 0);
    i <= Math.min(currentPage + siblingCount, pageCount - 1);
    i++
  ) {
    pages.add(i)
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const items: PaginationItem[] = []

  for (const page of sortedPages) {
    const previous = items[items.length - 1]
    if (previous?.type === 'page' && page - previous.index > 1) {
      items.push({
        type: 'ellipsis',
        key: `${previous.index}-${page}`,
      })
    }

    items.push({ type: 'page', index: page })
  }

  return items
}
