import { ReactElement } from 'react'
import { DivContainer } from './DivContainer'
import { ProjectName } from './ProjectName'
import { DiscoLupeProject } from './data'
import { formatCurrencyExactValue } from './utils'

export type ColumnId = (typeof AVAILABLE_COLUMNS_RAW)[number]['id']

export interface LupeColumn {
  header: string
  id: ColumnId
  fn: (project: DiscoLupeProject) => string
  displayFn: (project: DiscoLupeProject, str: string) => ReactElement
  align: 'right' | 'left'
}

const AVAILABLE_COLUMNS_RAW = [
  {
    header: 'Name',
    align: 'left',
    id: 'qx',
    fn: (project: DiscoLupeProject) => project.display.name,
    displayFn: (project: DiscoLupeProject, str: string) =>
      ProjectName(project, str),
  },
  {
    header: 'TVL',
    id: 'ig',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      formatCurrencyExactValue(project.tvl, 'usd'),
    displayFn: DivContainer,
  },
  {
    header: 'Discovery driven',
    id: 'm5',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven &&
      project.areContractsDiscoveryDriven
        ? '✅'
        : '❌',
    displayFn: DivContainer,
  },
  {
    header: 'Permissions',
    id: 'td',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven ? '✅' : '❌',
    displayFn: DivContainer,
  },
  {
    header: 'Smart contracts',
    id: 'i9',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.areContractsDiscoveryDriven ? '✅' : '❌',
    displayFn: DivContainer,
  },
  {
    header: 'Milestones & Incidents',
    id: 'vl',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.milestones && project.milestones.length > 0 ? '✅' : '❌',
    displayFn: DivContainer,
  },
] as const

export const AVAILABLE_COLUMNS =
  AVAILABLE_COLUMNS_RAW as unknown as LupeColumn[]
