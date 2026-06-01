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

/** Reverse of {@link ensureProjectSharedModule}: drop the link when an
 * entrypoint that pulled the module in is removed. */
export function removeProjectSharedModule(
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

  if (!sharedModules.includes(moduleProject)) {
    return false
  }

  const nextSharedModules = sharedModules.filter(
    (module) => module !== moduleProject,
  )
  const nextRaw: { sharedModules?: string[] } & Record<string, unknown> = {
    ...raw,
  }
  if (nextSharedModules.length > 0) {
    nextRaw.sharedModules = nextSharedModules
  } else {
    delete nextRaw.sharedModules
  }

  configWriter.updateRawConfigFile(consumerProject, formatJson(nextRaw))
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

/**
 * Whether a project ships an entrypoints.json at all. Such a project is
 * "entrypoint-managed": its declared list is authoritative, so an empty list
 * means no entrypoint groups (rather than falling back to a whole-module group).
 */
export function hasEntrypointsFile(
  configReader: ConfigReader,
  moduleProject: string,
): boolean {
  try {
    const filePath = join(
      configReader.getProjectPath(moduleProject),
      'entrypoints.json',
    )
    return existsSync(filePath)
  } catch {
    return false
  }
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
