import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviders,
  ConfigReader,
  type ConfigRegistry,
  combinePermissionsIntoDiscovery,
  type DiscoveryEngine,
  type DiscoveryOutput,
  DiscoveryRegistry,
  flattenDiscoveredSources,
  getDiscoveryPaths,
  loadDiscoveriesForModelling,
  modelPermissions,
  remapDiscoverySourceNames,
  type TemplateService,
  toRawDiscoveryOutput,
} from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  type UnixTime,
  unique,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import isError from 'lodash/isError'

export interface DiscoveryRunnerOptions {
  logger: Logger
  maxRetries?: number
  retryDelayMs?: number
}

export interface DiscoveryRunResult {
  discovery: DiscoveryOutput
  flatSources: Record<string, string>
}

export class DiscoveryRunner {
  constructor(
    private readonly allProviders: AllProviders,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly templateService: TemplateService,
  ) {}

  private async discover(
    projectName: string,
    discoveryTimestamp: number,
    logger: Logger,
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    logger.info(
      `Attempting discovery of ${projectName} at timestamp ${discoveryTimestamp}`,
    )

    const discoveryPaths = getDiscoveryPaths()
    configReader ??= new ConfigReader(discoveryPaths.discovery)

    const discoveries = await this.discoverMany(
      [projectName],
      discoveryTimestamp,
      configReader,
      logger,
    )
    // Projects reached through an entrypoint are deliberately not
    // rediscovered: modelling runs against their committed discovery, and
    // keeping the two sides in sync is handled through Update Monitor.
    addReferencedDiscoveries(discoveries, projectName, configReader, logger)

    const permissionsOutput = await modelPermissions(
      projectName,
      discoveries,
      configReader,
      this.templateService,
      discoveryPaths,
      { debug: false },
    )
    const projectDiscovery = discoveries.get(projectName)
    combinePermissionsIntoDiscovery(
      projectDiscovery.discoveryOutput,
      permissionsOutput,
    )

    assert(projectDiscovery.analysis)
    // TODO: Should not be here - drop it and use implementation name once it's ready
    // if somebody changes the name and decides to re-colorize
    // then .flat folder will be incorrect
    const remappedResults = remapDiscoverySourceNames(
      projectDiscovery.analysis,
      projectDiscovery.discoveryOutput,
    )
    const flatSources = flattenDiscoveredSources(remappedResults, Logger.SILENT)

    return {
      discovery: withoutUndefinedKeys(projectDiscovery.discoveryOutput),
      flatSources,
    }
  }

  private async discoverMany(
    toDiscover: string[],
    dependencyTimestamp: number,
    configReader: ConfigReader,
    logger: Logger,
  ) {
    const discoveries = new DiscoveryRegistry()
    for (const dependency of toDiscover) {
      const dependencyConfig = configReader.readConfig(dependency)
      logger.info(
        `Discovering ${dependencyConfig.name} at timestamp ${dependencyTimestamp}`,
      )
      const { analyses } = await this.discoveryEngine.discover(
        this.allProviders,
        dependencyConfig.structure,
        dependencyTimestamp,
      )

      const chains = unique(
        analyses.map((c) => ChainSpecificAddress.longChain(c.address)),
      )

      const usedBlockNumbers: Record<string, number> = {}
      for (const chain of chains) {
        const provider = await this.allProviders.get(chain, dependencyTimestamp)
        usedBlockNumbers[chain] = provider.blockNumber
      }

      const discovery = toRawDiscoveryOutput(
        this.templateService,
        dependencyConfig,
        dependencyTimestamp,
        usedBlockNumbers,
        analyses,
      )
      discoveries.set(dependency, discovery, analyses)
    }
    return discoveries
  }

  async run(
    config: ConfigRegistry,
    timestamp: UnixTime,
    logger: Logger,
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    try {
      return await this.discover(config.name, timestamp, logger, configReader)
    } catch (error) {
      const err = isError(error)
        ? (error as Error)
        : new Error(JSON.stringify(error))
      const errorString = JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2,
      )

      logger.warn(
        `DiscoveryRunner: Failed to discover ${config.name} - error: ${errorString}`,
      )
      throw err
    }
  }
}

// The freshly discovered project stays authoritative, everything it references
// is filled in from disk.
function addReferencedDiscoveries(
  discoveries: DiscoveryRegistry,
  projectName: string,
  configReader: ConfigReader,
  logger: Logger,
): void {
  let referenced: DiscoveryRegistry
  try {
    referenced = loadDiscoveriesForModelling(projectName, configReader)
  } catch (error) {
    // One broken reference must not take down the whole update loop.
    logger.error(
      `Could not read referenced discoveries of ${projectName}`,
      error,
    )
    return
  }

  for (const project of referenced.getSortedProjects()) {
    if (project === projectName) {
      continue
    }
    logger.info(`Modelling against referenced project ${project}`)
    discoveries.set(project, referenced.get(project).discoveryOutput)
  }
}
