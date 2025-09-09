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
}

export const AdriansCommand = command({
  name: 'adriansCommand',
  description: 'Builds a knowledge base about a project to be used with LLMs.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
    }),
  },
  handler: ({ project }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)

    const allDiscoveries = getAllDiscoveriesExcept(configReader, project)
    const relations = buildKnowledgeBase(allDiscoveries)

    const targetDiscovery = configReader.readDiscovery(project)
    const suggestions = generateSuggestions(targetDiscovery, relations)

    outputSuggestions(suggestions, project)
  },
})

function getAllDiscoveriesExcept(
  configReader: ConfigReader,
  toExclude: string,
): DiscoveryOutput[] {
  const allProjects = configReader.readAllDiscoveredProjects()

  const discoveries: DiscoveryOutput[] = []
  for (const project of allProjects) {
    if (project === toExclude) {
      continue
    }

    const discovery = configReader.readDiscovery(project)
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
    })
  } else {
    relations.push({
      sourceTemplate,
      sourceField: field,
      targetTemplate,
      foundIn: [{ project: discovery.name }],
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
  suggestion += `  - field "${relation.sourceField}" is not pointing to an entry,\n`
  suggestion += `  - but in these projects points at an entry with template ${relation.targetTemplate}. Please investigate.\n`
  suggestion += relation.foundIn
    .map(({ project }) => `    - ${project}`)
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
  suggestion += `  - but in these projects it points at an entry with template ${relation.targetTemplate}. Please investigate.\n`
  suggestion += relation.foundIn
    .map(({ project }) => `    - ${project}`)
    .join('\n')
  return suggestion
}

function outputSuggestions(suggestions: string[], project: string) {
  if (suggestions.length === 0) {
    console.log(`No suggestions found for ${project}`)
  } else {
    console.log(`Suggestions for ${project}:`)
    suggestions.forEach((s) => console.log(s))
  }
}
