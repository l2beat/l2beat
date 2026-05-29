import type { ConfigReader, ConfigWriter } from '@l2beat/discovery'
import { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import { ChainSpecificAddress, formatJson, parseJsonc } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export const LOCAL_ENTRYPOINTS_IMPORT = './entrypoints.json'

/** Node color index stored in entrypoints.json (0 = auto, 1–10 = palette). */
export const ENTRYPOINT_COLOR_MAX = 10

export function parseEntrypointColor(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return undefined
  }
  if (value < 0 || value > ENTRYPOINT_COLOR_MAX) {
    return undefined
  }
  return value
}

export function validateEntrypointsFileContent(
  content: string,
): { success: true } | { success: false; message: string } {
  try {
    const parsed = parseJsonc(content) as {
      color?: unknown
      entrypoints?: Record<string, unknown>
    }

    if (parsed.color !== undefined) {
      const color = parseEntrypointColor(parsed.color)
      if (color === undefined) {
        return {
          success: false,
          message: `color must be an integer between 0 and ${ENTRYPOINT_COLOR_MAX}`,
        }
      }
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

export function readModuleEntrypoints(
  configReader: ConfigReader,
  moduleProject: string,
): Record<ChainSpecificAddress, Entrypoint> {
  try {
    const filePath = join(
      configReader.getProjectPath(moduleProject),
      'entrypoints.json',
    )
    if (!existsSync(filePath)) {
      return {}
    }
    const parsed = parseJsonc(readFileSync(filePath, 'utf-8')) as {
      entrypoints?: Record<string, unknown>
    }
    const result: Record<ChainSpecificAddress, Entrypoint> = {}
    for (const [address, entrypoint] of Object.entries(parsed.entrypoints ?? {})) {
      ChainSpecificAddress(address)
      const validated = Entrypoint.safeValidate(entrypoint)
      if (validated.success) {
        result[address as ChainSpecificAddress] = validated.data
      }
    }
    return result
  } catch {
    return {}
  }
}

export function readEntrypointsModuleColor(
  configReader: ConfigReader,
  moduleProject: string,
): number | undefined {
  try {
    const filePath = join(
      configReader.getProjectPath(moduleProject),
      'entrypoints.json',
    )
    if (!existsSync(filePath)) {
      return undefined
    }
    const parsed = parseJsonc(readFileSync(filePath, 'utf-8')) as {
      color?: unknown
    }
    return parseEntrypointColor(parsed.color)
  } catch {
    return undefined
  }
}
