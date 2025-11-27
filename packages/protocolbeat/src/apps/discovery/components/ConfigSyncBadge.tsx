import type { RefreshReason } from '@l2beat/discovery'
import clsx from 'clsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/Tooltip'
import { IconGears } from '../../../icons/IconGear'
import {
  useConfigSyncStatus,
  useGlobalConfigSyncStatus,
} from '../hooks/useConfigSyncStatus'

type Props = {
  project: string
}
export function ConfigSyncBadge(props: Props) {
  const { project } = props
  const { reasons, isPending, isError } = useConfigSyncStatus({ project })

  const Badge = createBadge('P')

  if (isPending) {
    return <Badge animate />
  }

  if (isError) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge className="text-aux-red" />
        </TooltipTrigger>
        <TooltipContent>Could not load config status.</TooltipContent>
      </Tooltip>
    )
  }

  if (reasons?.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge />
        </TooltipTrigger>
        <TooltipContent>Project config is in sync.</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className="text-aux-amber" />
      </TooltipTrigger>
      <TooltipContent>
        There are some config changes not yet reflected in the project
        discovery. Consider rerunning discovery.
        <ol className="mt-1.5 ml-4 list-decimal space-y-1">
          {reasons?.map((reason, idx) => (
            <li key={idx}>{formatReason(reason)}</li>
          ))}
        </ol>
      </TooltipContent>
    </Tooltip>
  )
}

export function GlobalConfigSyncBadge(props: { project: string }) {
  const { reasons, isPending, isError } = useGlobalConfigSyncStatus()

  const filtered = reasons?.filter(({ project }) => project !== props.project)

  const Badge = createBadge('G')

  if (isPending) {
    return <Badge animate />
  }

  if (isError) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge className="text-aux-red" />
        </TooltipTrigger>
        <TooltipContent>Could not load config status.</TooltipContent>
      </Tooltip>
    )
  }

  if (filtered?.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge />
        </TooltipTrigger>
        <TooltipContent>All projects are in sync.</TooltipContent>
      </Tooltip>
    )
  }

  const reasonsList =
    filtered?.map(({ project, reasons }) => ({
      project,
      reasons: reasons.map(formatReason),
    })) ?? []

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className="text-aux-amber" />
      </TooltipTrigger>
      <TooltipContent>
        There are some config changes not yet reflected in the following
        projects. Consider rerunning discovery.
        <ol className="mt-1.5 ml-4 list-decimal space-y-1">
          {reasonsList.map(({ project, reasons }) => {
            return (
              <>
                <li key={project}>{project}:</li>
                <ol className="ml-4 list-disc space-y-1">
                  {reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ol>
              </>
            )
          })}
        </ol>
      </TooltipContent>
    </Tooltip>
  )
}

function createBadge(content: React.ReactNode) {
  return (props: { className?: string; animate?: boolean }) => (
    <div className="flex px-1 py-0.5 font-mono text-xs">
      <div className="flex flex-1 items-center justify-center gap-1">
        {content}
        <IconGears
          containerClassName={clsx(props.className)}
          animate={props.animate}
        />
      </div>
    </div>
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
    case 'CUSTOM':
      return reason.message
  }
}
