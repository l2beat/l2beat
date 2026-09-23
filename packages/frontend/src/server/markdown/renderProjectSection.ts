import type { Milestone, ProjectRisk, ReferenceLink } from '@l2beat/config'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'
import type {
  ProjectDetailsSection,
  ProjectSectionId,
} from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  markCritical,
  nestHeadings,
  numberedList,
  warning,
  withSentiment,
} from './markdown'

export interface SectionContext {
  /** Absolute URL of the HTML page, for sections markdown cannot express. */
  pageUrl: string
  apiLinks: Partial<Record<ProjectSectionId, MarkdownLink[]>>
}

export interface MarkdownLink {
  name: string
  url: string
}

/** One page section as markdown, headed like its HTML counterpart. */
export function renderProjectSection(
  section: ProjectDetailsSection,
  level: number,
  context: SectionContext,
): string {
  const { id, title } = section.props
  const renderBody = SECTION_BODIES[section.type] as
    | SectionBody<typeof section.type>
    | undefined
  const body = renderBody
    ? renderBody(section.props, level + 1, context)
    : `Shown as an interactive chart or widget on ${link('the HTML page', `${context.pageUrl}#${id}`)}.`
  const apiLinks = context.apiLinks[id] ?? []

  return joinBlocks([
    heading(level, title),
    body,
    bulletList(apiLinks.map((apiLink) => link(apiLink.name, apiLink.url))),
  ])
}

type SectionType = ProjectDetailsSection['type']
type SectionProps<T extends SectionType> = Extract<
  ProjectDetailsSection,
  { type: T }
>['props']
/** `level` is the heading level for subsections. */
type SectionBody<T extends SectionType> = (
  props: SectionProps<T>,
  level: number,
  context: SectionContext,
) => string

/**
 * Section types without a body here (charts, interactive widgets) link to the
 * HTML page instead. Supporting another page kind means adding the section
 * types it uses.
 */
const SECTION_BODIES: { [T in SectionType]?: SectionBody<T> } = {
  RiskSummarySection: (props, level) =>
    joinBlocks([
      ...warnings(props.redWarning?.text, props.warning),
      ...props.riskGroups.flatMap((group) => [
        heading(level, group.name),
        numberedList(
          group.items.map((item) => markCritical(item.text, item.isCritical)),
          group.start,
        ),
      ]),
    ]),
  RiskAnalysisSection: (props, level) =>
    joinBlocks([
      ...warnings(props.redWarning?.text, props.warning),
      riskValues(props.rosetteValues, level),
    ]),
  L3RiskAnalysisSection: (props, level) =>
    joinBlocks([
      'The L3 risks depend on the individual properties of L3 and those of the host chain combined.',
      ...warnings(props.redWarning?.text, props.warning),
      props.combined
        ? 'The risks below reflect combined L2 & L3 risks.'
        : 'The risks below reflect individual L3 risks.',
      riskValues(props.combined ?? props.l3.risks, level),
    ]),
  GrissiniRiskAnalysisSection: (props, level) =>
    joinBlocks([
      nestHeadings(props.description ?? '', level),
      riskValues(props.layerGrissiniValues ?? [], level),
      riskValues(props.bridgeGrissiniValues ?? [], level),
    ]),
  Group: (props, level, context) =>
    joinBlocks([
      nestHeadings(props.description ?? '', level),
      ...props.items.map((item) => renderProjectSection(item, level, context)),
    ]),
  MarkdownSection: (props, level) =>
    joinBlocks([
      nestHeadings(props.content, level),
      risks(props.risks ?? []),
      references(props.references ?? []),
    ]),
  DetailedDescriptionSection: (props, level) =>
    joinBlocks([
      nestHeadings(props.description ?? '', level),
      nestHeadings(props.detailedDescription ?? '', level),
      references(props.references ?? []),
    ]),
  MilestonesAndIncidentsSection: ({ milestones }) =>
    bulletList(milestones.map(milestone)),
  StateDerivationSection: (props, level) =>
    joinBlocks([
      heading(level, 'Node software'),
      nestHeadings(props.nodeSoftware, level + 1),
      ...(props.compressionScheme
        ? [
            heading(level, 'Compression scheme'),
            nestHeadings(props.compressionScheme, level + 1),
          ]
        : []),
      heading(level, 'Genesis state'),
      nestHeadings(props.genesisState, level + 1),
      heading(level, 'Data format'),
      nestHeadings(props.dataFormat, level + 1),
    ]),
  SequencingSection: (props, level) =>
    joinBlocks([
      heading(level, props.name),
      nestHeadings(props.content, level + 1),
      ...(props.censorshipResistance
        ? [
            heading(level + 1, 'Censorship resistance'),
            nestHeadings(props.censorshipResistance, level + 2),
          ]
        : []),
      risks(props.risks ?? []),
      references(props.references ?? []),
    ]),
  UpgradesAndGovernanceSection: (props, level) =>
    nestHeadings(props.content ?? '', level),
  StageSection: (props, level) => {
    const { stageConfig, name } = props
    if (stageConfig.stage === 'UnderReview' || props.isUnderReview) {
      return `${name}'s stage is currently under review.`
    }
    const notEvenAStage0 =
      props.type === 'Other' && !!stageConfig.missing?.requirements
    return joinBlocks([
      ...warnings(props.emergencyWarning, stageConfig.message?.text),
      notEvenAStage0
        ? `${name} is not even a ${stageConfig.stage} project.`
        : `${name} is a ${stageConfig.stage} ${props.type}.`,
      nestHeadings(props.additionalConsiderations?.long ?? '', level),
      ...stageConfig.summary.flatMap((stage) => [
        heading(level, stage.stage),
        bulletList([
          ...(stage.principle
            ? [
                requirement({
                  ...stage.principle,
                  description: `Principle: ${stage.principle.description}`,
                }),
              ]
            : []),
          ...stage.requirements.map(requirement),
        ]),
      ]),
    ])
  },
  StateValidationSection: ({ stateValidation }, level) =>
    joinBlocks([
      nestHeadings(stateValidation.description ?? '', level),
      ...stateValidation.categories.map((category) =>
        joinBlocks([
          heading(level, category.title),
          nestHeadings(category.description, level + 1),
          risks((category.risks ?? []).map(toTechnologyRisk)),
          references(category.references ?? []),
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
            : [nestHeadings(item.description, level + 1), risks(item.risks)]),
          references(item.references),
        ]),
      ),
    ),
  PermissionsSection: ({ permissionsByChain }, level) =>
    joinBlocks(
      Object.entries(permissionsByChain).flatMap(([chain, permissions]) => [
        heading(level, chain),
        ...(permissions.roles.length > 0
          ? [
              heading(level + 1, 'Roles'),
              ...permissions.roles.map((role) => contract(role, level + 2)),
            ]
          : []),
        ...(permissions.actors.length > 0
          ? [
              heading(level + 1, 'Actors'),
              ...permissions.actors.map((actor) => contract(actor, level + 2)),
            ]
          : []),
      ]),
    ),
  ContractsSection: (props, level) =>
    joinBlocks([
      ...Object.entries(props.contracts).flatMap(([chain, contracts]) => [
        heading(level, chain),
        ...contracts.map((entry) => contract(entry, level + 1)),
      ]),
      ...(props.risks.length > 0
        ? [
            'The current deployment carries some associated risks:',
            bulletList(
              props.risks.map((risk) =>
                markCritical(risk.text, risk.isCritical),
              ),
            ),
          ]
        : []),
    ]),
}

