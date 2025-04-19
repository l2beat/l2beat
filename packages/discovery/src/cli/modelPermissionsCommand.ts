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
import type { ReceivedPermission } from '../discovery/output/types'

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

  const chainConfigs = configReader
    .readAllChainsForProject(project)
    .flatMap((chain) => configReader.readConfig(project, chain))
  for (const config of chainConfigs) {
    const discovery = configReader.readDiscovery(config.name, config.chain)
    for (const entry of discovery.entries) {
      // .receivedPermissions
      const ultimatePermissionsForEntry = ultimatePermissions.filter(
        (p) =>
          // TODO: uncomment this
          // p.receiver.startsWith(`${config.chain}:${entry.address}`),
          p.receiver.startsWith(`${entry.address}`) &&
          p.receiverChain === config.chain &&
          p.isFinal,
      )
      if (ultimatePermissionsForEntry.length === 0) {
        entry.receivedPermissions = undefined
      } else {
        entry.receivedPermissions = reverseVia(
          sortReceivedPermissions(
            ultimatePermissionsForEntry.map((p) => {
              const { receiver, receiverChain, isFinal, ...rest } = p
              return rest
            }),
          ),
        )
      }

      // .directlyReceivedPermissions
      const directlyReceivedPermissionsForEntry = ultimatePermissions.filter(
        (p) =>
          // TODO: uncomment this
          // p.receiver.startsWith(`${config.chain}:${entry.address}`),
          p.receiver.startsWith(`${entry.address}`) &&
          p.receiverChain === config.chain &&
          !p.isFinal,
      )
      if (directlyReceivedPermissionsForEntry.length === 0) {
        entry.directlyReceivedPermissions = undefined
      } else {
        entry.directlyReceivedPermissions = reverseVia(
          sortReceivedPermissions(
            directlyReceivedPermissionsForEntry.map((p) => {
              const { receiver, receiverChain, isFinal, ...rest } = p
              return rest
            }),
          ),
        )
      }
    }
    const projectDiscoveryFolder = configReader.getProjectChainPath(
      config.name,
      config.chain,
    )

    discovery.entries = discovery.entries.map((e) => sortEntry(e))
    await saveDiscoveredJson(discovery, projectDiscoveryFolder)
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
