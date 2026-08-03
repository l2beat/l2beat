import { useState } from 'react'
import type { ChartScale } from '~/components/chart/types'
import type { ChartProject } from '~/components/core/chart/Chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { AnonymitySetChart } from '~/pages/privacy/project/components/AnonymitySetChart'
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
  const [scale, setScale] = useState<ChartScale>('linear')

  return (
    <ProjectSection {...projectSectionProps}>
      <p className="mb-4 text-paragraph-15 text-secondary">
        How many unique addresses you blend in with, depending on how long you
        leave your deposit in the pool. Each point counts the depositors of the
        preceding period, so holding for up to 30 days means blending in with
        everyone who deposited in the last 30 days. {curves.description} Counted
        over deposits up to {formatDate(curves.asOf.slice(0, 10))}.
      </p>
      <AnonymitySetChart curves={curves} scale={scale} project={project} />
      <div className="mt-2 flex items-center justify-end">
        <RadioGroup
          name="anonymitySetScale"
          value={scale}
          onValueChange={(value) => setScale(value as ChartScale)}
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
