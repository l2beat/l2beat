import { type ScalingProjectStateValidation } from '@l2beat/config'
import { type DiagramParams } from '~/utils/project/get-diagram-params'
import { HorizontalSeparator } from '../../horizontal-separator'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { ReferenceList } from './reference-list'
import { RiskList } from './risk-list'
import { type ProjectSectionProps } from './types'

export interface StateValidationSectionProps extends ProjectSectionProps {
  diagram: DiagramParams | undefined
  stateValidation: ScalingProjectStateValidation
}

export function StateValidationSection({
  diagram,
  stateValidation,
  ...sectionProps
}: StateValidationSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {diagram && (
        <figure className="mb-8 mt-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={diagram.src}
            alt={diagram.caption}
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            {diagram.caption}
          </figcaption>
        </figure>
      )}
      <div className="flex flex-col gap-6">
        <Markdown className="leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
          {stateValidation.description}
        </Markdown>
        <HorizontalSeparator />
        {stateValidation.categories.map((category) => (
          <Category key={category.title} category={category} />
        ))}
      </div>
    </ProjectSection>
  )
}

type CategoryProps = {
  category: ScalingProjectStateValidation['categories'][number]
}

function Category({ category }: CategoryProps) {
  const risks = category.risks?.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return (
    <div>
      <span className="text-lg font-bold uppercase md:text-xl">
        {category.title}
      </span>
      <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
        {category.description}
      </Markdown>
      {risks && <RiskList risks={risks} />}
      {category.references && (
        <ReferenceList references={category.references} tight />
      )}
    </div>
  )
}
