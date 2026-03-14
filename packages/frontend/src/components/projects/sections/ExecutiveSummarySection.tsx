import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ExecutiveSummarySectionProps extends ProjectSectionProps {
  content: string
}

export function ExecutiveSummarySection({
  content,
  ...sectionProps
}: ExecutiveSummarySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <div className="mt-4 text-paragraph-15 md:text-paragraph-16">
        <Markdown className="mt-2">{content}</Markdown>
      </div>
    </ProjectSection>
  )
}
