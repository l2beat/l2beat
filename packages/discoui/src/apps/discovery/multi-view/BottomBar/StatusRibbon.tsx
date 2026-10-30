import { memo } from 'react'
import { Link } from 'react-router'
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
import { IconLink } from '../../../../icons/IconLink'
import { IconTriangleAlert } from '../../../../icons/IconTriangleAlert'
import { IconWebApp } from '../../../../icons/IconWebApp'
import { useConfigModels } from '../../hooks/useConfigModels'
import { useProjectData } from '../../hooks/useProjectData'
import { OutputsSyncBadge } from './OutputsBadge'

export function StatusRibbon() {
  const { project } = useProjectData()
  const {
    configModel,
    templateModel,
    isError: isModelLoadError,
    isPending: isModelLoadPending,
  } = useConfigModels()

  if (IS_READONLY) {
    return
  }

  return (
    <div className="flex h-full items-center">
      <Link
        to="/ui/reports/config-health"
        className="flex h-full items-center gap-1 border-coffee-600 border-l px-3 text-coffee-300 hover:text-coffee-100"
      >
        Health <IconLink className="size-3" />
      </Link>
      <div className="flex h-full items-center gap-1.5 border-coffee-600 border-l px-3">
        <span className="text-coffee-400">Outputs</span>
        <div className="flex items-center justify-center gap-2 text-coffee-200">
          <OutputsSyncBadge project={project} />
        </div>
      </div>
      <div className="flex h-full items-center gap-1.5 border-coffee-600 border-l px-3">
        <span className="text-coffee-400">Files</span>
        <div className="flex items-center justify-center gap-2 text-coffee-200">
          <Status
            isInSync={configModel.isInSync && templateModel.isInSync}
            isError={
              configModel.isSyncError ||
              templateModel.isSyncError ||
              isModelLoadError
            }
            isPending={
              configModel.isSyncPending ||
              templateModel.isSyncPending ||
              isModelLoadPending
            }
          />
        </div>
      </div>
    </div>
  )
}

// The ribbon rerenders on every config models change, which is every list
// click, while the three flags rarely change.
const Status = memo(function Status(props: {
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
})

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
        'Could not sync local and remote configs. Changes you made will not be reflected in the configuration files.',
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
    tooltipContent: 'Local and remote configs are out of sync.',
  }
}
