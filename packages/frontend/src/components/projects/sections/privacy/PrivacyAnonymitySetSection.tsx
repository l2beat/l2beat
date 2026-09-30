import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyAnonymitySetChart } from '~/pages/privacy/project/components/PrivacyAnonymitySetChart'
import { PrivacyAnonymitySetChartRangeControls } from '~/pages/privacy/project/components/PrivacyAnonymitySetChartRangeControls'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type { PrivacyAnonymitySetType } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSeries'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAnonymitySetSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  anonymitySetType: PrivacyAnonymitySetType
}

const COPY: Record<
  PrivacyAnonymitySetType,
  {
    history: string
    historyNote: string
    durationTitle: string
    duration: string
    durationLabel: string
    countedOver: string
  }
> = {
  deposits: {
    history: `How many unique addresses you could have blended in with if you withdrew on a particular day after depositing during the previous ${ANONYMITY_SET_WINDOW_DAYS} days. This metric is a proxy for the historic anonymity set and shows how it developed over time.`,
    historyNote:
      'The metric looks backwards: it counts deposits that already happened, including from addresses that have since withdrawn. Your real anonymity also depends on deposits made after yours, which cannot be known in advance.',
    durationTitle: 'Estimated anonymity set by holding duration',
    duration: `An estimate of how many unique addresses you blend in with, depending on how long you leave your deposit in the pool. It is based on historic data of past deposits: each point counts depositors from the preceding period, so holding for up to ${ANONYMITY_SET_WINDOW_DAYS} days effectively means blending in with everyone who deposited during the last ${ANONYMITY_SET_WINDOW_DAYS} days.`,
    durationLabel: 'holding duration',
    countedOver: 'deposits',
  },
  keyRegistrations: {
    history: `How many unique addresses you could have blended in with if you received a stealth address transfer on a particular day after registering keys during the previous ${ANONYMITY_SET_WINDOW_DAYS} days. This metric is a proxy for the historic anonymity set and shows how it developed over time.`,
    historyNote:
      'The metric looks backwards: it counts key registrations that already happened, and a registered address has not necessarily received any transfers. Your real anonymity also depends on registrations made after yours, which cannot be known in advance.',
    durationTitle: 'Estimated anonymity set by waiting time',
    duration: `An estimate of how many unique addresses you blend in with, depending on how long you wait between registering keys and receiving a stealth address transfer. It is based on historic data of past registrations: each point counts registrants from the preceding period, so waiting for up to ${ANONYMITY_SET_WINDOW_DAYS} days effectively means blending in with everyone who registered during the last ${ANONYMITY_SET_WINDOW_DAYS} days.`,
    durationLabel: 'waiting time',
    countedOver: 'registrations',
  },
}

export function PrivacyAnonymitySetSection({
  defaultRange,
  project,
  anonymitySetType,
  ...projectSectionProps
}: PrivacyAnonymitySetSectionProps) {
  const copy = COPY[anonymitySetType]
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
  const hasSyncedSeries = (data?.series.length ?? 0) > 0

  return (
    <ProjectSection {...projectSectionProps}>
      {data !== undefined && !hasSyncedSeries ? (
        <div className="rounded bg-surface-secondary px-4 py-3 text-paragraph-15 text-secondary">
          Historical anonymity-set data is still being indexed. Charts will
          appear once at least one configured token has complete history.
        </div>
      ) : (
        <>
          <h3 className="mb-2 font-bold text-heading-20">
            {ANONYMITY_SET_WINDOW_DAYS} day historic anonymity set
          </h3>
          <p className="mb-4 text-paragraph-15 text-secondary">
            {copy.history}
          </p>
          {data !== undefined && data.syncingLabels.length > 0 && (
            <div className="mb-4 rounded bg-surface-secondary px-4 py-3 text-paragraph-15 text-secondary">
              Some configured series are still being indexed and are excluded
              until their history is complete:{' '}
              <span className="font-medium text-primary">
                {data.syncingLabels.join(', ')}
              </span>
              .
            </div>
          )}
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
            {copy.historyNote}
          </p>

          <h3 className="mt-4 mb-2 font-bold text-heading-20">
            {copy.durationTitle}
          </h3>
          <p className="mb-4 text-paragraph-15 text-secondary">
            {copy.duration}
            {data?.syncedUntil !== undefined && (
              <>
                {' '}
                Counted over {copy.countedOver} up to{' '}
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
            durationLabel={copy.durationLabel}
          />
        </>
      )}
    </ProjectSection>
  )
}
