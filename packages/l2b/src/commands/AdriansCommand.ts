import {
  ConfigReader,
  type DiscoveryOutput,
  type EntryParameters,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'

interface TemplateFieldRelation {
  sourceTemplate: string
  sourceField: string
  targetTemplate: string
  foundIn: ProjectChain[]
}

interface ProjectChain {
  project: string
  chain: string
}

export const AdriansCommand = command({
  name: 'adriansCommand',
  description: 'builds some _knowledge base_',
  args: {
    chain: positional({
      type: string,
      displayName: 'chain',
    }),
    project: positional({
      type: string,
      displayName: 'project',
    }),
  },
  handler: ({ chain, project }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)

    const allDiscoveries = getAllDiscoveriesExcept(configReader, {
      chain,
      project,
    })
    const relations = buildKnowledgeBase(allDiscoveries)

    const targetDiscovery = configReader.readDiscovery(project, chain)
    const suggestions = generateSuggestions(targetDiscovery, relations)

    outputSuggestions(suggestions, project, chain)
  },
})

function getAllDiscoveriesExcept(
  configReader: ConfigReader,
  toExclude: ProjectChain,
): DiscoveryOutput[] {
  const allProjects = configReader
    .readAllChains()
    .flatMap((chain) =>
      configReader
        .readAllProjectsForChain(chain)
        .map((project) => ({ chain, project })),
    )
    .filter(
      ({ chain, project }) =>
        chain !== toExclude.chain || project !== toExclude.project,
    )

  const discoveries: DiscoveryOutput[] = []
  for (const { chain, project } of allProjects) {
    const discovery = configReader.readDiscovery(project, chain)
    discoveries.push(discovery)
  }

  return discoveries
}

function buildKnowledgeBase(
  discoveries: DiscoveryOutput[],
): TemplateFieldRelation[] {
  const relations: TemplateFieldRelation[] = []

  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (!entry.template) continue

      for (const [field, value] of Object.entries(entry.values ?? {})) {
        const targetContract = discovery.entries.find(
          (c) => c.address.toString() === value,
        )
        if (!targetContract?.template) continue

        updateRelations(
          relations,
          entry.template,
          field,
          targetContract.template,
          discovery,
        )
      }
    }
  }

  return relations
}

function updateRelations(
  relations: TemplateFieldRelation[],
  sourceTemplate: string,
  field: string,
  targetTemplate: string,
  discovery: DiscoveryOutput,
) {
  const existingRelation = relations.find(
    (r) =>
      r.sourceTemplate === sourceTemplate &&
      r.sourceField === field &&
      r.targetTemplate === targetTemplate,
  )

  if (existingRelation) {
    existingRelation.foundIn.push({
      project: discovery.name,
      chain: discovery.chain,
    })
  } else {
    relations.push({
      sourceTemplate,
      sourceField: field,
      targetTemplate,
      foundIn: [{ project: discovery.name, chain: discovery.chain }],
    })
  }
}

function generateSuggestions(
  discovery: DiscoveryOutput,
  relations: TemplateFieldRelation[],
): string[] {
  const suggestions: string[] = []

  for (const entry of discovery.entries) {
    if (!entry.template) continue

    const potentialRelations = relations
      .filter((r) => r.sourceTemplate === entry.template)
      .filter((r) => r.foundIn.length > 1)

    for (const relation of potentialRelations) {
      const fieldValue = entry.values?.[relation.sourceField]
      const targetContract = discovery.entries.find(
        (c) => c.address.toString() === fieldValue,
      )

      if (!targetContract) {
        suggestions.push(generateMissingContractSuggestion(entry, relation))
      } else if (targetContract.template !== relation.targetTemplate) {
        suggestions.push(
          generateMismatchedTemplateSuggestion(entry, targetContract, relation),
        )
      }
    }
  }

  return suggestions
}

function generateMissingContractSuggestion(
  entry: EntryParameters,
  relation: TemplateFieldRelation,
): string {
  let suggestion = `\nContract ${entry.name} (${entry.address}, template: ${entry.template}):\n`
  suggestion += `  - field "${relation.sourceField}" is not pointing to a entry,\n`
  suggestion += `  - but in these projects points at a entry with template ${relation.targetTemplate}. Please investigate.\n`
  suggestion += relation.foundIn
    .map(({ project, chain }) => `    - ${project} on ${chain}`)
    .join('\n')
  return suggestion
}

function generateMismatchedTemplateSuggestion(
  entry: EntryParameters,
  targetContract: EntryParameters,
  relation: TemplateFieldRelation,
): string {
  let suggestion = `\nContract ${entry.name} (${entry.address}, template: ${entry.template}):\n`
  suggestion += `  - field "${relation.sourceField}" points at ${targetContract.name} with template ${targetContract.template}\n`
  suggestion += `  - but in these projects it points at a entry with template ${relation.targetTemplate}. Please investigate.\n`
  suggestion += relation.foundIn
    .map(({ project, chain }) => `    - ${project} on ${chain}`)
    .join('\n')
  return suggestion
}

function outputSuggestions(
  suggestions: string[],
  project: string,
  chain: string,
) {
  if (suggestions.length === 0) {
    console.log(`No suggestions found for ${project} on ${chain}`)
  } else {
    console.log(`Suggestions for ${project} on ${chain}:`)
    suggestions.forEach((s) => console.log(s))
  }
}
