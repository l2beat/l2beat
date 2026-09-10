import type { ProjectSequencingSpec, ReferenceLink } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import type { InclusionDelayChartProps } from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { TechnologyRisk } from './RiskList'
import { RiskList } from './RiskList'
import { CentralizedSequencingSpecSheet } from './sequencing/CentralizedSequencingSpecSheet'
import { ProjectInclusionDelayChart } from './sequencing/ProjectInclusionDelayChart'
import { SequencerSetSpecSheet } from './sequencing/SequencerSetSpecSheet'
import type { ProjectSectionProps } from './types'

export interface SequencingSectionProps extends ProjectSectionProps {
  projectName: string
  name: string
  diagram?: DiagramParams
  content: string
  sequencingSpec?: ProjectSequencingSpec
  inclusionDelay?: InclusionDelayChartProps
  inclusionDelayChartDescription?: string
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
  sequencingSpec,
  inclusionDelay,
  inclusionDelayChartDescription,
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
      {sequencingSpec?.type === 'sequencer-set' && (
        <SequencerSetSpecSheet spec={sequencingSpec} />
      )}
      {sequencingSpec?.type === 'centralized' && (
        <CentralizedSequencingSpecSheet spec={sequencingSpec} />
      )}
      {inclusionDelay && (
        <>
          <ProjectInclusionDelayChart
            {...inclusionDelay}
            projectName={projectName}
          />
          {inclusionDelayChartDescription && (
            <Markdown
              className={cn(
                mdClassName,
                'text-paragraph-15 md:text-paragraph-16',
              )}
            >
              {inclusionDelayChartDescription}
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
