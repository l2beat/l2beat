import type {
  Milestone,
  PROJECT_COUNTDOWNS,
  ReferenceLink,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import {
  L3_RISKS_DESCRIPTION,
  NO_EXTERNAL_DEPENDENCIES,
} from '~/components/projects/sections/sectionCopy'
import type {
  ProjectDetailsSection,
  ProjectSectionId,
} from '~/components/projects/sections/types'
import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import type { DefiDependency } from '~/server/features/defi/resolveDefiDependencies'
import type { UnverifiedContractEntry } from '~/utils/project/contracts-and-permissions/getUnverifiedContractEntries'
import { configMarkdown } from './configMarkdown'
import { renderInteropVolumeSection } from './interopMarkdown'
import { renderOnchainDeployments } from './interopTokenMarkdown'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  markCritical,
  numberedList,
  subsection,
  textSubsection,
  warning,
} from './markdown'
import {
  renderContractsSection,
  renderPermissionsSection,
} from './renderContractsSections'
import {
  renderPrivacyAdversaries,
  renderPrivacyAssetsBreakdown,
} from './renderPrivacySections'
import {
  pointToHtmlPage,
  renderActivitySection,
  renderCostsSection,
  renderDataPostedSection,
  renderL2TvsSection,
  renderLivenessSection,
  renderPrivacyAnonymitySetSection,
} from './renderSectionCharts'
import { renderGardenCropsSection } from './renderSectionCrops'
import { renderUpgradesAndGovernance } from './renderSectionGovernance'
import {
  INCOMPLETE_NOTE,
  renderDiagram,
  renderHostChainWarning,
  renderLinks,
  renderReferences,
  renderRelatedProjectBanner,
  renderRisks,
  renderWarnings,
  UNDER_REVIEW_NOTE,
} from './renderSectionParts'
import {
  isAnyRiskUnderReview,
  renderL3RiskValues,
  renderRiskValues,
} from './renderSectionRiskValues'
import { renderSequencing } from './renderSectionSequencing'
import { renderStageSection } from './renderSectionStage'
import { renderStateValidation } from './renderSectionStateValidation'
import { renderUpdatesSection } from './renderSectionUpdates'
import {
  renderProgramHashes,
  renderTrustedSetups,
  renderVerifiers,
} from './zkSectionBodies'

export interface SectionContext {
  /** JSON API endpoints serving the data behind a section, keyed by section id. */
  apiLinks: ApiLinks
  /** The dates the HTML reads from its countdowns context, which change what some sections show. */
  countdowns: typeof PROJECT_COUNTDOWNS
  /** For sections whose HTML reads page data instead of its props, so only the page can render them. */
  sectionBodies?: SectionBodyOverrides
}

export type ApiLinks = Partial<Record<ProjectSectionId, ReferenceLink[]>>

export function renderProjectSection(
  section: ProjectDetailsSection,
  level: number,
  context: SectionContext,
): string {
  const { id, title } = section.props
  const renderBody = (context.sectionBodies?.[section.type] ??
    SECTION_BODIES[section.type]) as SectionBody<typeof section.props>
  const isUnderReview = isSectionUnderReview(section)
  const hidesBody =
    isUnderReview &&
    'hideChildrenIfUnderReview' in section.props &&
    !!section.props.hideChildrenIfUnderReview
  const body = hidesBody ? '' : renderBody(section.props, level + 1, context)

  return joinBlocks([
    heading(level, title),
    isUnderReview ? UNDER_REVIEW_NOTE : '',
    body || (isUnderReview ? '' : NO_INFORMATION),
    renderLinks(context.apiLinks[id] ?? []),
  ])
}

/** A heading with nothing under it would read as a rendering bug. */
const NO_INFORMATION = 'No information.'

