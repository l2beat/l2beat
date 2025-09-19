import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { ConfigReader } from './ConfigReader'

export class ConfigWriter {
  constructor(public configReader: ConfigReader) {}

  writeConfigFile(project: string, contents: string) {
    const projectPath = this.configReader.resolveProjectPath(project)
    const configPath = join(projectPath, 'config.jsonc')
    writeFileSync(configPath, contents)
  }

  createConfigFile(projectPath: string, contents: string) {
    mkdirSync(projectPath, { recursive: true })
    const configPath = join(projectPath, 'config.jsonc')
    writeFileSync(configPath, contents)
  }
}
