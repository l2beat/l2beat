import { Logger } from '@l2beat/backend-tools'
import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { TemplateService } from '../discovery/analysis/TemplateService'
import { ConfigReader } from '../discovery/config/ConfigReader'
import {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from '../discovery/config/getDiscoveryPaths'
import { combinePermissionsIntoDiscovery } from '../discovery/modelling/combinePermissionsIntoDiscovery'
import {
  clusterEntries,
  findStaleReferences,
  loadDiscoveriesForModelling,
  modelPermissions,
} from '../discovery/modelling/modelPermissions'
import { saveDiscoveredJson } from '../discovery/output/saveDiscoveryResult'
import { sortEntry } from '../discovery/output/toDiscoveryOutput'
import type {
  EntryParameters,
  PermissionsOutput,
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
  logger.info('Reading all related discoveries:')
  const discoveries = loadDiscoveriesForModelling(project, configReader, logger)

  const ultimatePermissions = await modelPermissions(
    project,
    discoveries,
    configReader,
    templateService,
    paths,
    { debug },
  )

  const staleReferences = findStaleReferences(
    discoveries,
    ultimatePermissions.modelledAgainst,
  )
  if (staleReferences.length > 0) {
    logger.info('\n' + formatStaleReferencesWarning(project, staleReferences))
  }

  await writePermissionsIntoDiscovery(
    project,
    ultimatePermissions,
    configReader,
    clusterEntries(discoveries),
  )
}

export async function writePermissionsIntoDiscovery(
  project: string,
  permissionsOutput: PermissionsOutput,
  configReader: ConfigReader,
  clusterEntries: EntryParameters[],
) {
  const discovery = configReader.readDiscovery(project)
  combinePermissionsIntoDiscovery(discovery, permissionsOutput, clusterEntries)

  const projectDiscoveryFolder = configReader.getProjectPath(project)
  discovery.entries = discovery.entries.map((e) => sortEntry(e))
  await saveDiscoveredJson(discovery, projectDiscoveryFolder)
}

function formatStaleReferencesWarning(
  project: string,
  staleReferences: string[],
): string {
  return formatAsciiBorder([
    'A mismatch has been detected between the committed permissions and the current config of a referenced project.',
    '',
    'WHAT HAPPENED?',
    `• config.jsonc or model.lp changed after permissions were last modelled for: ${chalk.yellow(staleReferences.join(', '))}`,
    `• ${project} was modelled against the current inputs, so the result written here is up to date.`,
    '• The referenced discovered.json still holds permissions derived from the previous inputs.',
    '',
    'HOW TO FIX IT:',
    '1. Remodel the outdated referenced project(s):',
    ...staleReferences.map(
      (name) => `    [${chalk.green(`l2b model-permissions ${name}`)}]`,
    ),
    '2. Commit their discovered.json and diffHistory.md together with this change.',
    '',
    chalk.yellowBright('WARNING:'),
    chalk.yellowBright(
      '• Other projects referencing them keep permissions modelled against the previous inputs.',
    ),
    chalk.yellowBright(
      '• Remodel those consumers as well if they should follow this change.',
    ),
  ])
}