/** Risk sections are under review on the HTML page as soon as one of their values is. */
function isSectionUnderReview(section: ProjectDetailsSection) {
  if (section.props.isUnderReview) return true
  switch (section.type) {
    case 'RiskAnalysisSection':
      return isAnyRiskUnderReview(section.props.rosetteValues)
    case 'L3RiskAnalysisSection':
      return isAnyRiskUnderReview([
        ...section.props.l2.risks,
        ...section.props.l3.risks,
      ])
    case 'GrissiniRiskAnalysisSection':
      return isAnyRiskUnderReview([
        ...(section.props.layerGrissiniValues ?? []),
        ...(section.props.bridgeGrissiniValues ?? []),
      ])
    case 'StageSection':
      return section.props.stageConfig.stage === 'UnderReview'
    default:
      return false
  }
}

type SectionType = ProjectDetailsSection['type']
type SectionProps<T extends SectionType> = Extract<
  ProjectDetailsSection,
  { type: T }
>['props']
/** Renders what goes under a section heading; `level` is the heading level of its subsections. */
export type SectionBody<Props> = (
  props: Props,
  level: number,
  context: SectionContext,
) => string

export type SectionBodyOverrides = {
  [T in SectionType]?: SectionBody<SectionProps<T>>
}

/**
 * Exhaustive, so a new section type fails the build until it gets a markdown
 * body or is explicitly left to the HTML page with `pointToHtmlPage`.
 */
const SECTION_BODIES: { [T in SectionType]: SectionBody<SectionProps<T>> } = {
  RiskSummarySection: (props, level) =>
    joinBlocks([
      renderHostChainWarning(props.hostChainWarning),
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(
        props.verificationWarnings.programHashes &&
          critical(props.verificationWarnings.programHashes),
        props.redWarning?.text,
        props.warning,
      ),
      renderRiskGroups(props.riskGroups, level),
    ]),
  RiskAnalysisSection: (props, level) =>
    joinBlocks([
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(props.redWarning?.text, props.warning),
      renderRiskValues(props.rosetteValues, level),
    ]),
  L3RiskAnalysisSection: (props, level) =>
    joinBlocks([
      L3_RISKS_DESCRIPTION,
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(props.redWarning?.text, props.warning),
      renderL3RiskValues(props, level),
    ]),
  GrissiniRiskAnalysisSection: (props, level) =>
    joinBlocks([
      configMarkdown(props.description, level),
      renderRiskValues(props.layerGrissiniValues ?? [], level),
      renderRiskValues(props.bridgeGrissiniValues ?? [], level),
      props.isNoBridge ? renderRiskValues([NO_BRIDGE_RISK], level) : '',
    ]),
  Group: (props, level, context) =>
    joinBlocks([
      configMarkdown(props.description, level),
      ...props.items.map((item) => renderProjectSection(item, level, context)),
    ]),
  MarkdownSection: (props, level) =>
    joinBlocks([
      renderDiagram(props.diagram),
      configMarkdown(props.content, level),
      renderRisks(props.risks ?? []),
      renderReferences(props.references ?? []),
    ]),
  DetailedDescriptionSection: (props, level) =>
    joinBlocks([
      configMarkdown(props.description, level),
      configMarkdown(props.detailedDescription, level),
      renderReferences(props.references ?? []),
    ]),
  ExternalDependenciesSection: ({ dependencies }) =>
    dependencies.length === 0
      ? NO_EXTERNAL_DEPENDENCIES
      : bulletList(
          dependencies.map((dependency) => renderDependency(dependency)),
        ),
  MilestonesAndIncidentsSection: ({ milestones }) =>
    bulletList(milestones.map(renderMilestone)),
  StateDerivationSection: (props, level) =>
    joinBlocks(
      (
        [
          ['Node software', props.nodeSoftware],
          ['Compression scheme', props.compressionScheme],
          ['Genesis state', props.genesisState],
          ['Data format', props.dataFormat],
        ] as const
      ).map(([title, text]) => textSubsection(level, title, text)),
    ),
  SequencingSection: renderSequencing,
  UpgradesAndGovernanceSection: renderUpgradesAndGovernance,
  StageSection: renderStageSection,
  StateValidationSection: renderStateValidation,
  TechnologyChoicesSection: ({ items, hostChainWarning }, level) =>
    joinBlocks([
      renderHostChainWarning(hostChainWarning),
      ...items.map((item) =>
        joinBlocks([
          heading(level, item.name),
          item.isIncomplete ? INCOMPLETE_NOTE : '',
          ...(item.isUnderReview
            ? [UNDER_REVIEW_NOTE]
            : [
                configMarkdown(item.description, level + 1),
                renderRisks(item.risks),
                renderReferences(item.references),
              ]),
          item.relatedProjectBanner
            ? renderRelatedProjectBanner(item.relatedProjectBanner)
            : '',
        ]),
      ),
    ]),
  PermissionsSection: renderPermissionsSection,
  ContractsSection: renderContractsSection,
  ActivitySection: renderActivitySection,
  CostsSection: renderCostsSection,
  DataPostedSection: renderDataPostedSection,
  DefiTvlSection: pointToHtmlPage('The interactive TVL chart is shown'),
  GardenCropsSection: renderGardenCropsSection,
  InteropFlowsSection: pointToHtmlPage('The interactive flows chart is shown'),
  InteropTokenOnchainDeploymentsSection: renderOnchainDeployments,
  InteropTokenProtocolsSection: pointToHtmlPage(
    'The interactive protocols table is shown',
  ),
  InteropTokenTransfersSection: pointToHtmlPage(
    'The interactive transfers table is shown',
  ),
  InteropTokenVolumeSection: pointToHtmlPage(
    'The interactive volume chart is shown',
  ),
  InteropTokensSection: pointToHtmlPage(
    'The interactive tokens table is shown',
  ),
  InteropTransfersSection: pointToHtmlPage(
    'The interactive transfers table is shown',
  ),
  InteropVolumeSection: renderInteropVolumeSection,
  L2TvsSection: renderL2TvsSection,
  LivenessSection: renderLivenessSection,
  PrivacyAdversariesSection: renderPrivacyAdversaries,
  PrivacyAnonymitySetSection: renderPrivacyAnonymitySetSection,
  PrivacyAssetsBreakdownSection: renderPrivacyAssetsBreakdown,
  PrivacyFlowsSection: pointToHtmlPage('The interactive flows chart is shown'),
  ProgramHashesSection: renderProgramHashes,
  TrustedSetupSection: renderTrustedSetups,
  TvsValueSection: pointToHtmlPage('The interactive value chart is shown'),
  UpdatesSection: renderUpdatesSection,
  VerifiersSection: renderVerifiers,
  ZkCatalogTvsSection: pointToHtmlPage('The interactive TVS chart is shown'),
}

