import type { RefreshReason } from '@l2beat/discovery'
import { Loader } from '../../../../components/Loader'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/Tooltip'
import { IconChecked } from '../../../../icons/IconChcked'
import { IconTriangleAlert } from '../../../../icons/IconTriangleAlert'
import {
  useConfigSyncStatus,
  useGlobalConfigSyncStatus,
} from '../../hooks/useConfigSyncStatus'

type Props = {
  project: string
}
export function OutputsSyncBadge(props: Props) {
  const { project } = props
  const { reasons, isPending, isError } = useConfigSyncStatus({ project })

  const { icon, tooltipContent } = toStatusBundle({
    payload: { type: 'single', reasons: reasons ?? [] },
    isError: isError,
    isPending: isPending,
  })

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-xs">Project {icon}</div>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}

export function GlobalOutputsSyncBadge(props: { project: string }) {
  const { reasons, isPending, isError } = useGlobalConfigSyncStatus()

  const filtered = reasons?.filter(({ project }) => project !== props.project)

  const { icon, tooltipContent } = toStatusBundle({
    payload: { type: 'many', reasons: filtered ?? [] },
    isError: isError,
    isPending: isPending,
  })

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-xs">Global {icon}</div>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
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

function toStatusBundle(props: {
  payload:
    | { type: 'single'; reasons: RefreshReason[] }
    | {
        type: 'many'
        reasons: { project: string; reasons: RefreshReason[] }[]
      }
  isError: boolean
  isPending: boolean
}) {
  if (props.isPending) {
    return {
      icon: <Loader className="size-4" />,
      tooltipContent: 'Loading outputs status...',
    }
  }

  if (props.isError) {
    return {
      icon: <IconTriangleAlert className="text-aux-red" />,
      tooltipContent: 'Could not load outputs status.',
    }
  }

  if (props.payload.reasons.length === 0) {
    return {
      icon: <IconChecked className="text-aux-green" />,
      tooltipContent: 'Outputs are in sync.',
    }
  }

  if (props.payload.type === 'single') {
    return {
      icon: <IconTriangleAlert className="text-aux-yellow" />,
      tooltipContent: (
        <>
          There are some config changes not yet reflected in the project
          discovery. Consider rerunning discovery.
          <ol className="mt-1.5 ml-4 list-decimal space-y-1">
            {props.payload.reasons.map((reason, idx) => (
              <li key={idx}>{formatReason(reason)}</li>
            ))}
          </ol>
        </>
      ),
    }
  }

  return {
    icon: <IconTriangleAlert className="text-aux-yellow" />,
    tooltipContent: (
      <>
        There are some config changes not yet reflected in the following
        projects. Consider rerunning discovery.
        <ol className="mt-1.5 ml-4 list-decimal space-y-1">
          {props.payload.reasons.map(({ project, reasons }) => {
            return (
              <>
                <li key={project}>{project}:</li>
                <ol className="ml-4 list-disc space-y-1">
                  {reasons.map((reason, idx) => (
                    <li key={idx}>{formatReason(reason)}</li>
                  ))}
                </ol>
              </>
            )
          })}
        </ol>
      </>
    ),
  }
}
