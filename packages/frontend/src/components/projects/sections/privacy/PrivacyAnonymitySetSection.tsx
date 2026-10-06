import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyAnonymitySetChart } from '~/pages/privacy/project/components/PrivacyAnonymitySetChart'
import { PrivacyAnonymitySetChartRangeControls } from '~/pages/privacy/project/components/PrivacyAnonymitySetChartRangeControls'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type { PrivacyAnonymitySetUnit } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSeries'
import type { PrivacyAnonymitySetChartResponse } from '~/server/features/privacy/getPrivacyAnonymitySetChart'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import {
  ANONYMITY_SET_LOOKS_BACKWARDS_NOTE,
  anonymitySetByHoldingDurationDescription,
  anonymitySetCoverageNote,
  historicAnonymitySetDescription,
} from '../sectionCopy'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAnonymitySetSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  unit: PrivacyAnonymitySetUnit
}

export function PrivacyAnonymitySetSection({
  defaultRange,
  project,
  unit,
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
  const hasSyncedSeries = (data?.series.length ?? 0) > 0
  const coverageNote = anonymitySetCoverageNote(
    data?.coverage,
    ANONYMITY_SET_WINDOW_DAYS,
  )

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
            {historicAnonymitySetDescription(unit, ANONYMITY_SET_WINDOW_DAYS)}
            {coverageNote !== undefined && <> {coverageNote}</>}
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
          {unit === 'depositor' && (
            <>
              <p className="mt-4 text-paragraph-14 text-secondary">
                {ANONYMITY_SET_LOOKS_BACKWARDS_NOTE}
              </p>
              <HoldingDurationSubsection
                data={data}
                isLoading={isLoading}
                project={project}
              />
            </>
          )}
        </>
      )}
    </ProjectSection>
  )
}

function HoldingDurationSubsection({
  data,
  isLoading,
  project,
}: {
  data: PrivacyAnonymitySetChartResponse | undefined
  isLoading: boolean
  project: ChartProject
}) {
  return (
    <>
      <h3 className="mt-4 mb-2 font-bold text-heading-20">
        Estimated anonymity set by holding duration
      </h3>
      <p className="mb-4 text-paragraph-15 text-secondary">
        {anonymitySetByHoldingDurationDescription(ANONYMITY_SET_WINDOW_DAYS)}
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
  )
}
