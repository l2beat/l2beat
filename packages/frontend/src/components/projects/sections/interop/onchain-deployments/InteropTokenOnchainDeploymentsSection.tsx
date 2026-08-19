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
import { ProjectSection } from '../../ProjectSection'
import type { ProjectSectionProps } from '../../types'
import {
  type DeploymentRow,
  interopTokenOnchainDeploymentsColumns,
} from './columns'

const DEPLOYMENTS_PER_PAGE = 8

export interface InteropTokenOnchainDeploymentsRow {
  chain: {
    name: string
    iconUrl: string | undefined
  }
  address: string
  explorerUrl: string | undefined
  symbol: string
  isSupported: boolean
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export interface InteropTokenOnchainDeploymentsSectionProps
  extends ProjectSectionProps {
  deployments: InteropTokenOnchainDeploymentsRow[]
}

export function InteropTokenOnchainDeploymentsSection({
  deployments,
  ...sectionProps
}: InteropTokenOnchainDeploymentsSectionProps) {
  const table = useTable<DeploymentRow>({
    data: deployments,
    columns: interopTokenOnchainDeploymentsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
      pagination: {
        pageSize: DEPLOYMENTS_PER_PAGE,
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
      <BasicTable table={table} tableWrapperClassName="pb-0" />
      {pageCount > 1 && (
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
                    href="#onchain-deployments"
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
