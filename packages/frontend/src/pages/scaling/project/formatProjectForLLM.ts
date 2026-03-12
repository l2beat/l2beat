import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'

// Helper type to extract props from a section type
type ExtractProps<T> = T extends { props: infer P } ? P : never

// Extract section by type from the union
type SectionByType<T extends ProjectDetailsSection['type']> = Extract<
  ProjectDetailsSection,
  { type: T }
>

/**
 * Formats a ProjectScalingEntry into structured Markdown for LLM consumption.
 */
export function formatProjectForLLM(project: ProjectScalingEntry): string {
  const lines: string[] = []

  // Title
  lines.push(`# ${project.name}`)
  lines.push('')

  // Description
  if (project.header.description) {
    lines.push(`> ${project.header.description}`)
    lines.push('')
  }

  // Overview section
  lines.push('## Overview')
  lines.push('')
  if (project.header.category) {
    lines.push(`- **Category**: ${project.header.category}`)
  }
  lines.push(
    `- **Layer**: ${project.type === 'layer2' ? 'Layer 2' : 'Layer 3'}`,
  )
  if (project.type === 'layer3' && project.header.hostChain) {
    lines.push(`- **Host Chain**: ${project.header.hostChain}`)
  }
  if (project.stageConfig.stage !== 'NotApplicable') {
    lines.push(`- **Stage**: ${formatStage(project.stageConfig.stage)}`)
  }
  if (project.header.purposes.length > 0) {
    lines.push(`- **Purposes**: ${project.header.purposes.join(', ')}`)
  }
  if (project.isUpcoming) {
    lines.push('- **Status**: Upcoming')
  }
  if (project.archivedAt) {
    lines.push('- **Status**: Archived')
  }
  lines.push('')

  // Links section
  if (project.header.links.length > 0) {
    lines.push('## Links')
    lines.push('')
    for (const link of project.header.links) {
      for (const url of link.links) {
        lines.push(`- ${link.name}: ${url}`)
      }
    }
    lines.push('')
  }

  // Warnings
  if (
    project.header.warning ||
    project.header.redWarning ||
    project.header.emergencyWarning
  ) {
    lines.push('## Warnings')
    lines.push('')
    if (project.header.emergencyWarning) {
      lines.push(`**EMERGENCY**: ${project.header.emergencyWarning}`)
      lines.push('')
    }
    if (project.header.redWarning) {
      lines.push(`**CRITICAL**: ${project.header.redWarning}`)
      lines.push('')
    }
    if (project.header.warning) {
      lines.push(`**Warning**: ${project.header.warning}`)
      lines.push('')
    }
  }

  // Process sections
  for (const section of project.sections) {
    const sectionMarkdown = formatSection(section)
    if (sectionMarkdown) {
      lines.push(sectionMarkdown)
      lines.push('')
    }
  }

  return lines.join('\n')
}

function formatStage(
  stage: 'Stage 0' | 'Stage 1' | 'Stage 2' | 'UnderReview' | 'NotApplicable',
): string {
  if (stage === 'UnderReview') return 'Under Review'
  if (stage === 'NotApplicable') return 'Not Applicable'
  return stage
}

function formatSection(section: ProjectDetailsSection): string | null {
  if (section.excludeFromNavigation && section.type === 'UpcomingDisclaimer') {
    return '## Upcoming Project\n\nThis project is not yet live. The information below reflects the planned design and may change before launch.'
  }

  switch (section.type) {
    case 'DetailedDescriptionSection':
      return formatDetailedDescription(section.props)
    case 'RiskSummarySection':
      return formatRiskSummary(section.props)
    case 'DaRiskSummarySection':
      return formatDaRiskSummary(section.props)
    case 'RiskAnalysisSection':
      return formatRiskAnalysis(section.props)
    case 'L3RiskAnalysisSection':
      return formatL3RiskAnalysis(section.props)
    case 'GrissiniRiskAnalysisSection':
      return formatGrissiniRiskAnalysis(section.props)
    case 'StageSection':
      return formatStageSection(section.props)
    case 'TechnologyChoicesSection':
      return formatTechnologyChoices(section.props)
    case 'StateDerivationSection':
      return formatStateDerivation(section.props)
    case 'StateValidationSection':
      return formatStateValidation(section.props)
    case 'MarkdownSection':
      return formatMarkdownSection(section.props)
    case 'SequencingSection':
      return formatSequencingSection(section.props)
    case 'PermissionsSection':
      return formatPermissions(section.props)
    case 'ContractsSection':
      return formatContracts(section.props)
    case 'MilestonesAndIncidentsSection':
      return formatMilestones(section.props)
    case 'Group':
      return formatGroup(section.props)
    default:
      return null
  }
}

