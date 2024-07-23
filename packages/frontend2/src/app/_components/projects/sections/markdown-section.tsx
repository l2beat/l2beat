import {
  type DiagramType,
  getDiagramParams,
} from '~/utils/project/get-diagram-params'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface MarkdownSectionProps extends ProjectSectionProps {
  diagram?: {
    type: DiagramType
    slug: string
  }
  children: string
}

export function MarkdownSection({
  diagram,
  children,
  ...projectSectionProps
}: MarkdownSectionProps) {
  const diagramParams = diagram
    ? getDiagramParams(diagram.type, diagram.slug)
    : undefined

  return (
    <ProjectSection {...projectSectionProps}>
      {diagramParams ? (
        <figure className="mt-4 mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={diagramParams.src}
            alt={diagramParams.caption}
          />
          <figcaption className="text-gray-500 text-xs dark:text-gray-600">
            {diagramParams.caption}
          </figcaption>
        </figure>
      ) : null}
      <Markdown>{children}</Markdown>
    </ProjectSection>
  )
}
