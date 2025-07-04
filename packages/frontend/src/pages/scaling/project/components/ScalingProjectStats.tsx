import { pluralize } from '@l2beat/shared-pure'
import chunk from 'lodash/chunk'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import { Fragment, type ReactNode } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { StageCell } from '~/components/table/cells/stage/StageCell'
import { InfoIcon } from '~/icons/Info'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface Props {
  project: ProjectScalingEntry
  className?: string
}

export function ProjectScalingStats({ project, className }: Props) {
  const stats = compact([
    <ProjectStat
      key="tvs"
      title="Total Value Secured"
      valueClassName=""
      value={
        project.header.tvs?.breakdown ? (
          <span className="mb-0.5 flex items-center gap-2">
            {project.header.tvs.warning && (
              <Tooltip>
                <TooltipTrigger>
                  <RoundedWarningIcon
                    sentiment={project.header.tvs.warning.sentiment}
                    className="size-4"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {project.header.tvs.warning.value}
                </TooltipContent>
              </Tooltip>
            )}
            <ValueWithPercentageChange
              className="!text-base !font-medium !leading-[100%]"
              changeClassName="label-value-14-bold"
              change={project.header.tvs.breakdown.totalChange}
            >
              {formatCurrency(project.header.tvs.breakdown.total, 'usd')}
            </ValueWithPercentageChange>
          </span>
        ) : (
          <NoDataBadge />
        )
      }
    />,
    <ProjectStat
      key="ops-count"
      title="Past day UOPS"
      tooltip="User operations per second averaged over the past day displayed together with a percentage change compared to 7D ago."
      value={
        project.header.activity ? (
          <ValueWithPercentageChange
            change={project.header.activity.uopsWeeklyChange}
            className="!text-base !font-medium !leading-[100%]"
            changeClassName="label-value-15-medium"
          >
            {project.header.activity.lastDayUops.toFixed(2)}
          </ValueWithPercentageChange>
        ) : (
          <NoDataBadge />
        )
      }
    />,
    project.stageConfig.stage !== 'NotApplicable' ? (
      <ProjectStat
        title="Stage"
        className="md:gap-2.5"
        valueClassName="max-md:-mt-0.5"
        value={
          <a href="#stage">
            <StageCell
              stageConfig={project.stageConfig}
              isAppchain={project.isAppchain}
              emergencyWarning={project.header.emergencyWarning}
            />
          </a>
        }
      />
    ) : undefined,
    project.header.gasTokens && !isEmpty(project.header.gasTokens) ? (
      <ProjectStat
        title={`Gas ${pluralize(project.header.gasTokens.length, 'token')}`}
        value={project.header.gasTokens.join(', ')}
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
    project.header.chainId ? (
      <ProjectStat title="Chain ID" value={project.header.chainId} />
    ) : undefined,
  ])

  const GROUPS = 4
  const partitioned = chunk(stats, GROUPS)

  return (
    <div
      className={cn(
        'grid h-fit grid-cols-1 gap-x-6 gap-y-3 rounded-lg md:grid-cols-4',
        className,
      )}
    >
      {partitioned.map((statGroup, i) => {
        const isLastGroup = i === partitioned.length - 1

        return (
          <Fragment key={i}>
            {statGroup.map((stat, j) => (
              <Fragment key={`${i}-${j}`}>{stat}</Fragment>
            ))}
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
  valueClassName?: string
}

export function ProjectStat(props: ProjectStat) {
  return (
    <li
      key={props.title}
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span className="paragraph-12-medium text-secondary">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="size-3">
              <InfoIcon className="size-3" variant="gray" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className={cn('label-value-16-bold w-full', props.valueClassName)}>
        {props.value}
      </span>
    </li>
  )
}
