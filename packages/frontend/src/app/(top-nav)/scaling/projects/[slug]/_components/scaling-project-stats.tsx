import { pluralize } from '@l2beat/shared-pure'
import { chunk, compact, isEmpty } from 'lodash'
import { Fragment, type ReactNode } from 'react'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { StageCell } from '~/components/table/cells/stage/stage-cell'
import { TypeInfo } from '~/components/table/cells/type-info'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { InfoIcon } from '~/icons/info'
import type { ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { cn } from '~/utils/cn'
import { formatNumber } from '~/utils/number-format/format-number'
import { TokenBreakdownStat } from './token-breakdown-stat'

interface Props {
  project: ScalingProjectEntry
  className?: string
}

export function ScalingProjectStats({ project, className }: Props) {
  const isAppchain = project.capability === 'appchain'

  const stats = compact([
    <ProjectStat
      key="tokens"
      title="Tokens"
      value={<TokenBreakdownStat tokenTvs={project.header.tvs?.tokens} />}
    />,
    <ProjectStat
      key="past-day-uops"
      title="Past day UOPS"
      tooltip="User operations per second averaged over the past day displayed together with a percentage change compared to 7D ago."
      value={
        project.header.activity ? (
          <ValueWithPercentageChange
            change={project.header.activity.uopsWeeklyChange}
            className="font-medium !leading-none md:text-lg md:font-bold"
            changeClassName="md:text-base md:font-medium !leading-none"
          >
            {project.header.activity.lastDayUops.toFixed(2)}
          </ValueWithPercentageChange>
        ) : (
          <NoDataBadge />
        )
      }
    />,
    <ProjectStat
      key="ops-count"
      title="30D ops count"
      value={
        project.header.activity ? (
          formatNumber(project.header.activity.uopsCount)
        ) : (
          <NoDataBadge />
        )
      }
    />,
    project.header.gasTokens && !isEmpty(project.header.gasTokens) ? (
      <ProjectStat
        key="gas-tokens"
        title={`Gas ${pluralize(project.header.gasTokens.length, 'token')}`}
        value={project.header.gasTokens.join(', ')}
      />
    ) : undefined,
    project.stageConfig.stage !== 'NotApplicable' ? (
      <ProjectStat
        title="Stage"
        value={
          <a href="#stage">
            <StageCell
              stageConfig={project.stageConfig}
              isAppchain={isAppchain}
            />
          </a>
        }
      />
    ) : undefined,
    <ProjectStat
      key="type"
      title="Type"
      value={<TypeInfo>{project.header.category}</TypeInfo>}
    />,
    <ProjectStat
      key="purpose"
      title={pluralize(project.header.purposes.length, 'Purpose')}
      value={project.header.purposes.join(', ')}
    />,
    project.header.hostChain ? (
      <ProjectStat title="Host chain" value={project.header.hostChain} />
    ) : undefined,
  ])

  const GROUPS = 4
  const partitioned = chunk(stats, GROUPS)

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 rounded-lg md:grid-cols-4 md:bg-header-secondary md:px-6 md:py-5',
        className,
      )}
    >
      {partitioned.map((statGroup, i) => {
        const isLastGroup = i === partitioned.length - 1

        return (
          <Fragment key={i}>
            {statGroup.map((stat) => stat)}
            {!isLastGroup && (
              <HorizontalSeparator className="col-span-full my-1 max-md:hidden" />
            )}
          </Fragment>
        )
      })}
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
        <span className="text-xs text-secondary">{props.title}</span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="-translate-y-px md:translate-y-0">
              <InfoIcon className="mt-0.5 md:size-3.5" variant="gray" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-lg font-medium !leading-none md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
