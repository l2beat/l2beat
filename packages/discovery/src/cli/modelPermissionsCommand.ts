import { Logger } from '@l2beat/backend-tools'
import { TemplateService } from '../discovery/analysis/TemplateService'
import { ConfigReader } from '../discovery/config/ConfigReader'
import {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from '../discovery/config/getDiscoveryPaths'
import { modelPermissions } from '../discovery/modelling/modelPermissions'
import { saveDiscoveredJson } from '../discovery/output/saveDiscoveryResult'
import { sortEntry } from '../discovery/output/toDiscoveryOutput'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
  ReceivedPermission,
} from '../discovery/output/types'

export async function modelPermissionsCommand(
  project: string,
  configReader?: ConfigReader,
  templateService?: TemplateService,
  paths?: DiscoveryPaths,
  debug?: boolean,
  logger: Logger = Logger.DEBUG,
) {
  paths = paths ?? getDiscoveryPaths()
  configReader = configReader ?? new ConfigReader(paths.discovery)
  templateService = templateService ?? new TemplateService(paths.discovery)
  debug = debug ?? false

  logger.info(`Modelling: ${project}`)
  const ultimatePermissions = await modelPermissions(
    project,
    configReader,
    templateService,
    paths,
    debug,
  )

  await writePermissionsIntoDiscovery(
    project,
    ultimatePermissions,
    configReader,
  )
}

export async function writePermissionsIntoDiscovery(
  project: string,
  permissionsOutput: PermissionsOutput,
  configReader: ConfigReader,
) {
  const chainConfigs = configReader
    .readAllChainsForProject(project)
    .flatMap((chain) => configReader.readConfig(project, chain))

  for (const config of chainConfigs) {
    const discovery = configReader.readDiscovery(config.name, config.chain)
    combinePermissionsIntoDiscovery(discovery, permissionsOutput)

    const projectDiscoveryFolder = configReader.getProjectChainPath(
      config.name,
      config.chain,
    )
    discovery.entries = discovery.entries.map((e) => sortEntry(e))
    await saveDiscoveredJson(discovery, projectDiscoveryFolder)
  }
}

export async function combinePermissionsIntoDiscovery(
  discovery: DiscoveryOutput,
  permissionsOutput: PermissionsOutput,
) {
  const updateRelevantField = (
    entry: EntryParameters,
    field: keyof EntryParameters,
    value: ReceivedPermission[] | undefined,
  ) => {
    if (field === 'receivedPermissions') {
      entry.receivedPermissions = value
    } else if (field === 'directlyReceivedPermissions') {
      entry.directlyReceivedPermissions = value
    } else {
      throw new Error(`Not a permission field: ${field}`)
    }
  }

  discovery.permissionsConfigHash = permissionsOutput.permissionsConfigHash

  for (const entry of discovery.entries) {
    const permissionKeys: (keyof EntryParameters)[] = [
      'receivedPermissions',
      'directlyReceivedPermissions',
    ]
    for (const key of permissionKeys) {
      const ultimatePermissionsForEntry = permissionsOutput.permissions.filter(
        (p) =>
          p.receiver.startsWith(`${entry.address}`) &&
          p.receiverChain === discovery.chain &&
          (key === 'receivedPermissions' ? p.isFinal : !p.isFinal),
      )
      const permissions =
        ultimatePermissionsForEntry.length === 0
          ? undefined
          : reverseVia(
              sortReceivedPermissions(
                ultimatePermissionsForEntry.map((p) => {
                  // Remove some fields for backwards compatibility
                  const { receiver, receiverChain, isFinal, ...rest } = p
                  return rest
                }),
              ),
            )
      updateRelevantField(entry, key, permissions)
    }
  }
}

// Temporary reversal of via for backwards compatibility
function reverseVia(p: ReceivedPermission[]) {
  return p.map((p) => {
    const { via, ...rest } = p
    if (!via) {
      return p
    }
    return {
      ...rest,
      via: via.reverse(),
    }
  })
}

function sortReceivedPermissions<T extends ReceivedPermission>(
  input: T[],
): T[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}
