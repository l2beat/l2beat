import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { ProjectSection } from '../../ProjectSection'
import type { ProjectSectionProps } from '../../types'
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
      <BasicTable table={table} tableWrapperClassName="pb-0" />
    </ProjectSection>
  )
}
