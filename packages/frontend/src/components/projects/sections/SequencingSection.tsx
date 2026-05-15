import type { ProjectInclusionDelayChart, ReferenceLink } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { TechnologyRisk } from './RiskList'
import { RiskList } from './RiskList'
import { InclusionDelayChart } from './sequencing/InclusionDelayChart'
import type { ProjectSectionProps } from './types'

export interface SequencingSectionProps extends ProjectSectionProps {
  projectName: string
  name: string
  diagram?: DiagramParams
  content: string
  inclusionDelayChart?: ProjectInclusionDelayChart
  mdClassName?: string
  risks?: TechnologyRisk[]
  references?: ReferenceLink[]
}

export function SequencingSection({
  projectName,
  name,
  diagram,
  content,
  inclusionDelayChart,
  mdClassName,
  risks,
  references,
  ...projectSectionProps
}: SequencingSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      {diagram ? (
        <figure className="mt-4 mb-8 text-center">
          <DiagramImage diagram={diagram} />
          <figcaption className="text-secondary text-xs">
            {diagram.caption}
          </figcaption>
        </figure>
      ) : null}
      <h3 id={name} className="mb-2 font-bold text-lg md:text-xl">
        <a href={`#${name}`}>{name}</a>
      </h3>
      <Markdown
        className={cn(mdClassName, 'text-paragraph-15 md:text-paragraph-16')}
      >
        {content}
      </Markdown>
      {inclusionDelayChart && (
        <>
          <InclusionDelayChart
            chart={inclusionDelayChart}
            projectName={projectName}
          />
          {inclusionDelayChart.afterChart && (
            <Markdown
              className={cn(
                mdClassName,
                'text-paragraph-15 md:text-paragraph-16',
              )}
            >
              {inclusionDelayChart.afterChart}
            </Markdown>
          )}
        </>
      )}
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
      {references && references?.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