/** A contract or a permissioned role/actor, as the HTML contract entry shows it. */
function contract(entry: TechnologyContract, level: number) {
  const upgradeableBy = entry.upgradeableBy ?? []
  return joinBlocks([
    heading(level, entry.name),
    `Addresses: ${entry.addresses.map(contractAddress).join(', ')}`,
    nestHeadings(entry.description ?? '', level + 1),
    upgradeableBy.length > 0
      ? `Can be upgraded by: ${upgradeableBy.map((actor) => `${actor.name} with ${actor.delay} delay`).join(', ')}`
      : '',
    entry.upgradeDelay ? `Upgrade delay: ${entry.upgradeDelay}` : '',
    references(entry.references),
  ])
}

function riskValues(values: RosetteValue[], level: number) {
  return joinBlocks(
    values.flatMap((risk) => [
      heading(level, risk.name),
      withSentiment(risk.value, risk.sentiment),
      nestHeadings(risk.description ?? '', level + 1),
    ]),
  )
}

function milestone(entry: Milestone) {
  const date = entry.date.slice(0, 'YYYY-MM-DD'.length)
  const kind = entry.type === 'incident' ? ' (incident)' : ''
  const description = entry.description ? ` ${entry.description}` : ''
  return `${date}${kind}: ${link(entry.title, entry.url)}.${description}`
}

/** Unnamed addresses carry a shortened address as their name, which adds nothing next to the full one. */
function contractAddress(address: TechnologyContractAddress) {
  const notes = [
    !address.name.includes('…') && address.name,
    address.verificationStatus === 'unverified' && 'unverified',
  ].filter(Boolean)
  const suffix = notes.length > 0 ? ` (${notes.join(', ')})` : ''
  return `${link(address.address, address.href)}${suffix}`
}

function risks(items: TechnologyRisk[]) {
  if (items.length === 0) return ''
  return joinBlocks([
    '**Risks**',
    bulletList(items.map((risk) => markCritical(risk.text, risk.isCritical))),
  ])
}

function toTechnologyRisk(risk: ProjectRisk): TechnologyRisk {
  return {
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }
}

function references(items: ReferenceLink[]) {
  if (items.length === 0) return ''
  return joinBlocks([
    '**References**',
    bulletList(items.map((reference) => link(reference.title, reference.url))),
  ])
}

function requirement(req: {
  satisfied: boolean | 'UnderReview'
  description: string
  upcoming?: boolean
}) {
  const box = req.satisfied === true ? '[x]' : '[ ]'
  const status = [
    req.satisfied === 'UnderReview' && '(under review)',
    req.upcoming && '(upcoming)',
  ].filter(Boolean)
  return [box, ...status, req.description].join(' ')
}

function warnings(...texts: (string | undefined)[]) {
  return texts.flatMap((text) => (text ? [warning(text)] : []))
}