function formatDetailedDescription(
  props: ExtractProps<SectionByType<'DetailedDescriptionSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')
  lines.push(props.description)
  if (props.detailedDescription) {
    lines.push('')
    lines.push(props.detailedDescription)
  }
  return lines.join('\n')
}

function formatRiskSummary(
  props: ExtractProps<SectionByType<'RiskSummarySection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.isVerified === false) {
    lines.push('**Warning**: This project includes unverified contracts.')
    lines.push('')
  }

  if (props.redWarning) {
    lines.push(`**Critical Warning**: ${props.redWarning}`)
    lines.push('')
  }

  if (props.warning) {
    lines.push(`**Warning**: ${props.warning}`)
    lines.push('')
  }

  for (const group of props.riskGroups) {
    lines.push(`### ${group.name}`)
    lines.push('')
    let index = group.start
    for (const item of group.items) {
      const critical = item.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`${index}. ${item.text}${critical}`)
      index++
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatDaRiskSummary(
  props: ExtractProps<SectionByType<'DaRiskSummarySection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.isVerified === false) {
    lines.push('**Warning**: This project includes unverified contracts.')
    lines.push('')
  }

  lines.push(`### ${props.layer.name} (DA Layer)`)
  lines.push('')
  for (const group of props.layer.risks) {
    lines.push(`#### ${group.name}`)
    let index = group.start
    for (const item of group.items) {
      const critical = item.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`${index}. ${item.text}${critical}`)
      index++
    }
    lines.push('')
  }

  lines.push(`### ${props.bridge.name} (DA Bridge)`)
  lines.push('')
  for (const group of props.bridge.risks) {
    lines.push(`#### ${group.name}`)
    let index = group.start
    for (const item of group.items) {
      const critical = item.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`${index}. ${item.text}${critical}`)
      index++
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatRiskAnalysis(
  props: ExtractProps<SectionByType<'RiskAnalysisSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.isVerified === false) {
    lines.push('**Warning**: This project includes unverified contracts.')
    lines.push('')
  }

  if (props.redWarning) {
    lines.push(`**Critical Warning**: ${props.redWarning}`)
    lines.push('')
  }

  if (props.warning) {
    lines.push(`**Warning**: ${props.warning}`)
    lines.push('')
  }

  for (const value of props.rosetteValues) {
    lines.push(formatRosetteValue(value))
    lines.push('')
  }

  return lines.join('\n')
}

function formatL3RiskAnalysis(
  props: ExtractProps<SectionByType<'L3RiskAnalysisSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.isVerified === false) {
    lines.push('**Warning**: This project includes unverified contracts.')
    lines.push('')
  }

  lines.push(`### ${props.l2.name} (L2) Risks`)
  lines.push('')
  for (const value of props.l2.risks) {
    lines.push(formatRosetteValue(value))
    lines.push('')
  }

  lines.push(`### ${props.l3.name} (L3) Risks`)
  lines.push('')
  for (const value of props.l3.risks) {
    lines.push(formatRosetteValue(value))
    lines.push('')
  }

  if (props.combined) {
    lines.push('### Combined Risks')
    lines.push('')
    for (const value of props.combined) {
      lines.push(formatRosetteValue(value))
      lines.push('')
    }
  }

  return lines.join('\n')
}

function formatGrissiniRiskAnalysis(
  props: ExtractProps<SectionByType<'GrissiniRiskAnalysisSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.description) {
    lines.push(props.description)
    lines.push('')
  }

  if (props.layerGrissiniValues && props.layerGrissiniValues.length > 0) {
    lines.push('### DA Layer Risks')
    lines.push('')
    for (const value of props.layerGrissiniValues) {
      lines.push(formatRosetteValue(value))
      lines.push('')
    }
  }

  if (props.bridgeGrissiniValues && props.bridgeGrissiniValues.length > 0) {
    lines.push('### DA Bridge Risks')
    lines.push('')
    for (const value of props.bridgeGrissiniValues) {
      lines.push(formatRosetteValue(value))
      lines.push('')
    }
  }

  return lines.join('\n')
}

