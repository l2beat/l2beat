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
    header: 'Is Live',
    id: 'zz',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      !project.isUpcoming && !project.isArchived ? '✅' : '❌',
    displayFn: DivContainer,
  },
  {
    header: 'Is Under Review',
    id: 'zk',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isUnderReview ? '✅' : '❌'),
    displayFn: DivContainer,
  },
  {
    header: 'Is Upcoming',
    id: 'mk',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isUpcoming ? '✅' : '❌'),
    displayFn: DivContainer,
  },
  {
    header: 'Is Archived',
    id: 'lz',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isArchived ? '✅' : '❌'),
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
    header: 'Permissions are discovery driven',
    id: 'td',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven ? '✅' : '❌',
    displayFn: DivContainer,
  },
  {
    header: 'Smart contracts are discovery driven',
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

export const DEFAULT_COLUMN_IDS: ColumnId[] = ['qx', 'ig', 'zz', 'm5']

export const AVAILABLE_COLUMNS =
  AVAILABLE_COLUMNS_RAW as unknown as LupeColumn[]
