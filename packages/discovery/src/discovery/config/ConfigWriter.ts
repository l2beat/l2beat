import { type ChainSpecificAddress, formatJson } from '@l2beat/shared-pure'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { ConfigReader } from './ConfigReader'
import { StructureConfig } from './StructureConfig'

type ConfigTemplateValues = {
  name: string
  initialAddresses: ChainSpecificAddress[]
  maxDepth?: number
  maxAddresses?: number
}

export class ConfigWriter {
  constructor(
    private readonly configReader: ConfigReader,
    private readonly rootPath: string,
  ) {}

  updateRawConfigFile(project: string, contents: string) {
    const configPath = this.configReader.getConfigPath(project)

    writeFileSync(configPath, contents)
  }

  createProjectConfigFile(project: string, contents: ConfigTemplateValues) {
    const projectPath = join(this.rootPath, project)

    const config = this.prepareProjectConfig(contents)

    StructureConfig.parse(config)

    this.createConfigFile(projectPath, formatJson(config))
  }

  private prepareProjectConfig(incomingValues: ConfigTemplateValues) {
    const { name, initialAddresses, maxAddresses, maxDepth } = incomingValues

    const config = {
      $schema: '../../../../discovery/schemas/config.v2.schema.json',
      name,
      import: ['../globalConfig.jsonc'],
      ...(maxDepth ? { maxDepth } : {}),
      ...(maxAddresses ? { maxAddresses } : {}),
      initialAddresses,
    }

    return config
  }

  private createConfigFile(projectPath: string, contents: string) {
    mkdirSync(projectPath, { recursive: true })
    const configPath = join(projectPath, 'config.jsonc')
    writeFileSync(configPath, contents)
  }
}
