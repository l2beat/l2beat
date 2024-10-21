import {
  type DiagramType,
  getDiagramParams,
} from '~/utils/project/get-diagram-params'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { RiskList, type TechnologyRisk } from './risk-list'
import { type ProjectSectionProps } from './types'

export interface MarkdownSectionProps extends ProjectSectionProps {
  diagram?: {
    type: DiagramType
    slug: string
  }
  content: string
  mdClassName?: string
  risks?: TechnologyRisk[]
}

export function MarkdownSection({
  diagram,
  content,
  mdClassName,
  risks,
  ...projectSectionProps
}: MarkdownSectionProps) {
  const diagramParams = diagram
    ? getDiagramParams(diagram.type, diagram.slug)
    : undefined

  return (
    <ProjectSection {...projectSectionProps}>
      {diagramParams ? (
        <figure className="mb-8 mt-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={diagramParams.src}
            alt={diagramParams.caption}
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            {diagramParams.caption}
          </figcaption>
        </figure>
      ) : null}
      <Markdown className={mdClassName}>{content}</Markdown>
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
    </ProjectSection>
  )
}
