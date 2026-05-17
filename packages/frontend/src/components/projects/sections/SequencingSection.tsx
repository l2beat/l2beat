import type {
  ProjectInclusionDelayChart,
  ProjectSequencerSetSpec,
  ReferenceLink,
} from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { TechnologyRisk } from './RiskList'
import { RiskList } from './RiskList'
import { InclusionDelayChart } from './sequencing/InclusionDelayChart'
import { SequencerSetSpecSheet } from './sequencing/SequencerSetSpecSheet'
import type { ProjectSectionProps } from './types'

export interface SequencingSectionProps extends ProjectSectionProps {
  projectName: string
  name: string
  diagram?: DiagramParams
  content: string
  sequencerSetSpec?: ProjectSequencerSetSpec
  inclusionDelayChart?: ProjectInclusionDelayChart
  censorshipResistance?: string
  mdClassName?: string
  risks?: TechnologyRisk[]
  references?: ReferenceLink[]
}

export function SequencingSection({
  projectName,
  name,
  diagram,
  content,
  sequencerSetSpec,
  inclusionDelayChart,
  censorshipResistance,
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
      {sequencerSetSpec && (
        <SequencerSetSpecSheet
          spec={sequencerSetSpec}
          chart={inclusionDelayChart}
        />
      )}
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
      {censorshipResistance && (
        <div className="mt-6">
          <h4 className="mb-3 font-bold text-heading-20">
            Censorship resistance
          </h4>
          <Markdown
            className={cn(
              mdClassName,
              'sequencing-censorship-resistance text-paragraph-15 md:text-paragraph-16',
            )}
          >
            {censorshipResistance}
          </Markdown>
        </div>
      )}
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
      {references && references?.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
