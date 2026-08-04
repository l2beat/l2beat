import type { Logger } from '@l2beat/backend-tools'
import chalk from 'chalk'
import type { ConfigReader } from '../discovery/config/ConfigReader'
import type { StructureConfig } from '../discovery/config/StructureConfig'

export interface EntrypointConsumer {
  project: string
  addressCount: number
}

// Only a project that owns entrypoints can be referenced by another one, so
// this gates the scan below. Every config imports globalEntrypoints.jsonc, so
// `entrypoints` holds all of them and the owner is read off the entry itself.
export function ownsEntrypoints(
  config: Pick<StructureConfig, 'name' | 'entrypoints'>,
): boolean {
  return Object.values(config.entrypoints ?? {}).some(
    (entrypoint) => entrypoint.project === config.name,
  )
}

export function findEntrypointConsumers(
  configReader: ConfigReader,
  project: string,
): EntrypointConsumer[] {
  const consumers: EntrypointConsumer[] = []
  for (const candidate of configReader.readAllDiscoveredProjects()) {
    if (candidate === project) {
      continue
    }
    const addressCount = configReader
      .readDiscovery(candidate)
      .entries.filter(
        (entry) =>
          entry.type === 'Reference' && entry.targetProject === project,
      ).length
    if (addressCount > 0) {
      consumers.push({ project: candidate, addressCount })
    }
  }
  consumers.sort((a, b) => b.addressCount - a.addressCount)
  return consumers
}

export function printEntrypointConsumers(
  logger: Logger,
  consumers: EntrypointConsumer[],
) {
  if (consumers.length === 0) {
    return
  }
  logger.info(
    `\n    -----=====[ ${chalk.red('REFERENCED ENTRYPOINTS DETECTED!')} ]=====-----`,
  )
  logger.info('\nAny changes to it will affect the following projects:')
  for (const { project, addressCount } of consumers) {
    const suffix = addressCount === 1 ? 'address' : 'addresses'
    logger.info(
      `    - ${chalk.green(project)} ${chalk.gray(`(${addressCount} ${suffix})`)}`,
    )
  }
}
