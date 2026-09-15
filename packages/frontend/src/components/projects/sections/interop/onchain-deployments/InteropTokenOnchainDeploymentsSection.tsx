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
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropTokenRelationsGraph } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { ProjectSection } from '../../ProjectSection'
import type { ProjectSectionProps } from '../../types'
import {
  type DeploymentRow,
  interopTokenOnchainDeploymentsColumns,
} from './columns'
import { hasTokenRelations } from './relations-graph/graphSelectors'
import { TokenRelationsGraphView } from './relations-graph/TokenRelationsGraphView'

const DEPLOYMENTS_PER_PAGE = 8

export interface InteropTokenOnchainDeploymentsSectionProps
  extends ProjectSectionProps {
  graph: InteropTokenRelationsGraph
}

export function InteropTokenOnchainDeploymentsSection({
  graph,
  ...sectionProps
}: InteropTokenOnchainDeploymentsSectionProps) {
  const deployments = useMemo(
    () => graph.nodes.flatMap((node) => node.deployments),
    [graph],
  )
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
      {hasTokenRelations(graph) && (
        <>
          <TokenRelationsGraphView graph={graph} />
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
