import {
  ConfigReader,
  type ReceivedPermission,
  TemplateService,
  getDiscoveryPaths,
  modelPermissions,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

export const ModelPermissions = command({
  name: 'model-permissions',
  args: {
    projectQuery: positional({
      type: string,
      displayName: 'projectQuery',
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
      )
      const chainConfigs = configReader
        .readAllChainsForProject(project)
        .flatMap((chain) => configReader.readConfig(project, chain))
      for (const config of chainConfigs) {
        const discovery = configReader.readDiscovery(config.name, config.chain)
        for (const entry of discovery.entries) {
          const ultimatePermissionsForEntry = ultimatePermissions.filter(
            (p) =>
              // TODO: uncomment this
              // p.receiver.startsWith(`${config.chain}:${entry.address}`),
              p.receiver.startsWith(`${entry.address}`) &&
              p.receiverChain === config.chain,
          )
          if (ultimatePermissionsForEntry.length > 0) {
            entry.receivedPermissions = reverseVia(
              sortReceivedPermissions(
                ultimatePermissionsForEntry.map((p) => {
                  const { receiver, receiverChain, ...rest } = p
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
function sortReceivedPermissions(p: ReceivedPermission[]) {
  return p.sort((a, b) => {
    if (a.permission === b.permission) {
      if (a.from === b.from) {
        const aDescription = a.description ?? ''
        const bDescription = b.description ?? ''
        if (aDescription === bDescription) {
          const aViaLength = a.via?.length ?? 0
          const bViaLength = b.via?.length ?? 0
          return bViaLength - aViaLength
        }
        return aDescription.localeCompare(bDescription)
      }
      return a.from.localeCompare(b.from)
    }
    return a.permission.localeCompare(b.permission)
  })
}
