import type { RefreshReason } from '@l2beat/discovery'
import type { ReactNode } from 'react'
import { useConfigModels } from '../../hooks/useConfigModels'
import { useConfigSyncStatus } from '../../hooks/useConfigSyncStatus'

export type SyncLevel = 'ok' | 'pending' | 'warning' | 'error'

export interface SyncStatus {
  level: SyncLevel
  message: ReactNode
}

// Outputs: whether the discovered outputs still match the project config.
export function useOutputsSyncStatus(project: string): SyncStatus {
  const { reasons, isPending, isError } = useConfigSyncStatus({ project })
  return toOutputsSyncStatus({
    reasons: reasons ?? [],
    isError,
    isPending,
  })
}

// Files: whether the config and template edits made here reached the disk.
export function useFilesSyncStatus(): SyncStatus {
  const { configModel, templateModel, isError, isPending } = useConfigModels()
  return toFilesSyncStatus({
    isInSync: configModel.isInSync && templateModel.isInSync,
    isError: configModel.isSyncError || templateModel.isSyncError || isError,
    isPending:
      configModel.isSyncPending || templateModel.isSyncPending || isPending,
  })
}

export function needsAttention(level: SyncLevel): boolean {
  return level === 'warning' || level === 'error'
}

function toOutputsSyncStatus(props: {
  reasons: RefreshReason[]
  isError: boolean
  isPending: boolean
}): SyncStatus {
  if (props.isPending) {
    return { level: 'pending', message: 'Loading outputs status...' }
  }
  if (props.isError) {
    return { level: 'error', message: 'Could not load outputs status.' }
  }
  if (props.reasons.length === 0) {
    return { level: 'ok', message: 'Outputs are in sync.' }
  }
  return {
    level: 'warning',
    message: (
      <>
        There are some config changes not yet reflected in the project
        discovery. Consider rerunning discovery.
        <ol className="mt-1.5 ml-4 list-decimal space-y-1">
          {props.reasons.map((reason, idx) => (
            <li key={idx}>{formatReason(reason)}</li>
          ))}
        </ol>
      </>
    ),
  }
}

function toFilesSyncStatus(props: {
  isInSync: boolean
  isError: boolean
  isPending: boolean
}): SyncStatus {
  if (props.isPending) {
    return { level: 'pending', message: 'Local and remote config are syncing.' }
  }
  if (props.isError) {
    return {
      level: 'error',
      message:
        'Could not sync local and remote configs. Changes you made will not be reflected in the configuration files.',
    }
  }
  if (props.isInSync) {
    return { level: 'ok', message: 'Local and remote configs are in sync.' }
  }
  return {
    level: 'warning',
    message: 'Local and remote configs are out of sync.',
  }
}

function formatReason(reason: RefreshReason) {
  switch (reason.type) {
    case 'TEMPLATE_NO_LONGER_MATCHES':
      return `A contract "${reason.contract}" with template "${reason.template}", no longer matches any template`
    case 'TEMPLATE_MATCH_CHANGED':
      return (
        <p>
          A contract "{reason.contract}" matches a different template - from{' '}
          {reason.oldTemplate} to:{' '}
          <ol className="ml-4 list-disc space-y-1">
            {reason.newTemplates.map((template) => (
              <li key={template}>{template}</li>
            ))}
          </ol>
        </p>
      )
    case 'NEW_TEMPLATE_MATCH':
      return (
        <p>
          A contract "{reason.contract}" without template now matches:
          <ol className="ml-4 list-disc space-y-1">
            {reason.newTemplates.map((template) => (
              <li key={template}>{template}</li>
            ))}
          </ol>
        </p>
      )
    case 'CONFIG_CHANGED':
      return 'Project config has changed'
    case 'TEMPLATE_CONFIG_CHANGED':
      return (
        <p>
          Template configs have changed:
          <ol className="ml-4 list-disc space-y-1">
            {reason.templates.map((template) => (
              <li key={template}>{template}</li>
            ))}
          </ol>
        </p>
      )
  }
}
