import { UnixTime } from '@l2beat/shared-pure'
import { round } from 'lodash'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import type { RosetteValue } from '~/components/rosette/types'
import { EM_DASH } from '~/consts/characters'
import { InfoIcon } from '~/icons/info'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'
import { cn } from '~/utils/cn'
import { formatBpsToMbps } from '~/utils/number-format/format-bytes'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface Props {
  stats: ProjectStat[]
  daLayerGrissiniValues: RosetteValue[] | undefined
}

export function DaProjectStats({ stats, daLayerGrissiniValues }: Props) {
  const GROUPS = 3
  const partitionedByThree = chunkArray(stats, GROUPS)

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg md:grid-cols-3 md:bg-header-secondary md:px-6 md:py-5">
      {partitionedByThree.map((statGroup, i) => {
        const isLastGroup = i === partitionedByThree.length - 1

        return (
          <Fragment key={i}>
            {statGroup.map((stat) => (
              <ProjectStat key={stat.title} {...stat} />
            ))}
            {!isLastGroup && (
              <HorizontalSeparator className="col-span-full my-1 max-md:hidden" />
            )}
          </Fragment>
        )
      })}
      {daLayerGrissiniValues && (
        <ProjectStat
          className="md:gap-1.5 lg:hidden"
          title="Risks"
          value={
            <GrissiniCell
              values={daLayerGrissiniValues}
              iconClassName="w-max"
            />
          }
        />
      )}
    </div>
  )
}

export interface ProjectStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

function ProjectStat(props: ProjectStat) {
  return (
    <li
      className={cn(
        'flex items-center justify-between gap-3 md:flex-col md:items-start md:justify-start',
        props.className,
      )}
    >
      <div className="flex flex-row items-center gap-1.5">
        <span className="whitespace-pre text-xs text-secondary">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="md:size-3.5" variant="gray" />
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

function chunkArray<T>(array: T[], divider: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += divider) {
    const chunk = array.slice(i, i + divider)
    chunkedArray.push(chunk)
  }
  return chunkedArray
}

export function getCommonDaProjectStats(
  project: DaProjectPageEntry | EthereumDaProjectPageEntry,
) {
  const stats: ProjectStat[] = []

  // Type
  stats.push({
    title: 'Type',
    value: project.type,
  })

  // TVS
  stats.push({
    title: 'TVS',
    value: formatCurrency(project.header.tvs, 'usd'),
    tooltip:
      'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
  })

  // Economic security
  stats.push({
    title: 'Economic security',
    value: // EC not set
      project.header.economicSecurity
        ? // EC set but not synced
          project.header.economicSecurity !== undefined
          ? formatCurrency(project.header.economicSecurity, 'usd')
          : 'Not synced'
        : EM_DASH,
    tooltip:
      'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
  })

  // Duration of storage
  const durationOfStorage =
    project.kind === 'DA Service'
      ? {
          value: 'Flexible',
          tooltip:
            'The duration depends on the offchain configuration of the DAC.',
        }
      : {
          value: project.header.durationStorage
            ? round(project.header.durationStorage / UnixTime.DAY, 2) + ' days'
            : EM_DASH,
        }

  stats.push({
    title: 'Duration of storage',
    ...durationOfStorage,
  })

  if (project.header.maxThroughputPerSecond) {
    stats.push({
      title: 'Max throughput',
      value: formatBpsToMbps(project.header.maxThroughputPerSecond),
    })
  }

  return stats
}
