import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface MarkdownSectionProps extends ProjectSectionProps {
  children: string
}

export function MarkdownSection({
  children,
  ...projectSectionProps
}: MarkdownSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <Markdown>{children}</Markdown>
    </ProjectSection>
  )
}
