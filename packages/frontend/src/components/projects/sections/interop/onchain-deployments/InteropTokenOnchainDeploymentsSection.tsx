import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropTokenRelationsGraph } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { ProjectSection } from '../../ProjectSection'
import type { ProjectSectionProps } from '../../types'
import { TokenRelationsGraphView } from '../token-relations/TokenRelationsGraphView'
import {
  type DeploymentRow,
  interopTokenOnchainDeploymentsColumns,
} from './columns'

export interface InteropTokenOnchainDeploymentsRow {
  chain: {
    name: string
    iconUrl: string | undefined
  }
  address: string
  explorerUrl: string | undefined
  symbol: string
  /** Bridging projects observed minting this deployment. */
  minters: UsedInProjectWithIcon[]
  isSupported: boolean
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export interface InteropTokenOnchainDeploymentsSectionProps
  extends ProjectSectionProps {
  deployments: InteropTokenOnchainDeploymentsRow[]
  /** Omitted when no relation between these deployments has been observed. */
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
    initialState: {
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  return (
    <ProjectSection {...sectionProps}>
      {relationsGraph && (
        <>
          <TokenRelationsGraphView graph={relationsGraph} />
          <HorizontalSeparator className="my-4" />
        </>
      )}
      <BasicTable table={table} tableWrapperClassName="pb-0" />
    </ProjectSection>
  )
}
