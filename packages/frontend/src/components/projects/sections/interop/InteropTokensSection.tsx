import type { ProjectId } from '@l2beat/shared-pure'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { type ComponentProps, useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import {
  getTopItemsColumns,
  type TopItemRow,
} from '~/pages/interop/components/top-items/columns'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {paginationItems.map((item) =>
            item.type === 'ellipsis' ? (
              <span
                key={item.key}
                className="px-1 font-medium text-label-value-12 text-secondary"
              >
                ...
              </span>
            ) : (
              <PaginationButton
                key={item.index}
                onClick={() => table.setPageIndex(item.index)}
                isActive={currentPage === item.index}
              >
                {item.index + 1}
              </PaginationButton>
            ),
          )}
        </div>
      )}
    </ProjectSection>
  )
}

type PaginationItem =
  | { type: 'page'; index: number }
  | { type: 'ellipsis'; key: string }

function getPaginationItems(pageCount: number, currentPage: number) {
  const edgeCount = 3
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

function PaginationButton({
  isActive,
  children,
  className,
  ...props
}: ComponentProps<'button'> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-md border border-divider px-2',
        'font-medium text-label-value-12 transition-colors',
        'hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40',
        isActive && 'border-brand bg-brand text-white hover:bg-brand',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
