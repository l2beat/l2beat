import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/Pagination'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropTokenRelationsGraph } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { ProjectSection } from '../../ProjectSection'
import type { ProjectSectionProps } from '../../types'
import {
  type DeploymentRow,
  interopTokenOnchainDeploymentsColumns,
} from './columns'
import { TokenRelationsGraphView } from './relations-graph/TokenRelationsGraphView'

const DEPLOYMENTS_PER_PAGE = 8

export interface InteropTokenOnchainDeploymentsRow {
  chain: {
    name: string
    iconUrl: string | undefined
  }
  address: string
  explorerUrl: string | undefined
  symbol: string
  minters: ProjectIconListItem[]
  isSupported: boolean
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export interface InteropTokenOnchainDeploymentsSectionProps
  extends ProjectSectionProps {
  deployments: InteropTokenOnchainDeploymentsRow[]
  /** Absent when no relation between the deployments has been observed. */
  relationsGraph?: InteropTokenRelationsGraph
}

export function InteropTokenOnchainDeploymentsSection({
  deployments,
  relationsGraph,
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
      {relationsGraph && (
        <>
          <TokenRelationsGraphView graph={relationsGraph} />
          <HorizontalSeparator className="my-4" />
        </>
      )}
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
