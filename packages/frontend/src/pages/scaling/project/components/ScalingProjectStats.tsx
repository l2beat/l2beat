import { pluralize } from '@l2beat/shared-pure'
import chunk from 'lodash/chunk'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import { Fragment } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { StageCell } from '~/components/table/cells/stage/StageCell'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
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
    <ProjectSummaryStat
      key="tvs"
      title={
        <div>
          <span className="lg:max-xl:hidden">Total Value Secured</span>
          <span className="max-lg:hidden xl:hidden">TVS</span>
        </div>
      }
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
              className="!text-base !font-medium !leading-[100%] text-nowrap"
              changeClassName="text-label-value-14 font-bold"
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
    <ProjectSummaryStat
      key="ops-count"
      title={
        <div>
          <span className="lg:max-xl:hidden">Past day UOPS</span>
          <span className="max-lg:hidden xl:hidden">Daily UOPS</span>
        </div>
      }
      tooltip="User operations per second averaged over the past day displayed together with a percentage change compared to 7D ago."
      value={
        project.header.activity ? (
          <ValueWithPercentageChange
            change={project.header.activity.uopsWeeklyChange}
            className="text-nowrap font-medium! text-base! leading-[100%]!"
            changeClassName="text-label-value-14 font-bold"
          >
            {project.header.activity.lastDayUops.toFixed(2)}
          </ValueWithPercentageChange>
        ) : (
          <NoDataBadge />
        )
      }
    />,
    project.stageConfig.stage !== 'NotApplicable' ? (
      <ProjectSummaryStat
        key="stage"
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
      <ProjectSummaryStat
        key="gas-tokens"
        title={`Gas ${pluralize(project.header.gasTokens.length, 'token')}`}
        value={project.header.gasTokens.join(', ')}
      />
    ) : undefined,
    <ProjectSummaryStat
      key="type"
      title="Type"
      value={<TypeInfo>{project.header.category}</TypeInfo>}
    />,

    <ProjectSummaryStat
      key="purpose"
      title={pluralize(project.header.purposes.length, 'Purpose')}
      value={project.header.purposes.join(', ')}
    />,
    project.header.hostChain ? (
      <ProjectSummaryStat
        key="host-chain"
        title="Host chain"
        value={project.header.hostChain}
      />
    ) : undefined,
    project.header.chainId ? (
      <ProjectSummaryStat
        key="chain-id"
        title="Chain ID"
        value={project.header.chainId}
      />
    ) : undefined,
  ])

  const groups = stats.length > 4 ? 4 : 3
  const partitioned = chunk(stats, groups)

  return (
    <div
      className={cn(
        'grid h-fit grid-cols-1 gap-x-6 gap-y-3',
        groups === 3 && 'md:grid-cols-3',
        groups === 4 && 'md:grid-cols-4',
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