function critical(text: string) {
  return markCritical(text, true)
}

/** The HTML lists them collapsed behind a count; markdown has no collapsing, so all are listed. */
function renderUnverifiedContracts(entries: UnverifiedContractEntry[]) {
  if (entries.length === 0) return ''
  const subject = entries.length === 1 ? 'address has' : 'addresses have'
  return joinBlocks([
    warning(critical(`${entries.length} ${subject} unverified source code.`)),
    bulletList(
      entries.map((entry) => {
        const address = ChainSpecificAddress.address(entry.address)
        const label = entry.target?.label
        return label ? `${label}: ${address}` : address
      }),
    ),
  ])
}

function renderRiskGroups(groups: RiskGroup[], level: number) {
  return joinBlocks(
    groups.map((group) =>
      subsection(
        level,
        group.name,
        numberedList(
          group.items.map((item) => markCritical(item.text, item.isCritical)),
          group.start,
        ),
      ),
    ),
  )
}

function renderDependency(dependency: DefiDependency) {
  const name = dependency.href
    ? link(dependency.name, dependency.href)
    : dependency.name
  const notReviewed = dependency.reviewed ? '' : ' (not reviewed)'
  return `${name}${notReviewed}: ${dependency.description}`
}

function renderMilestone(milestone: Milestone) {
  const date = milestone.date.slice(0, 'YYYY-MM-DD'.length)
  const kind = milestone.type === 'incident' ? ' (incident)' : ''
  const description = milestone.description ? ` ${milestone.description}` : ''
  return `${date}${kind}: ${link(milestone.title, milestone.url)}.${description}`
}
