import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/Tooltip'
import { IconGears } from '../../../icons/IconGear'
import { useConfigSyncStatus } from '../hooks/useConfigSyncStatus'

type Props = {
  project: string
}
export function ConfigSyncBadge(props: Props) {
  const { project } = props
  const { isInSync, isPending, isError } = useConfigSyncStatus({ project })

  if (isPending) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <IconGears animate containerClassName="animate-breath" />
        </TooltipTrigger>
        <TooltipContent>Loading config status...</TooltipContent>
      </Tooltip>
    )
  }

  if (isError) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <IconGears className="text-aux-red" />
        </TooltipTrigger>
        <TooltipContent>
          Could not load config. Either config is invalid or API could not be
          reached.
        </TooltipContent>
      </Tooltip>
    )
  }

  if (isInSync) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <IconGears className="text-aux-green" />
        </TooltipTrigger>
        <TooltipContent>
          Config is in sync with discovery output.
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <IconGears className="text-aux-amber" />
      </TooltipTrigger>
      <TooltipContent>
        There is a mismatch between config and discovery output versions.
        Consider rerunning discovery.
      </TooltipContent>
    </Tooltip>
  )
}
