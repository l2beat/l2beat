import { pluralize } from '@l2beat/shared-pure'
import { type ReactNode } from 'react'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { StageBadge } from '~/components/badge/stage-badge'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { StageTooltip } from '~/components/table/cells/stage/stage-tooltip'
import { TypeCell } from '~/components/table/cells/type-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { InfoIcon } from '~/icons/info'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { cn } from '~/utils/cn'
import { formatNumber } from '~/utils/number-format/format-number'
import { TokenBreakdownStat } from './token-breakdown-stat'

interface Props {
  project: ScalingProjectEntry
  className?: string
}

export function ScalingProjectStats({ project, className }: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 rounded-lg bg-gray-100 dark:bg-zinc-900 md:grid-cols-3 md:px-6 md:py-5',
        className,
      )}
    >
      <ProjectStat
        title="Tokens"
        value={
          <TokenBreakdownStat breakdown={project.header.tvl?.tokenBreakdown} />
        }
      />
      <ProjectStat
        title="Daily UOPS"
        tooltip="User operations per second averaged over the past day displayed together with a percentage change compared to 7D ago."
        value={
          project.header.activity ? (
            <ValueWithPercentageChange
              change={project.header.activity.uopsWeeklyChange}
              className="font-medium !leading-none md:text-xl md:font-bold"
              changeClassName="md:text-base md:font-medium !leading-none"
            >
              {project.header.activity.lastDayUops.toFixed(2)}
            </ValueWithPercentageChange>
          ) : (
            <NoDataBadge />
          )
        }
      />
      <ProjectStat
        title="30D ops count"
        value={
          project.header.activity ? (
            formatNumber(project.header.activity.uopsCount)
          ) : (
            <NoDataBadge />
          )
        }
      />
      <HorizontalSeparator className="col-span-full max-md:hidden" />
      {project.stageConfig.stage !== 'NotApplicable' ? (
        <ProjectStat
          title="Stage"
          value={
            <span className="relative -top-0.5 flex items-center">
              <a href="#stage">
                <StageBadge stage={project.stageConfig.stage} />
              </a>
              <Tooltip>
                <TooltipTrigger className="inline-block px-2">
                  <InfoIcon className="size-4" variant="gray" />
                </TooltipTrigger>
                <TooltipContent>
                  <StageTooltip stageConfig={project.stageConfig} />
                </TooltipContent>
              </Tooltip>
            </span>
          }
        />
      ) : null}
      <ProjectStat
        title="Type"
        value={<TypeCell>{project.header.category}</TypeCell>}
      />
      <ProjectStat
        title={pluralize(project.header.purposes.length, 'Purpose')}
        value={project.header.purposes.join(', ')}
      />
      {project.header.hostChain && (
        <ProjectStat title="Host chain" value={project.header.hostChain} />
      )}
    </div>
  )
}

interface ProjectStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

function ProjectStat(props: ProjectStat) {
  return (
    <li
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="-translate-y-px md:translate-y-0">
              <InfoIcon className="mt-0.5 md:size-3.5" variant="gray" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-lg font-medium !leading-none md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
