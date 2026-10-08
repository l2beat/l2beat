import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import type { ProjectLink } from '~/components/projects/links/types'
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
} from './markdown'
import {
  type ApiLinks,
  renderProjectSection,
  type SectionBodyOverrides,
} from './renderProjectSection'
import { formatRiskValue, formatRiskWarning } from './renderSectionRiskValues'

/**
 * A project page as markdown, independent of the project kind. A page kind
 * maps its page entry to this shape; the layout and the rendering of the
 * shared page sections live here, so the markdown outline follows the HTML
 * page outline whichever kind renders it.
 */
export interface ProjectMarkdown {
  name: string
  apiLinks: ApiLinks
  /** Site path of the HTML page, which the document's links resolve against. */
  pagePath: string
  summary: {
    warnings: string[]
    facts: ProjectFact[]
    risks: RosetteValue[]
    description: string | undefined
  }
  /** The link bar and badges under the HTML page title. */
  header?: ProjectHeader
  sections: ProjectDetailsSection[]
  sectionBodies?: SectionBodyOverrides
}

export interface ProjectHeader {
  links?: ProjectLink[]
  badges?: ProjectBadge[]
  /** L2BEAT's contract explorer for the project, linked from the HTML header. */
  discoUiHref?: string
}

export interface ProjectBadge {
  name: string
  description?: string
}

export interface ProjectFact {
  label: string
  /** Absent when the fact is only its details. */
  value?: string
  /** Listed under the fact, for values too long for one line. */
  details?: string[]
  /** Caveats on how to read the value; the HTML shows them as a warning icon next to it. */
  warnings?: string[]
}

export function renderProjectMarkdown(page: ProjectMarkdown): string {
  // Production URLs, like the canonical link: the document is meant to be
  // cited, whichever deployment rendered it.
  const pageUrl = PRODUCTION_ORIGIN + page.pagePath
  const markdown = joinBlocks([
    heading(1, page.name),
    `Markdown version of ${pageUrl}`,
    renderSummary(page.summary),
    renderHeader(page.header),
    ...page.sections.map((section) =>
      renderProjectSection(section, 2, {
        apiLinks: page.apiLinks,
        countdowns: PROJECT_COUNTDOWNS,
        sectionBodies: page.sectionBodies,
      }),
    ),
  ])
  return `${absolutizeLinks(markdown, pageUrl)}\n`
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
    subsection(3, 'Risks', bulletList(summary.risks.map(renderSummaryRisk))),
    textSubsection(3, 'About', summary.description),
  ])
}

/** Links and badges read as reference material, so they follow the summary instead of leading it. */
function renderHeader(header: ProjectHeader | undefined): string {
  if (!header) return ''
  const links = [
    ...(header.links ?? []).map(
      (group) => `${group.name}: ${group.links.join(', ')}`,
    ),
    ...(header.discoUiHref
      ? [`Contracts explorer (Disco): ${header.discoUiHref}`]
      : []),
  ]
  return joinBlocks([
    subsection(3, 'Links', bulletList(links)),
    subsection(
      3,
      'Badges',
      bulletList(
        (header.badges ?? []).map((badge) =>
          badge.description
            ? `${badge.name}: ${badge.description}`
            : badge.name,
        ),
      ),
    ),
  ])
}

/** Warnings nest under the fact they qualify, so they cannot be read as applying to the whole project. */
function renderFact(fact: ProjectFact) {
  const head = fact.value ? `${fact.label}: ${fact.value}` : `${fact.label}:`
  const nested = [
    ...(fact.details ?? []),
    ...(fact.warnings ?? []).map(warning),
  ]
  return [head, ...nested.map((item) => `- ${item}`)].join('\n')
}

/** Nested like a fact warning, for the same reason. */
function renderSummaryRisk(risk: RosetteValue) {
  const riskWarning = formatRiskWarning(risk)
  const nested = riskWarning ? `\n- ${riskWarning}` : ''
  return `${risk.name}: ${formatRiskValue(risk)}${nested}`
}
