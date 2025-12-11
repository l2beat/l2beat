import { Loader } from '../../../../components/Loader'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/Tooltip'
import { IS_READONLY } from '../../../../config/readonly'
import { IconChecked } from '../../../../icons/IconChcked'
import { IconDatabase } from '../../../../icons/IconDatabase'
import { IconDots } from '../../../../icons/IconDots'
import { IconTriangleAlert } from '../../../../icons/IconTriangleAlert'
import { IconWebApp } from '../../../../icons/IconWebApp'
import { useConfigModels } from '../../hooks/useConfigModels'
import { useProjectData } from '../../hooks/useProjectData'
import { GlobalOutputsSyncBadge, OutputsSyncBadge } from './OutputsBadge'

export function StatusRibbon() {
  const { project } = useProjectData()
  const { configModel, isPending, isError } = useConfigModels()

  if (IS_READONLY) {
    return
  }

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <div className="flex items-center justify-center border border-coffee-200">
        <div className="bg-coffee-200 px-1.5 py-0.5 text-coffee-800 text-xs">
          Outputs
        </div>
        <div className="flex items-center justify-center gap-2 px-1">
          <OutputsSyncBadge project={project} />
          <GlobalOutputsSyncBadge project={project} />
        </div>
      </div>
      <div className="flex items-center justify-center border border-coffee-200">
        <div className="bg-coffee-200 px-1.5 py-0.5 text-coffee-800 text-xs">
          Files
        </div>
        <div className="flex items-center justify-center gap-2 px-1">
          <Status
            isInSync={configModel.isInSync}
            isError={configModel.isSyncError ?? isError}
            isPending={configModel.isSyncPending ?? isPending}
          />
        </div>
      </div>
    </div>
  )
}

function Status(props: {
  isInSync: boolean
  isError: boolean
  isPending: boolean
}) {
  const { icon, tooltipContent } = toStatusBundle(props)

  return (
    <Tooltip>
      <TooltipTrigger>
        <StatusTemplate>{icon}</StatusTemplate>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}

function StatusTemplate(props: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <IconWebApp />
      <IconDots />
      {props.children}
      <IconDots />
      <IconDatabase />
    </div>
  )
}

function toStatusBundle(props: {
  isInSync: boolean
  isError: boolean
  isPending: boolean
}) {
  if (props.isPending) {
    return {
      icon: <Loader />,
      tooltipContent: 'Local and remote config are syncing.',
    }
  }

  if (props.isError) {
    return {
      icon: <IconTriangleAlert className="text-aux-red" />,
      tooltipContent:
        'Local and remote config are out of sync. Changes you made might not be reflected in the configuration files',
    }
  }

  if (props.isInSync) {
    return {
      icon: <IconChecked className="stroke-1 text-aux-green" />,
      tooltipContent: 'Local and remote configs are in sync.',
    }
  }

  // Loaded but not in sync for some reason
  return {
    icon: <IconTriangleAlert className="text-aux-yellow" />,
    tooltipContent: 'Could not load config status.',
  }
}
