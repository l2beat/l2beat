import {
  ConfigReader,
  type ReceivedPermission,
  TemplateService,
  getDiscoveryPaths,
  modelPermissions,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'
import { sortEntry } from '@l2beat/discovery/dist/discovery/output/toDiscoveryOutput'

export const ModelPermissions = command({
  name: 'model-permissions',
  args: {
    projectQuery: positional({
      type: string,
      displayName: 'projectQuery',
    }),
    debug: flag({
      type: boolean,
      long: 'debug',
      short: 'd',
      description: 'Keep debug Clingo files',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    let projects = [args.projectQuery]
    if (args.projectQuery === 'all') {
      projects = configReader
        .readAllChains()
        .flatMap((chain) => configReader.readAllProjectsForChain(chain))
    }
    for (const project of projects) {
      console.log(`Modelling: ${project}`)
      const ultimatePermissions = await modelPermissions(
        project,
        configReader,
        templateService,
        paths,
        args.debug,
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
          const directlyReceivedPermissionsForEntry =
            ultimatePermissions.filter(
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

        updateDiffHistory(config.name, config.chain)
      }
    }
  },
})

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
