import type { ReactElement } from 'react'
import { DivContainer } from '../DivContainer'
import { IndicatorContainer } from '../IndicatorContainer'
import { ProjectName } from '../ProjectName'
import type { DiscoLupeProject } from './model'
import { formatNumber } from './utils'

export type ColumnId = (typeof AVAILABLE_COLUMNS_RAW)[number]['id']

export interface LupeColumn {
  header: string
  id: ColumnId
  fn: (project: DiscoLupeProject) => string
  displayFn: (project: DiscoLupeProject, str: string) => ReactElement
  align: 'right' | 'left'
  sortComparator?: (
    leftProject: DiscoLupeProject,
    rightProject: DiscoLupeProject,
  ) => number
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
    header: 'Type',
    id: 'ii',
    align: 'right',
    fn: (project: DiscoLupeProject) => project.type,
    displayFn: DivContainer,
  },
  {
    header: 'Provider',
    id: 'vi',
    align: 'right',
    fn: (project: DiscoLupeProject) => project.display.stack ?? 'None',
    displayFn: DivContainer,
  },
  {
    header: 'Category',
    id: 'ww',
    align: 'right',
    fn: (project: DiscoLupeProject) => project.display.category,
    displayFn: DivContainer,
  },
  {
    header: 'TVS',
    id: 'ig',
    align: 'right',
    fn: (project: DiscoLupeProject) => formatNumber(project.tvs),
    displayFn: DivContainer,
    sortComparator: (p1: DiscoLupeProject, p2: DiscoLupeProject) => {
      return p1.tvs - p2.tvs
    },
  },
  {
    header: 'Is Live',
    id: 'zz',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      !project.isUpcoming && !project.isArchived ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Is Under Review',
    id: 'zk',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isUnderReview ? 'Yes' : 'No'),
    displayFn: IndicatorContainer,
  },
  {
    header: 'Is Upcoming',
    id: 'mk',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isUpcoming ? 'Yes' : 'No'),
    displayFn: IndicatorContainer,
  },
  {
    header: 'Is Archived',
    id: 'lz',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.isArchived ? 'Yes' : 'No'),
    displayFn: IndicatorContainer,
  },
  {
    header: 'Discovery driven',
    id: 'm5',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven &&
      project.areContractsDiscoveryDriven
        ? 'Yes'
        : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Permissions are discovery driven',
    id: 'td',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Smart contracts are discovery driven',
    id: 'i9',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.areContractsDiscoveryDriven ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Costs Configured',
    id: 'z5',
    align: 'right',
    fn: (project: DiscoLupeProject) => (project.costsConfigured ? 'Yes' : 'No'),
    displayFn: IndicatorContainer,
  },
  {
    header: 'Liveness Configured',
    id: 'vl',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.livenessConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Milestones & Incidents Configured',
    id: '5k',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.milestonesConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Operator Configured',
    id: 'wq',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.operatorConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Withdrawals Configured',
    id: 'of',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.withdrawalsConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Other Considerations Configured',
    id: '0f',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.otherConsiderationsConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'State Derivation Configured',
    id: 'yk',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.stateDerivationConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'State Validation Configured',
    id: '14',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.stateValidationConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
  {
    header: 'Upgrades & Governance Configured',
    id: 'v5',
    align: 'right',
    fn: (project: DiscoLupeProject) =>
      project.upgradesAndGovernanceConfigured ? 'Yes' : 'No',
    displayFn: IndicatorContainer,
  },
] as const

export const DEFAULT_COLUMN_IDS: ColumnId[] = ['qx', 'ig', 'zz', 'm5']

export const AVAILABLE_COLUMNS =
  AVAILABLE_COLUMNS_RAW as unknown as LupeColumn[]

export function serializeColumns(columns: LupeColumn[]): string {
  return columns.map((c) => c.id).join('')
}

export function deserializeColumns(serialized: string): LupeColumn[] {
  const columns: LupeColumn[] = []

  for (let i = 0; i < serialized.length; i += 2) {
    const id = serialized.slice(i, i + 2) as ColumnId
    const column = AVAILABLE_COLUMNS.find((c) => c.id === id)
    if (column !== undefined) {
      columns.push(column)
    }
  }

  return columns
}
