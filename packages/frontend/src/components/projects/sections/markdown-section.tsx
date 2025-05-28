import type { ReferenceLink } from '@l2beat/config'
import type { DiagramParams } from 'rewrite/src/utils/project/get-diagram-params'
import { DiagramImage } from '~/comp~/utils/project/get-diagram-params
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { ReferenceList } from './reference-list'
import type { TechnologyRisk } from './risk-list'
import { RiskList } from './risk-list'
import type { ProjectSectionProps } from './types'

export interface MarkdownSectionProps extends ProjectSectionProps {
  diagram?: DiagramParams
  content: string
  mdClassName?: string
  risks?: TechnologyRisk[]
  references?: ReferenceLink[]
}

export function MarkdownSection({
  diagram,
  content,
  mdClassName,
  risks,
  references,
  ...projectSectionProps
}: MarkdownSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      {diagram ? (
        <figure className="mb-8 mt-4 text-center">
          <DiagramImage diagram={diagram} />
          <figcaption className="text-xs text-secondary">
            {diagram.caption}
          </figcaption>
        </figure>
      ) : null}
      <Markdown className={mdClassName}>{content}</Markdown>
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
      {references && references?.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