function formatRosetteValue(value: RosetteValue): string {
  const sentiment =
    value.sentiment === 'good'
      ? 'Good'
      : value.sentiment === 'bad'
        ? 'Bad'
        : value.sentiment === 'warning'
          ? 'Warning'
          : value.sentiment === 'UnderReview'
            ? 'Under Review'
            : 'Neutral'

  return `### ${value.name}\n**Rating**: ${value.value} (${sentiment})\n\n${value.description}`
}

function formatStageSection(
  props: ExtractProps<SectionByType<'StageSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  const stageConfig = props.stageConfig
  if (stageConfig.stage === 'UnderReview') {
    lines.push(`${props.name}'s stage is currently **Under Review**.`)
    return lines.join('\n')
  }

  lines.push(
    `${props.name} is a **${stageConfig.stage}** ${props.type}${props.isAppchain ? ' (Appchain)' : ''}.`,
  )
  lines.push('')

  if (props.additionalConsiderations) {
    lines.push(props.additionalConsiderations.long)
    lines.push('')
  }

  if (stageConfig.message) {
    lines.push(`**Note**: ${stageConfig.message.text}`)
    lines.push('')
  }

  lines.push('### Stage Requirements')
  lines.push('')

  for (const stage of stageConfig.summary) {
    lines.push(`#### ${stage.stage}`)
    lines.push('')

    if (stage.principle) {
      const principleStatus =
        stage.principle.satisfied === true
          ? '[x]'
          : stage.principle.satisfied === false
            ? '[ ]'
            : '[?]'
      lines.push(
        `**Principle**: ${principleStatus} ${stage.principle.description}`,
      )
      lines.push('')
    }

    for (const req of stage.requirements) {
      const status =
        req.satisfied === true ? '[x]' : req.satisfied === false ? '[ ]' : '[?]'
      lines.push(`- ${status} ${req.description}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatTechnologyChoices(
  props: ExtractProps<SectionByType<'TechnologyChoicesSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  for (const item of props.items) {
    lines.push(`### ${item.name}`)
    lines.push('')

    if (item.isUnderReview) {
      lines.push('*This section is under review.*')
      lines.push('')
      continue
    }

    lines.push(item.description)
    lines.push('')

    if (item.risks.length > 0) {
      lines.push('**Risks:**')
      for (const risk of item.risks) {
        const critical = risk.isCritical ? ' **(CRITICAL)**' : ''
        lines.push(`- ${risk.text}${critical}`)
      }
      lines.push('')
    }

    if (item.references.length > 0) {
      lines.push('**References:**')
      for (const ref of item.references) {
        lines.push(`- [${ref.title}](${ref.url})`)
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

function formatStateDerivation(
  props: ExtractProps<SectionByType<'StateDerivationSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  lines.push('### Node Software')
  lines.push(props.nodeSoftware)
  lines.push('')

  if (props.compressionScheme) {
    lines.push('### Compression Scheme')
    lines.push(props.compressionScheme)
    lines.push('')
  }

  lines.push('### Genesis State')
  lines.push(props.genesisState)
  lines.push('')

  lines.push('### Data Format')
  lines.push(props.dataFormat)
  lines.push('')

  return lines.join('\n')
}

function formatStateValidation(
  props: ExtractProps<SectionByType<'StateValidationSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.stateValidation.description) {
    lines.push(props.stateValidation.description)
    lines.push('')
  }

  for (const category of props.stateValidation.categories) {
    lines.push(`### ${category.title}`)
    lines.push('')
    lines.push(category.description)
    lines.push('')
  }

  return lines.join('\n')
}

function formatMarkdownSection(
  props: ExtractProps<SectionByType<'MarkdownSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')
  lines.push(props.content)
  lines.push('')

  if (props.risks && props.risks.length > 0) {
    lines.push('**Risks:**')
    for (const risk of props.risks) {
      const critical = risk.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`- ${risk.text}${critical}`)
    }
    lines.push('')
  }

  if (props.references && props.references.length > 0) {
    lines.push('**References:**')
    for (const ref of props.references) {
      lines.push(`- [${ref.title}](${ref.url})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatSequencingSection(
  props: ExtractProps<SectionByType<'SequencingSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  lines.push(`### ${props.name}`)
  lines.push('')
  lines.push(props.content)
  lines.push('')

  if (props.risks && props.risks.length > 0) {
    lines.push('**Risks:**')
    for (const risk of props.risks) {
      const critical = risk.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`- ${risk.text}${critical}`)
    }
    lines.push('')
  }

  if (props.references && props.references.length > 0) {
    lines.push('**References:**')
    for (const ref of props.references) {
      lines.push(`- [${ref.title}](${ref.url})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatPermissions(
  props: ExtractProps<SectionByType<'PermissionsSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.permissionedEntities && props.permissionedEntities.length > 0) {
    lines.push('### DA Committee Members')
    lines.push('')
    for (const entity of props.permissionedEntities) {
      lines.push(`- [${entity.name}](${entity.href})`)
    }
    lines.push('')
  }

  for (const [chain, permissions] of Object.entries(props.permissionsByChain)) {
    lines.push(`### ${chain}`)
    lines.push('')

    if (permissions.roles.length > 0) {
      lines.push('#### Roles')
      lines.push('')
      for (const role of permissions.roles) {
        const addresses = role.addresses
          .map((a) => `[${a.name}](${a.href})`)
          .join(', ')
        lines.push(`- **${role.name}** (${addresses})`)
        if (role.description) {
          lines.push(`  - ${role.description}`)
        }
      }
      lines.push('')
    }

    if (permissions.actors.length > 0) {
      lines.push('#### Actors')
      lines.push('')
      for (const actor of permissions.actors) {
        const addresses = actor.addresses
          .map((a) => `[${a.name}](${a.href})`)
          .join(', ')
        lines.push(`- **${actor.name}** (${addresses})`)
        if (actor.description) {
          lines.push(`  - ${actor.description}`)
        }
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

function formatContracts(
  props: ExtractProps<SectionByType<'ContractsSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  for (const [chain, contracts] of Object.entries(props.contracts)) {
    lines.push(`### ${chain}`)
    lines.push('')

    for (const contract of contracts) {
      const addresses = contract.addresses
        .map((a) => `[${a.name}](${a.href})`)
        .join(', ')
      lines.push(`- **${contract.name}** (${addresses})`)
      if (contract.description) {
        lines.push(`  - ${contract.description}`)
      }
      if (contract.upgradeableBy && contract.upgradeableBy.length > 0) {
        const upgraders = contract.upgradeableBy
          .map((u) => `${u.name} (${u.delay} delay)`)
          .join(', ')
        lines.push(`  - Upgradeable by: ${upgraders}`)
      }
    }
    lines.push('')
  }

  if (props.escrows.length > 0) {
    lines.push('### Value Secured Contracts')
    lines.push('')
    for (const escrow of props.escrows) {
      const addresses = escrow.addresses
        .map((a) => `[${a.name}](${a.href})`)
        .join(', ')
      lines.push(`- **${escrow.name}** (${addresses})`)
      if (escrow.description) {
        lines.push(`  - ${escrow.description}`)
      }
    }
    lines.push('')
  }

  if (props.risks.length > 0) {
    lines.push('### Associated Risks')
    lines.push('')
    for (const risk of props.risks) {
      const critical = risk.isCritical ? ' **(CRITICAL)**' : ''
      lines.push(`- ${risk.text}${critical}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function formatMilestones(
  props: ExtractProps<SectionByType<'MilestonesAndIncidentsSection'>>,
): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  for (const milestone of props.milestones) {
    const type = milestone.type === 'incident' ? '🚨 Incident' : '🎯 Milestone'
    lines.push(`### ${type}: ${milestone.title}`)
    lines.push(`**Date**: ${milestone.date}`)
    lines.push('')
    if (milestone.description) {
      lines.push(milestone.description)
      lines.push('')
    }
    lines.push(`[Learn more](${milestone.url})`)
    lines.push('')
  }

  return lines.join('\n')
}

function formatGroup(props: ExtractProps<SectionByType<'Group'>>): string {
  const lines: string[] = []
  lines.push(`## ${props.title}`)
  lines.push('')

  if (props.description) {
    lines.push(props.description)
    lines.push('')
  }

  // Recursively format nested sections
  for (const item of props.items) {
    const nested = formatSection(item)
    if (nested) {
      // Increase heading level for nested items
      const adjustedNested = nested.replace(/^## /gm, '### ')
      lines.push(adjustedNested)
      lines.push('')
    }
  }

  return lines.join('\n')
}
