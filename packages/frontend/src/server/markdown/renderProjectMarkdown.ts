import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import {
  getUnderReviewText,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import {
  absolutizeLinks,
  bulletList,
  heading,
  joinBlocks,
  nestHeadings,
  subsection,
  warning,
} from './markdown'
import {
  formatRiskValue,
  renderProjectSection,
  type SectionContext,
} from './renderProjectSection'

/**
 * A project page as markdown, independent of the project kind. A page kind
 * maps its page entry to this shape; the layout and the rendering of the
 * shared page sections live here, so the markdown outline follows the HTML
 * page outline whichever kind renders it.
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
  const markdown = joinBlocks([
    heading(1, page.name),
    `Markdown version of ${page.pageUrl}`,
    renderSummary(page.summary),
    ...page.sections.map((section) => renderProjectSection(section, 2, page)),
  ])
  return `${absolutizeLinks(markdown, PRODUCTION_ORIGIN)}\n`
}

/**
 * The lifecycle banners the HTML page shows above the summary: they qualify
 * every figure on the page, so they lead the summary warnings.
 */
export function getProjectStatusWarnings(project: {
  archivedAt?: number
  underReviewStatus?: UnderReviewStatus
}): string[] {
  const warnings: string[] = []
  if (project.archivedAt) {
    warnings.push('This project is archived and no longer maintained.')
  }
  if (project.underReviewStatus) {
    warnings.push(getUnderReviewText(project.underReviewStatus))
  }
  return warnings
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
        summary.risks.map((risk) => `${risk.name}: ${formatRiskValue(risk)}`),
      ),
    ),
    subsection(3, 'About', nestHeadings(summary.description ?? '', 4)),
  ])
}
