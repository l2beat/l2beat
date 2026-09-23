import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import {
  bulletList,
  heading,
  joinBlocks,
  nestHeadings,
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
export interface ProjectMarkdown {
  name: string
  /** Absolute URL of the HTML page. */
  pageUrl: string
  summary: {
    warnings: string[]
    facts: { label: string; value: string }[]
    risks: RosetteValue[]
    description: string | undefined
  }
  sections: ProjectDetailsSection[]
  /** JSON API endpoints serving the data behind a section, keyed by section id. */
  apiLinks: SectionContext['apiLinks']
}

export function renderProjectMarkdown(page: ProjectMarkdown): string {
  const context = { pageUrl: page.pageUrl, apiLinks: page.apiLinks }
  return `${joinBlocks([
    heading(1, page.name),
    `Markdown version of ${page.pageUrl}`,
    renderSummary(page.summary),
    ...page.sections.map((section) =>
      renderProjectSection(section, 2, context),
    ),
  ])}\n`
}

/** The block above the sections on the HTML page: stats, risk rosette and About. */
function renderSummary(summary: ProjectMarkdown['summary']): string {
  return joinBlocks([
    heading(2, 'Summary'),
    ...summary.warnings.map(warning),
    bulletList(summary.facts.map((fact) => `${fact.label}: ${fact.value}`)),
    ...(summary.risks.length > 0
      ? [
          heading(3, 'Risks'),
          bulletList(
            summary.risks.map(
              (risk) =>
                `${risk.name}: ${withSentiment(risk.value, risk.sentiment)}`,
            ),
          ),
        ]
      : []),
    ...(summary.description
      ? [heading(3, 'About'), nestHeadings(summary.description, 4)]
      : []),
  ])
}
