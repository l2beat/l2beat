import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Loader } from '../../../../components/Loader'
import { IconChecked } from '../../../../icons/IconChcked'
import { IconLink } from '../../../../icons/IconLink'
import { IconTriangleAlert } from '../../../../icons/IconTriangleAlert'
import { useProjectData } from '../../hooks/useProjectData'
import { SettingsSection } from './SettingRow'
import {
  type SyncLevel,
  type SyncStatus,
  useFilesSyncStatus,
  useOutputsSyncStatus,
} from './syncStatus'

export function StatusSettingsTab() {
  const { project } = useProjectData()
  const outputs = useOutputsSyncStatus(project)
  const files = useFilesSyncStatus()

  return (
    <>
      <SettingsSection title="Sync">
        <StatusRow title="Outputs" status={outputs} />
        <StatusRow title="Files" status={files} />
      </SettingsSection>
      <SettingsSection title="Reports">
        <div className="px-4 py-3 max-sm:px-3">
          <Link
            to="/ui/reports/config-health"
            className="inline-flex items-center gap-1 font-medium text-coffee-100 text-sm hover:text-autumn-300"
          >
            Config health <IconLink className="size-3" />
          </Link>
        </div>
      </SettingsSection>
    </>
  )
}

function StatusRow(props: { title: string; status: SyncStatus }) {
  return (
    <div className="flex items-start justify-between gap-6 px-4 py-3 max-sm:gap-3 max-sm:px-3">
      <div className="min-w-0">
        <div className="font-medium text-coffee-100 text-sm">{props.title}</div>
        <div className="mt-1 text-coffee-300 text-xs leading-4">
          {props.status.message}
        </div>
      </div>
      <div className="shrink-0">{toLevelIcon(props.status.level)}</div>
    </div>
  )
}

function toLevelIcon(level: SyncLevel): ReactNode {
  switch (level) {
    case 'pending':
      return <Loader className="size-4" />
    case 'error':
      return <IconTriangleAlert className="text-aux-red" />
    case 'warning':
      return <IconTriangleAlert className="text-aux-yellow" />
    case 'ok':
      return <IconChecked className="text-aux-green" />
  }
}
