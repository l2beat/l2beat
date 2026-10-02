import type {
  Milestone,
  ProjectRisk,
  ProjectScalingScopeOfAssessment,
  ReferenceLink,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/PermissionsSection'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'
import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import type {
  ProjectDetailsSection,
  ProjectSectionId,
} from '~/components/projects/sections/types'
import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import type { RosetteValue } from '~/components/rosette/types'
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
  subsection,
  textSubsection,
  warning,
  withSentiment,
} from './markdown'
import {
  renderPrivacyAdversaries,
  renderPrivacyAssetsBreakdown,
} from './renderPrivacySections'
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
    typeof section.type
  >

  return joinBlocks([
    heading(level, title),
    renderBody(section.props, level + 1, context),
    renderLinks(context.apiLinks[id] ?? []),
  ])
}

type SectionType = ProjectDetailsSection['type']
type SectionProps<T extends SectionType> = Extract<
  ProjectDetailsSection,
  { type: T }
>['props']
type SectionBody<T extends SectionType> = (
  props: SectionProps<T>,
  subsectionLevel: number,
  context: SectionContext,
) => string

/**
 * Exhaustive, so a new section type fails the build until it gets a markdown
 * body or is explicitly left to the HTML page with `linkToHtmlPage`.
 */
const SECTION_BODIES: { [T in SectionType]: SectionBody<T> } = {
  RiskSummarySection: (props, level) =>
    joinBlocks([
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
      renderWarnings(props.redWarning?.text, props.warning),
      renderRiskValues(props.rosetteValues, level),
    ]),
  L3RiskAnalysisSection: (props, level) =>
    joinBlocks([
      'The L3 risks depend on the individual properties of L3 and those of the host chain combined.',
      renderWarnings(props.redWarning?.text, props.warning),
      props.combined
        ? 'The risks below reflect combined L2 & L3 risks.'
        : 'The risks below reflect individual L3 risks.',
      renderRiskValues(props.combined ?? props.l3.risks, level),
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
  MarkdownSection: (props, level) =>
    joinBlocks([
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
  SequencingSection: (props, level) =>
    joinBlocks([
      heading(level, props.name),
      nestHeadings(props.content, level + 1),
      textSubsection(
        level + 1,
        'Censorship resistance',
        props.censorshipResistance,
      ),
      renderRisks(props.risks ?? []),
      renderReferences(props.references ?? []),
    ]),
  UpgradesAndGovernanceSection: (props, level) =>
    nestHeadings(props.content, level),
  StageSection: (props, level) => {
    const { stageConfig, name } = props
    if (stageConfig.stage === 'UnderReview' || props.isUnderReview) {
      return `${name}'s stage is currently under review.`
    }
    const notEvenAStage0 =
      props.type === 'Other' && !!stageConfig.missing?.requirements
    return joinBlocks([
      renderWarnings(props.emergencyWarning),
      notEvenAStage0
        ? `${name} is not even a ${stageConfig.stage} project.`
        : `${name} is a ${stageConfig.stage} ${props.type}.`,
      renderScopeOfAssessment(props.scopeOfAssessment, level),
      nestHeadings(props.additionalConsiderations?.long, level),
      renderWarnings(stageConfig.message?.text),
      ...stageConfig.summary.map((stage) => {
        const principle = stage.principle && {
          ...stage.principle,
          description: `Principle: ${stage.principle.description}`,
        }
        const requirements = principle
          ? [principle, ...stage.requirements]
          : stage.requirements
        return subsection(
          level,
          stage.stage,
          bulletList(requirements.map(renderRequirement)),
        )
      }),
    ])
  },
  StateValidationSection: ({ stateValidation }, level) =>
    joinBlocks([
      nestHeadings(stateValidation.description, level),
      ...stateValidation.categories.map((category) =>
        joinBlocks([
          heading(level, category.title),
          nestHeadings(category.description, level + 1),
          renderRisks((category.risks ?? []).map(toTechnologyRisk)),
          renderReferences(category.references ?? []),
        ]),
      ),
    ]),
  TechnologyChoicesSection: ({ items }, level) =>
    joinBlocks(
      items.map((item) =>
        joinBlocks([
          heading(level, item.name),
          ...(item.isUnderReview
            ? ['This section is under review.']
            : [
                item.isIncomplete ? INCOMPLETE_NOTE : '',
                nestHeadings(item.description, level + 1),
                renderRisks(item.risks),
              ]),
          renderReferences(item.references),
        ]),
      ),
    ),
  PermissionsSection: ({ permissionsByChain, permissionedEntities }, level) =>
    joinBlocks([
      renderCommitteeMembers(permissionedEntities ?? []),
      ...Object.entries(permissionsByChain).map(([chain, permissions]) =>
        subsection(
          level,
          chain,
          joinBlocks([
            renderContracts(level + 1, 'Roles', permissions.roles),
            renderContracts(level + 1, 'Actors', permissions.actors),
          ]),
        ),
      ),
    ]),
  ContractsSection: (props, level) =>
    joinBlocks([
      ...Object.entries(props.contracts).map(([chain, contracts]) =>
        renderContracts(level, chain, contracts),
      ),
      renderRisks(
        props.risks,
        'The current deployment carries some associated risks:',
      ),
    ]),
  ActivitySection: linkToHtmlPage,
  CostsSection: linkToHtmlPage,
  DataPostedSection: linkToHtmlPage,
  DefiTvlSection: linkToHtmlPage,
  GardenCropsSection: linkToHtmlPage,
  InteropFlowsSection: linkToHtmlPage,
  InteropTokenOnchainDeploymentsSection: renderOnchainDeployments,
  InteropTokenProtocolsSection: linkToHtmlPage,
  InteropTokenTransfersSection: linkToHtmlPage,
  InteropTokenVolumeSection: linkToHtmlPage,
  InteropTokensSection: linkToHtmlPage,
  InteropTransfersSection: linkToHtmlPage,
  InteropVolumeSection: (props, level, context) =>
    renderInteropVolumeSection(props, level, `${context.pageUrl}#${props.id}`),
  L2TvsSection: linkToHtmlPage,
  LivenessSection: linkToHtmlPage,
  PrivacyAdversariesSection: renderPrivacyAdversaries,
  PrivacyAnonymitySetSection: linkToHtmlPage,
  PrivacyAssetsBreakdownSection: renderPrivacyAssetsBreakdown,
  PrivacyFlowsSection: linkToHtmlPage,
  ProgramHashesSection: renderProgramHashes,
  ThroughputSection: linkToHtmlPage,
  TrustedSetupSection: renderTrustedSetups,
  TvsValueSection: linkToHtmlPage,
  UpdatesSection: linkToHtmlPage,
  VerifiersSection: renderVerifiers,
  ZkCatalogTvsSection: linkToHtmlPage,
}

/** For charts and interactive widgets, which markdown cannot express. */
function linkToHtmlPage(
  props: { id: ProjectSectionId },
  _level: number,
  context: SectionContext,
) {
  return `Shown as an interactive chart or widget on ${link('the HTML page', `${context.pageUrl}#${props.id}`)}.`
}

function renderContracts(
  level: number,
  title: string,
  contracts: TechnologyContract[],
) {
  return subsection(
    level,
    title,
    joinBlocks(contracts.map((entry) => renderContract(entry, level + 1))),
  )
}

/** A contract or a permissioned role/actor, as the HTML contract entry shows it. */
function renderContract(entry: TechnologyContract, level: number) {
  const upgradeableBy = entry.upgradeableBy ?? []
  return joinBlocks([
    heading(level, entry.name),
    `Addresses: ${[...entry.addresses, ...entry.admins].map(renderContractAddress).join(', ')}`,
    nestHeadings(entry.description, level + 1),
    upgradeableBy.length > 0
      ? `Can be upgraded by: ${upgradeableBy.map((actor) => `${actor.name} with ${actor.delay} delay`).join(', ')}`
      : '',
    entry.upgradeDelay ? `Upgrade delay: ${entry.upgradeDelay}` : '',
    renderReferences(entry.references),
  ])
}

/** Unnamed addresses carry a shortened address as their name, which adds nothing next to the full one. */
function renderContractAddress(address: TechnologyContractAddress) {
  const notes = [
    !address.name.includes('…') && address.name,
    address.verificationStatus === 'unverified' && 'unverified',
  ].filter(Boolean)
  const suffix = notes.length > 0 ? ` (${notes.join(', ')})` : ''
  return `${link(address.address, address.href)}${suffix}`
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

/** Without it, the stage would read as covering components L2BEAT did not assess. */
function renderScopeOfAssessment(
  scope: ProjectScalingScopeOfAssessment | undefined,
  level: number,
) {
  return subsection(
    level,
    'Scope of assessment',
    joinBlocks([
      subsection(level + 1, 'In scope', bulletList(scope?.inScope ?? [])),
      subsection(
        level + 1,
        'Not in scope',
        bulletList(scope?.notInScope ?? []),
      ),
    ]),
  )
}

const INCOMPLETE_NOTE =
  '**Note:** This section requires more research and might not present accurate information.'

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
    ? link(dependency.name, new URL(dependency.href, pageUrl).href)
    : dependency.name
  const notReviewed = dependency.reviewed ? '' : ' (not reviewed)'
  return `${name}${notReviewed}: ${dependency.description}`
}

function renderRiskValues(values: RosetteValue[], level: number) {
  return joinBlocks(
    values.map((risk) =>
      joinBlocks([
        heading(level, risk.name),
        withSentiment(risk.value, risk.sentiment),
        nestHeadings(risk.description, level + 1),
      ]),
    ),
  )
}

type PermissionedEntity = NonNullable<
  PermissionsSectionProps['permissionedEntities']
>[number]

/** Known DA committee members, which the HTML page lists above the permissions. */
function renderCommitteeMembers(members: PermissionedEntity[]) {
  if (members.length === 0) return ''
  return joinBlocks([
    'The DA committee has the following members:',
    bulletList(
      members.map((member) => {
        const key = member.key ? ` (key: ${member.key})` : ''
        return `${link(member.name, member.href)}${key}`
      }),
    ),
  ])
}

function renderMilestone(milestone: Milestone) {
  const date = milestone.date.slice(0, 'YYYY-MM-DD'.length)
  const kind = milestone.type === 'incident' ? ' (incident)' : ''
  const description = milestone.description ? ` ${milestone.description}` : ''
  return `${date}${kind}: ${link(milestone.title, milestone.url)}.${description}`
}

function renderRisks(risks: TechnologyRisk[], lead = '**Risks**') {
  if (risks.length === 0) return ''
  return joinBlocks([
    lead,
    bulletList(risks.map((risk) => markCritical(risk.text, risk.isCritical))),
  ])
}

function toTechnologyRisk(risk: ProjectRisk): TechnologyRisk {
  return {
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }
}

function renderReferences(references: ReferenceLink[]) {
  if (references.length === 0) return ''
  return joinBlocks(['**References**', renderLinks(references)])
}

function renderLinks(links: ReferenceLink[]) {
  return bulletList(links.map((entry) => link(entry.title, entry.url)))
}

function renderRequirement(requirement: {
  satisfied: boolean | 'UnderReview'
  description: string
  upcoming?: boolean
}) {
  const box = requirement.satisfied === true ? '[x]' : '[ ]'
  const status = [
    requirement.satisfied === 'UnderReview' && '(under review)',
    requirement.upcoming && '(upcoming)',
  ].filter(Boolean)
  return [box, ...status, requirement.description].join(' ')
}

function renderWarnings(...texts: (string | undefined)[]) {
  return joinBlocks(texts.flatMap((text) => (text ? [warning(text)] : [])))
}
