import type { Milestone, ReferenceLink } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import type {
  ProjectDetailsSection,
  ProjectSectionId,
} from '~/components/projects/sections/types'
import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import type { DefiDependency } from '~/server/features/defi/resolveDefiDependencies'
import type { UnverifiedContractEntry } from '~/utils/project/contracts-and-permissions/getUnverifiedContractEntries'
import { renderInteropVolumeSection } from './interopMarkdown'
import { renderOnchainDeployments } from './interopTokenMarkdown'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  markCritical,
  nestHeadings,
  numberedList,
  resolveSiteUrl,
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
  renderThroughputSection,
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
  /** Absolute URL of the HTML page, for sections markdown cannot express. */
  pageUrl: string
  /** JSON API endpoints serving the data behind a section, keyed by section id. */
  apiLinks: Partial<Record<ProjectSectionId, ReferenceLink[]>>
}

export function renderProjectSection(
  section: ProjectDetailsSection,
  level: number,
  context: SectionContext,
): string {
  const { id, title } = section.props
  const renderBody = SECTION_BODIES[section.type] as SectionBody<
    typeof section.props
  >
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

/**
 * Exhaustive, so a new section type fails the build until it gets a markdown
 * body or is explicitly left to the HTML page with `pointToHtmlPage`.
 */
const SECTION_BODIES: { [T in SectionType]: SectionBody<SectionProps<T>> } = {
  RiskSummarySection: (props, level, context) =>
    joinBlocks([
      renderHostChainWarning(props.hostChainWarning, context.pageUrl),
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(
        props.verificationWarnings.programHashes &&
          markCritical(props.verificationWarnings.programHashes, true),
        props.redWarning?.text,
        props.warning,
      ),
      renderRiskGroups(props.riskGroups, level),
    ]),
  DaRiskSummarySection: (props, level) => {
    const { layer, bridge } = props
    const bridgeTitle = `${bridge.name}${bridge.name === layer.name ? ' bridge' : ''} risks`
    return joinBlocks([
      renderWarnings(
        props.isVerified === false
          ? markCritical('This project includes unverified contracts.', true)
          : undefined,
        props.redWarning?.text,
        props.warning,
      ),
      subsection(
        level,
        `${layer.name} risks`,
        renderRiskGroups(layer.risks, level + 1),
      ),
      bridge.risks.length > 0
        ? subsection(
            level,
            bridgeTitle,
            joinBlocks([
              renderWarnings(
                bridge.isVerified
                  ? undefined
                  : markCritical(
                      'This bridge includes unverified contracts.',
                      true,
                    ),
              ),
              renderRiskGroups(bridge.risks, level + 1),
            ]),
          )
        : '',
    ])
  },
  RiskAnalysisSection: (props, level) =>
    joinBlocks([
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(props.redWarning?.text, props.warning),
      renderRiskValues(props.rosetteValues, level),
    ]),
  L3RiskAnalysisSection: (props, level) =>
    joinBlocks([
      'The L3 risks depend on the individual properties of L3 and those of the host chain combined.',
      renderUnverifiedContracts(props.unverifiedContracts),
      renderWarnings(props.redWarning?.text, props.warning),
      renderL3RiskValues(props, level),
    ]),
  GrissiniRiskAnalysisSection: (props, level) =>
    joinBlocks([
      nestHeadings(props.description, level),
      renderRiskValues(props.layerGrissiniValues ?? [], level),
      renderRiskValues(props.bridgeGrissiniValues ?? [], level),
      props.isNoBridge ? renderRiskValues([NO_BRIDGE_RISK], level) : '',
    ]),
  Group: (props, level, context) =>
    joinBlocks([
      nestHeadings(props.description, level),
      ...props.items.map((item) => renderProjectSection(item, level, context)),
    ]),
  MarkdownSection: (props, level, context) =>
    joinBlocks([
      renderDiagram(props.diagram, context.pageUrl),
      nestHeadings(props.content, level),
      renderRisks(props.risks ?? []),
      renderReferences(props.references ?? []),
    ]),
  DetailedDescriptionSection: (props, level) =>
    joinBlocks([
      nestHeadings(props.description, level),
      nestHeadings(props.detailedDescription, level),
      renderReferences(props.references ?? []),
    ]),
  ExternalDependenciesSection: ({ dependencies }, _level, context) =>
    dependencies.length === 0
      ? 'This project has no external dependencies: no oracle, bridge, or other third-party contract is required for its contracts to operate.'
      : bulletList(
          dependencies.map((dependency) =>
            renderDependency(dependency, context.pageUrl),
          ),
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
  TechnologyChoicesSection: ({ items, hostChainWarning }, level, context) =>
    joinBlocks([
      renderHostChainWarning(hostChainWarning, context.pageUrl),
      ...items.map((item) =>
        joinBlocks([
          heading(level, item.name),
          item.isIncomplete ? INCOMPLETE_NOTE : '',
          ...(item.isUnderReview
            ? [UNDER_REVIEW_NOTE]
            : [
                nestHeadings(item.description, level + 1),
                renderRisks(item.risks),
                renderReferences(item.references),
              ]),
          item.relatedProjectBanner
            ? renderRelatedProjectBanner(
                item.relatedProjectBanner,
                context.pageUrl,
              )
            : '',
        ]),
      ),
    ]),
  PermissionsSection: renderPermissionsSection,
  ContractsSection: renderContractsSection,
  ActivitySection: renderActivitySection,
  CostsSection: renderCostsSection,
  DataPostedSection: renderDataPostedSection,
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
  InteropVolumeSection: (props, level, context) =>
    renderInteropVolumeSection(props, level, `${context.pageUrl}#${props.id}`),
  L2TvsSection: renderL2TvsSection,
  LivenessSection: renderLivenessSection,
  PrivacyAdversariesSection: renderPrivacyAdversaries,
  PrivacyAnonymitySetSection: renderPrivacyAnonymitySetSection,
  PrivacyAssetsBreakdownSection: renderPrivacyAssetsBreakdown,
  PrivacyFlowsSection: pointToHtmlPage('The interactive flows chart is shown'),
  ProgramHashesSection: renderProgramHashes,
  ThroughputSection: renderThroughputSection,
  TrustedSetupSection: renderTrustedSetups,
  TvsValueSection: pointToHtmlPage('The interactive value chart is shown'),
  UpdatesSection: renderUpdatesSection,
  VerifiersSection: renderVerifiers,
  ZkCatalogTvsSection: pointToHtmlPage('The interactive TVS chart is shown'),
}

/** The HTML lists them collapsed behind a count; markdown has no collapsing, so all are listed. */
function renderUnverifiedContracts(entries: UnverifiedContractEntry[]) {
  if (entries.length === 0) return ''
  const subject = entries.length === 1 ? 'address has' : 'addresses have'
  return joinBlocks([
    warning(
      markCritical(
        `${entries.length} ${subject} unverified source code.`,
        true,
      ),
    ),
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

/** Project links on the HTML page are site-relative; the markdown is read off-site. */
function renderDependency(dependency: DefiDependency, pageUrl: string) {
  const name = dependency.href
    ? link(dependency.name, resolveSiteUrl(dependency.href, pageUrl))
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
