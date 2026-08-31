import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyAnonymitySetChart } from '~/pages/privacy/project/components/PrivacyAnonymitySetChart'
import { PrivacyAnonymitySetChartRangeControls } from '~/pages/privacy/project/components/PrivacyAnonymitySetChartRangeControls'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAnonymitySetSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
}

export function PrivacyAnonymitySetSection({
  defaultRange,
  project,
  ...projectSectionProps
}: PrivacyAnonymitySetSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.privacy.anonymitySetChart.queryOptions({
      projectId: project.id,
      range,
    }),
  )
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.history.map(([timestamp]) => ({ timestamp })),
        { bucket: 'day' },
      ),
    [data],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      {data !== undefined && data.syncedUntil === undefined ? (
        <div className="rounded bg-surface-secondary px-4 py-3 text-paragraph-15 text-secondary">
          Historical anonymity-set data is still being indexed. Values will be
          shown once every configured pool has indexed a common complete UTC
          day.
        </div>
      ) : (
        <>
          <h3 className="mb-2 font-bold text-heading-20">
            30 day historic anonymity set
          </h3>
          <p className="mb-4 text-paragraph-15 text-secondary">
            How many unique addresses you could have blended in with if you
            withdrew on a particular day after depositing during the previous 30
            days. This metric is a proxy for the historic anonymity set and
            shows how it developed over time.
          </p>
          <ChartControlsWrapper className="mb-4">
            <ProjectChartTimeRange timeRange={timeRange} />
            <PrivacyAnonymitySetChartRangeControls
              range={range}
              setRange={setRange}
            />
          </ChartControlsWrapper>
          <PrivacyAnonymitySetChart
            data={data?.history}
            series={data?.series}
            syncedUntil={data?.syncedUntil}
            isLoading={isLoading}
            project={project}
            type="history"
          />
          <p className="mt-4 text-paragraph-14 text-secondary">
            The metric looks backwards: it counts deposits that already
            happened, including from addresses that have since withdrawn. Your
            real anonymity also depends on deposits made after yours, which
            cannot be known in advance.
          </p>

          <h3 className="mt-8 mb-2 font-bold text-heading-20">
            Estimated anonymity set by holding duration
          </h3>
          <p className="mb-4 text-paragraph-15 text-secondary">
            An estimate of how many unique addresses you blend in with,
            depending on how long you leave your deposit in the pool. It is
            based on historic data of past deposits: each point counts
            depositors from the preceding period, so holding for up to 30 days
            effectively means blending in with everyone who deposited during the
            last 30 days.
            {data?.syncedUntil !== undefined && (
              <>
                {' '}
                Counted over deposits up to{' '}
                {formatTimestamp(data.syncedUntil, { longMonthName: true })}.
              </>
            )}
          </p>
          <PrivacyAnonymitySetChart
            data={data?.holdingDuration}
            series={data?.series}
            isLoading={isLoading}
            project={project}
            type="holding-duration"
          />
        </>
      )}
    </ProjectSection>
  )
}
