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
  subsection,
  textSubsection,
  warning,
  withSentiment,
} from './markdown'
import {
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
    facts: ProjectFact[]
    risks: RosetteValue[]
    description: string | undefined
  }
  sections: ProjectDetailsSection[]
}

export interface ProjectFact {
  label: string
  value: string
  /** Caveats on how to read the value; the HTML shows them as a warning icon next to it. */
  warnings?: string[]
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
    bulletList(summary.facts.map(renderFact)),
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
    textSubsection(3, 'About', summary.description),
  ])
}

/** Warnings nest under the fact they qualify, so they cannot be read as applying to the whole project. */
function renderFact(fact: ProjectFact) {
  const warnings = (fact.warnings ?? []).map((text) => `\n  - ${warning(text)}`)
  return `${fact.label}: ${fact.value}${warnings.join('')}`
}
