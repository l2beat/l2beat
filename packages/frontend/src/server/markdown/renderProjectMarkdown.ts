import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import {
  bulletList,
  heading,
  joinBlocks,
  nestHeadings,
  subsection,
  warning,
  withSentiment,
} from './markdown'
import {
  renderProjectSection,
  type SectionContext,
} from './renderProjectSection'

/**
 * A project page as markdown, independent of the project kind. Each page kind
 * (scaling, DA, ZK catalog, interop) maps its page entry to this shape; the
 * layout and the rendering of the shared page sections live here, so the
 * markdown outline follows the HTML page outline for every kind.
 */
export interface ProjectMarkdown extends SectionContext {
  name: string
  summary: {
    warnings: string[]
    facts: { label: string; value: string }[]
    risks: RosetteValue[]
    description: string | undefined
  }
  sections: ProjectDetailsSection[]
}

export function renderProjectMarkdown(page: ProjectMarkdown): string {
  return `${joinBlocks([
    heading(1, page.name),
    `Markdown version of ${page.pageUrl}`,
    renderSummary(page.summary),
    ...page.sections.map((section) => renderProjectSection(section, 2, page)),
  ])}\n`
}

/** The block above the sections on the HTML page: stats, risk rosette and About. */
function renderSummary(summary: ProjectMarkdown['summary']): string {
  return joinBlocks([
    heading(2, 'Summary'),
    ...summary.warnings.map(warning),
    bulletList(summary.facts.map((fact) => `${fact.label}: ${fact.value}`)),
    subsection(
      3,
      'Risks',
      bulletList(
        summary.risks.map(
          (risk) =>
            `${risk.name}: ${withSentiment(risk.value, risk.sentiment)}`,
        ),
      ),
    ),
    subsection(3, 'About', nestHeadings(summary.description ?? '', 4)),
  ])
}
