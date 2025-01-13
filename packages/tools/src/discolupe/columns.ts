import { ReactElement } from 'react'
import { DiscoLupeProject } from './data'
import { ProjectName } from './ProjectName'
import { divContainer } from './DiscoLupe'
import { formatCurrencyExactValue } from './utils'

export interface LupeColumn {
  header: string
  id: string
  fn: (project: DiscoLupeProject) => string
  displayFn: (project: DiscoLupeProject, str: string) => ReactElement
  align: 'right' | 'left'
}

export const AVAILABLE_COLUMNS: LupeColumn[] = [
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
    displayFn: divContainer,
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
    displayFn: divContainer,
  },
  {
    header: 'Permissions',
    id: 'td',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven ? '✅' : '❌',
    displayFn: divContainer,
  },
  {
    header: 'Smart contracts',
    id: 'i9',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.areContractsDiscoveryDriven ? '✅' : '❌',
    displayFn: divContainer,
  },
  {
    header: 'Milestones & Incidents',
    id: 'vl',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.milestones && project.milestones.length > 0 ? '✅' : '❌',
    displayFn: divContainer,
  },
]
