import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters, DiscoveryOutput } from '@l2beat/discovery-types'

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

async function main() {
  const { chain, project } = parseCliArguments()
  const configReader = new ConfigReader()

  const allDiscoveries = await getAllDiscoveriesExcept(configReader, {
    chain,
    project,
  })
  const relations = buildKnowledgeBase(allDiscoveries)

  const targetDiscovery = await configReader.readDiscovery(project, chain)
  const suggestions = generateSuggestions(targetDiscovery, relations)

  outputSuggestions(suggestions, project, chain)
}

function parseCliArguments(): ProjectChain {
  const [chain, project] = process.argv.slice(2)
  if (!chain || !project) {
    console.log('Usage: pnpm analyze-project <chain> <project>')
    process.exit(1)
  }
  return { chain, project }
}

async function getAllDiscoveriesExcept(
  configReader: ConfigReader,
  toExclude: ProjectChain,
): Promise<DiscoveryOutput[]> {
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
    const discovery = await configReader.readDiscovery(project, chain)
    discoveries.push(discovery)
  }

  return discoveries
}

function buildKnowledgeBase(
  discoveries: DiscoveryOutput[],
): TemplateFieldRelation[] {
  const relations: TemplateFieldRelation[] = []

  for (const discovery of discoveries) {
    for (const contract of discovery.contracts) {
      if (!contract.template) continue

      for (const [field, value] of Object.entries(contract.values ?? {})) {
        const targetContract = discovery.contracts.find(
          (c) => c.address.toString() === value,
        )
        if (!targetContract?.template) continue

        updateRelations(
          relations,
          contract.template,
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

  for (const contract of discovery.contracts) {
    if (!contract.template) continue

    const potentialRelations = relations
      .filter((r) => r.sourceTemplate === contract.template)
      .filter((r) => r.foundIn.length > 1)

    for (const relation of potentialRelations) {
      const fieldValue = contract.values?.[relation.sourceField]
      const targetContract = discovery.contracts.find(
        (c) => c.address.toString() === fieldValue,
      )

      if (!targetContract) {
        suggestions.push(generateMissingContractSuggestion(contract, relation))
      } else if (targetContract.template !== relation.targetTemplate) {
        suggestions.push(
          generateMismatchedTemplateSuggestion(
            contract,
            targetContract,
            relation,
          ),
        )
      }
    }
  }

  return suggestions
}

function generateMissingContractSuggestion(
  contract: ContractParameters,
  relation: TemplateFieldRelation,
): string {
  let suggestion = `\nContract ${contract.name} (${contract.address}, template: ${contract.template}):\n`
  suggestion += `  - field "${relation.sourceField}" is not pointing to a contract,\n`
  suggestion += `  - but in these projects points at a contract with template ${relation.targetTemplate}. Please investigate.\n`
  suggestion += relation.foundIn
    .map(({ project, chain }) => `    - ${project} on ${chain}`)
    .join('\n')
  return suggestion
}

function generateMismatchedTemplateSuggestion(
  contract: ContractParameters,
  targetContract: ContractParameters,
  relation: TemplateFieldRelation,
): string {
  let suggestion = `\nContract ${contract.name} (${contract.address}, template: ${contract.template}):\n`
  suggestion += `  - field "${relation.sourceField}" points at ${targetContract.name} with template ${targetContract.template}\n`
  suggestion += `  - but in these projects it points at a contract with template ${relation.targetTemplate}. Please investigate.\n`
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

main().catch(console.error)
