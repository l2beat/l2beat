import type {
  ConfigHealthService,
  ConfigReader,
  HealthHint,
  TemplateService,
} from '@l2beat/discovery'
import type { ApiConfigHealthResponse, ApiHealthHint } from './types'

export function getConfigHealth(
  configReader: ConfigReader,
  templateService: TemplateService,
  configHealthService: ConfigHealthService,
): ApiConfigHealthResponse {
  const allProjects = configReader.readAllDiscoveredProjects()
  const allTemplates = Object.keys(templateService.listAllTemplates())

  const configPairs = allProjects.map(
    (project) =>
      [
        configReader.readConfig(project),
        configReader.readDiscovery(project),
      ] as const,
  )
  const allDiscoveries = configPairs.map(([_, discovery]) => discovery)

  const healthHints: HealthHint[] = []

  for (const [config, discovery] of configPairs) {
    const configHints = configHealthService.checkConfigHealth(config, discovery)
    healthHints.push(...configHints)
  }

  for (const templateId of allTemplates) {
    const templateConfig = templateService.loadContractTemplate(templateId)
    const templateHints = configHealthService.checkTemplateHealth(
      templateConfig,
      allDiscoveries,
      templateId,
    )
    healthHints.push(...templateHints)
  }

  const apiHealthHints: ApiHealthHint[] = healthHints.map((hint) => {
    if (hint.source === 'config') {
      return {
        source: 'config',
        target: {
          project: hint.target.project,
          entry: hint.target.entry.toString(),
        },
        excess: hint.excess,
      }
    }

    return {
      source: 'template',
      target: hint.target,
      excess: hint.excess,
    }
  })

  return {
    healthHints: apiHealthHints,
    length: apiHealthHints.length,
  }
}
