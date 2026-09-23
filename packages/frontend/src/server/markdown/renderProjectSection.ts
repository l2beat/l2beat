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
  subsection,
  warning,
  withSentiment,
} from './markdown'

export interface SectionContext {
  /** Absolute URL of the HTML page, for sections markdown cannot express. */
  pageUrl: string
  /** JSON API endpoints serving the data behind a section, keyed by section id. */
  apiLinks: Partial<Record<ProjectSectionId, ReferenceLink[]>>
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

  return joinBlocks([
    heading(level, title),
    body,
    renderLinks(context.apiLinks[id] ?? []),
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
      renderWarnings(props.redWarning?.text, props.warning),
      ...props.riskGroups.map((group) =>
        subsection(
          level,
          group.name,
          numberedList(
            group.items.map((item) => markCritical(item.text, item.isCritical)),
            group.start,
          ),
        ),
      ),
    ]),
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
      nestHeadings(props.description ?? '', level),
      renderRiskValues(props.layerGrissiniValues ?? [], level),
      renderRiskValues(props.bridgeGrissiniValues ?? [], level),
    ]),
  Group: (props, level, context) =>
    joinBlocks([
      nestHeadings(props.description ?? '', level),
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
      nestHeadings(props.description ?? '', level),
      nestHeadings(props.detailedDescription ?? '', level),
      renderReferences(props.references ?? []),
    ]),
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
      ).map(([title, text]) =>
        subsection(level, title, nestHeadings(text ?? '', level + 1)),
      ),
    ),
  SequencingSection: (props, level) =>
    joinBlocks([
      heading(level, props.name),
      nestHeadings(props.content, level + 1),
      subsection(
        level + 1,
        'Censorship resistance',
        nestHeadings(props.censorshipResistance ?? '', level + 2),
      ),
      renderRisks(props.risks ?? []),
      renderReferences(props.references ?? []),
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
      renderWarnings(props.emergencyWarning, stageConfig.message?.text),
      notEvenAStage0
        ? `${name} is not even a ${stageConfig.stage} project.`
        : `${name} is a ${stageConfig.stage} ${props.type}.`,
      nestHeadings(props.additionalConsiderations?.long ?? '', level),
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
      nestHeadings(stateValidation.description ?? '', level),
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
                nestHeadings(item.description, level + 1),
                renderRisks(item.risks),
              ]),
          renderReferences(item.references),
        ]),
      ),
    ),
  PermissionsSection: ({ permissionsByChain }, level) =>
    joinBlocks(
      Object.entries(permissionsByChain).map(([chain, permissions]) =>
        subsection(
          level,
          chain,
          joinBlocks([
            subsection(
              level + 1,
              'Roles',
              joinBlocks(
                permissions.roles.map((role) =>
                  renderContract(role, level + 2),
                ),
              ),
            ),
            subsection(
              level + 1,
              'Actors',
              joinBlocks(
                permissions.actors.map((actor) =>
                  renderContract(actor, level + 2),
                ),
              ),
            ),
          ]),
        ),
      ),
    ),
  ContractsSection: (props, level) =>
    joinBlocks([
      ...Object.entries(props.contracts).map(([chain, contracts]) =>
        subsection(
          level,
          chain,
          joinBlocks(
            contracts.map((entry) => renderContract(entry, level + 1)),
          ),
        ),
      ),
      renderRisks(
        props.risks,
        'The current deployment carries some associated risks:',
      ),
    ]),
}

/** A contract or a permissioned role/actor, as the HTML contract entry shows it. */
function renderContract(entry: TechnologyContract, level: number) {
  const upgradeableBy = entry.upgradeableBy ?? []
  return joinBlocks([
    heading(level, entry.name),
    `Addresses: ${entry.addresses.map(renderContractAddress).join(', ')}`,
    nestHeadings(entry.description ?? '', level + 1),
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

function renderRiskValues(values: RosetteValue[], level: number) {
  return joinBlocks(
    values.map((risk) =>
      joinBlocks([
        heading(level, risk.name),
        withSentiment(risk.value, risk.sentiment),
        nestHeadings(risk.description ?? '', level + 1),
      ]),
    ),
  )
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
