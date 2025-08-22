import type { ProjectScalingStateValidation } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { HorizontalSeparator } from '../../core/HorizontalSeparator'
import { Markdown } from '../../markdown/Markdown'
import { SectionIncompleteNote } from './contracts/SectionIncompleteNote'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import { RiskList } from './RiskList'
import type { ProjectSectionProps } from './types'

export interface StateValidationSectionProps extends ProjectSectionProps {
  diagram: DiagramParams | undefined
  stateValidation: ProjectScalingStateValidation
  zkCatalogBannerProject?: {
    id: string
    name: string
    icon: string
  }
}

export function StateValidationSection({
  diagram,
  stateValidation,
  zkCatalogBannerProject,
  ...sectionProps
}: StateValidationSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {diagram && (
        <figure className="mt-4 mb-8 text-center">
          <DiagramImage diagram={diagram} />
          <figcaption className="text-secondary text-xs">
            {diagram.caption}
          </figcaption>
        </figure>
      )}
      <div className="flex flex-col gap-6">
        {stateValidation.description && (
          <>
            <Markdown className="text-paragraph-15 md:text-paragraph-16">
              {stateValidation.description}
            </Markdown>
            <HorizontalSeparator />
          </>
        )}
        {stateValidation.categories.map((category) => (
          <Category key={category.title} category={category} />
        ))}
      </div>
      {zkCatalogBannerProject && (
        <ZkCatalogBanner project={zkCatalogBannerProject} />
      )}
    </ProjectSection>
  )
}

type CategoryProps = {
  category: ProjectScalingStateValidation['categories'][number]
}

function Category({ category }: CategoryProps) {
  const risks = category.risks?.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return (
    <div>
      <span className="font-bold text-lg md:text-xl">{category.title}</span>
      {category.isIncomplete && <SectionIncompleteNote />}
      <Markdown className="mt-2 text-paragraph-15 md:text-paragraph-16">
        {category.description}
      </Markdown>
      {risks && <RiskList risks={risks} />}
      {category.references && (
        <ReferenceList references={category.references} tight />
      )}
    </div>
  )
}

function ZkCatalogBanner({
  project,
}: {
  project: {
    id: string
    name: string
    icon: string
  }
}) {
  return (
    <div className="mt-4 flex w-full items-center rounded-lg bg-surface-secondary px-4 py-2 font-medium text-xs md:mt-6">
      <div>
        Learn more about the proof system here:{' '}
        <span className="inline-block">
          <img
            className="mr-1 inline-block size-5"
            src={project.icon}
            width={20}
            height={20}
            alt={`${project.name} logo`}
          />
          <a
            href={`/zk-catalog?highlight=${project.id}`}
            className="inline-block font-medium text-link text-xs underline hover:text-blue-550 dark:hover:text-blue-550"
          >
            {project.name}
          </a>
        </span>
      </div>
    </div>
  )
}
