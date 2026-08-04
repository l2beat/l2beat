import { useState } from 'react'
import type { ChartScale } from '~/components/chart/types'
import type { ChartProject } from '~/components/core/chart/Chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { AnonymitySetChart } from '~/pages/privacy/project/components/AnonymitySetChart'
import { AnonymitySetHistoryChart } from '~/pages/privacy/project/components/AnonymitySetHistoryChart'
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatDate } from '~/utils/dates'
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
  const [curveScale, setCurveScale] = useState<ChartScale>('linear')
  const [historyScale, setHistoryScale] = useState<ChartScale>('linear')

  const asOf = formatDate(curves.asOf.slice(0, 10))

  return (
    <ProjectSection {...projectSectionProps}>
      <h3 className="mb-2 font-bold text-heading-16">By holding duration</h3>
      <p className="mb-4 text-paragraph-15 text-secondary">
        How many unique addresses you blend in with, depending on how long you
        leave your deposit in the pool. Each point counts the depositors of the
        preceding period, so holding for up to 30 days means blending in with
        everyone who deposited in the last 30 days. {curves.description} Counted
        over deposits up to {asOf}.
      </p>
      <AnonymitySetChart curves={curves} scale={curveScale} project={project} />
      <div className="mt-2 flex items-center justify-end">
        <RadioGroup
          name="anonymitySetScale"
          value={curveScale}
          onValueChange={(value) => setCurveScale(value as ChartScale)}
        >
          <RadioGroupItem value="symlog">LOG</RadioGroupItem>
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
        </RadioGroup>
      </div>

      <h3 className="mt-8 mb-2 font-bold text-heading-16">
        {curves.historyWindowDays} day anonymity set over time
      </h3>
      <p className="mb-4 text-paragraph-15 text-secondary">
        The same {curves.historyWindowDays} day measurement, taken on every day
        of the year up to {asOf}: how large a crowd you would have blended into
        had you withdrawn on that day, after holding for up to{' '}
        {curves.historyWindowDays} days. It shows whether a pool is drawing more
        depositors over time or emptying out - its last point is the{' '}
        {curves.historyWindowDays} day mark of the chart above.
      </p>
      <AnonymitySetHistoryChart
        curves={curves}
        scale={historyScale}
        project={project}
      />
      <div className="mt-2 flex items-center justify-end">
        <RadioGroup
          name="anonymitySetHistoryScale"
          value={historyScale}
          onValueChange={(value) => setHistoryScale(value as ChartScale)}
        >
          <RadioGroupItem value="symlog">LOG</RadioGroupItem>
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
        </RadioGroup>
      </div>

      <p className="mt-4 text-paragraph-13 text-secondary">
        The metric looks backwards: it counts deposits that already happened,
        including from addresses that have since withdrawn. Your real anonymity
        also depends on deposits made after yours, which cannot be known in
        advance.
      </p>
    </ProjectSection>
  )
}
