import type { ConfigReader, ConfigWriter } from '@l2beat/discovery'
import { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import { ChainSpecificAddress, formatJson, parseJsonc } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'

export const LOCAL_ENTRYPOINTS_IMPORT = './entrypoints.json'

export function validateEntrypointsFileContent(
  content: string,
): { success: true } | { success: false; message: string } {
  try {
    const parsed = parseJsonc(content) as {
      entrypoints?: Record<string, unknown>
    }

    if (parsed.entrypoints === undefined) {
      return { success: true }
    }

    for (const [address, entrypoint] of Object.entries(parsed.entrypoints)) {
      ChainSpecificAddress(address)
      const result = Entrypoint.safeValidate(entrypoint)
      if (!result.success) {
        return { success: false, message: result.message }
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, message: String(error) }
  }
}

export function ensureProjectSharedModule(
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  consumerProject: string,
  moduleProject: string,
): boolean {
  if (consumerProject === moduleProject) {
    return false
  }

  const configPath = configReader.getConfigPath(consumerProject)
  const raw = parseJsonc(readFileSync(configPath, 'utf-8')) as {
    sharedModules?: string[]
  }
  const sharedModules = raw.sharedModules ?? []

  if (sharedModules.includes(moduleProject)) {
    return false
  }

  configWriter.updateRawConfigFile(
    consumerProject,
    formatJson({
      ...raw,
      sharedModules: [...sharedModules, moduleProject],
    }),
  )
  return true
}

export function ensureProjectEntrypointsImport(
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  project: string,
): boolean {
  const configPath = configReader.getConfigPath(project)
  const raw = parseJsonc(readFileSync(configPath, 'utf-8')) as {
    import?: string[]
  }
  const imports = raw.import ?? []

  if (imports.includes(LOCAL_ENTRYPOINTS_IMPORT)) {
    return false
  }

  configWriter.updateRawConfigFile(
    project,
    formatJson({
      ...raw,
      import: [...imports, LOCAL_ENTRYPOINTS_IMPORT],
    }),
  )
  return true
}
