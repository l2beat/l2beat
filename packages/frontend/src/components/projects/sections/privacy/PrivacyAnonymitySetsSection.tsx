import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { AnonymitySetChart } from '~/pages/privacy/project/components/AnonymitySetChart'
import { AnonymitySetHistoryChart } from '~/pages/privacy/project/components/AnonymitySetHistoryChart'
import { AnonymitySetRangeControls } from '~/pages/privacy/project/components/AnonymitySetRangeControls'
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatDate } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAnonymitySetsSectionProps extends ProjectSectionProps {
  curves: AnonymitySetCurves
  project: ChartProject
}

export function PrivacyAnonymitySetsSection({
  curves,
  project,
  ...projectSectionProps
}: PrivacyAnonymitySetsSectionProps) {
  const asOf = formatDate(curves.asOf.slice(0, 10))
  // The data is a frozen snapshot, so every range ends at its export date rather
  // than at today - see `optionToRange`.
  const anchor = UnixTime.fromDate(new Date(curves.asOf))

  const [historyRange, setHistoryRange] = useState<ChartRange>(() =>
    optionToRange('1y', anchor),
  )

  const visibleTimeRange = useMemo((): [number, number] | undefined => {
    const first = curves.history[0]?.[0]
    const last = curves.history.at(-1)?.[0]
    if (first === undefined || last === undefined) return undefined

    const [from, to] = historyRange
    return [Math.max(first, from ?? first), Math.min(last, to)]
  }, [curves.history, historyRange])

  return (
    <ProjectSection {...projectSectionProps}>
      <h3 className="mt-8 mb-2 font-bold text-heading-16">
        {curves.historyWindowDays} day historic anonymity set
      </h3>
      <p className="mb-4 text-paragraph-15 text-secondary">
        How many unique addresses you could have blend in with, if you withdrew
        on a particular day after depositing within {curves.historyWindowDays}{' '}
        days prior. This metric serves as a proxy for historic anonymity set and
        shows its development over time. Dev note: the demo data only goes up to{' '}
        {asOf}.
      </p>
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={visibleTimeRange} />
        <AnonymitySetRangeControls
          range={historyRange}
          setRange={setHistoryRange}
          anchor={anchor}
        />
      </ChartControlsWrapper>
      <AnonymitySetHistoryChart
        curves={curves}
        project={project}
        range={historyRange}
      />

      <p className="mt-4 text-paragraph-13 text-secondary">
        The metric looks backwards: it counts deposits that already happened,
        including from addresses that have since withdrawn. Your real anonymity
        also depends on deposits made after yours, which cannot be known in
        advance.
      </p>

      <br />
      <h3 className="mb-2 font-bold text-heading-16">
        Estimated anonymity set by hodling duration
      </h3>
      <p className="mb-4 text-paragraph-15 text-secondary">
        An estimate of how many unique addresses you blend in with, depending on
        how long you leave your deposit in the pool. It is based on historic
        data of past deposits: each point counts the depositors of the preceding
        period, so holding for up to 30 days effectively means blending in with
        everyone who deposited in the last 30 days. Counted over deposits up to{' '}
        {asOf}.
      </p>
      <AnonymitySetChart curves={curves} project={project} />
    </ProjectSection>
  )
}
