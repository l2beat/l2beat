import { InfoIcon } from '~/icons/Info'
import { useActivityMetricContext } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'

export function ActivityChartHeader() {
  const { metric, setMetric } = useActivityMetricContext()

  return (
    <div className="flex items-center gap-2">
      <h1 className="whitespace-nowrap font-bold text-xl max-md:ml-1 md:text-2xl">
        Daily average
      </h1>
      <div className="flex items-center gap-2">
        <ActivityMetricControls
          value={metric}
          onValueChange={setMetric}
          className="h-9"
        />
        <SwitchInfoTooltip />
      </div>
    </div>
  )
}

function SwitchInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="size-3.5 fill-blue-700" />
      </TooltipTrigger>
      <TooltipContent>
        User Operations Per Second (UOPS) takes into account the user
        operations, including regular transactions and actions bundled into a
        single transaction. Transactions Per Second (TPS) takes into account the
        regular transactions only.
      </TooltipContent>
    </Tooltip>
  )
}
