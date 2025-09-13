import {
  ConfigReader,
  type DiscoveryOutput,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

describe('discovery config.jsonc', () => {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const configs = configReader
    .readAllDiscoveredProjects()
    .flatMap((project) => configReader.readConfig(project))

  const discoveries: Record<string, DiscoveryOutput> = {}
  for (const c of configs) {
    discoveries[c.name] = configReader.readDiscovery(c.name)
  }

  const getDiscovery = (project: string) => {
    const discovery = discoveries[project]
    assert(discovery)
    return discovery
  }

  it("doesn't discover any entrypoint that should only be referenced", () => {
    for (const c of configs ?? []) {
      const discovery = getDiscovery(c.name)
      const entrypoints = c.structure.entrypoints ?? {}
      for (const entry of discovery.entries) {
        const existingEntrypoint = entrypoints[entry.address]
        if (
          existingEntrypoint &&
          existingEntrypoint.project !== c.name &&
          !existingEntrypoint.isLegacy
        ) {
          assert(
            entry.type === 'Reference',
            [
              `In project ${c.name}, contract ${entry.name ?? ''}(${entry.address})`,
              'is discovered but it should be a reference to entrypoint',
              `in ${existingEntrypoint.project} project`,
            ].join(' '),
          )
        }
      }
    }
  })

  // TODO: Enable this test once all .sharedModules are converted to entrypoints
  it.skip("doesn't reference legacy or not existing entrypoints", () => {
    for (const c of configs ?? []) {
      const discovery = getDiscovery(c.name)
      const entrypoints = c.structure.entrypoints ?? {}
      for (const entry of discovery.entries) {
        if (entry.type === 'Reference') {
          const existingEntrypoint = entrypoints[entry.address]
          assert(
            existingEntrypoint !== undefined,
            [
              `In project ${c.name}, contract ${entry.name ?? ''}(${entry.address})`,
              "is a reference, but this entrypoint doesn't exist",
            ].join(' '),
          )
          assert(
            !existingEntrypoint.isLegacy,
            [
              `In project ${c.name}, contract ${entry.name ?? ''}(${entry.address})`,
              "is a reference but it's a legacy entrypoint",
            ].join(' '),
          )
        }
      }
    }
  })

  it('has full discovery of each non-legacy entrypoint in its project', () => {
    // Get any config to have access to entrypoints from globalConfig.json
    const config = configs[0]
    for (const [addr, entrypoint] of Object.entries(
      config.structure.entrypoints ?? {},
    )) {
      const discovery = getDiscovery(entrypoint.project)
      if (entrypoint.isLegacy) {
        assert(
          discovery.entries.every((e) => e.address !== addr),
          `Entrypoint for ${addr} is marked as legacy but it\'s fully discovered in ${discovery.name}`,
        )
      } else {
        assert(
          discovery.entries.some(
            (e) => e.address === addr && e.type !== 'Reference',
          ),
          `Entrypoint for ${addr} is not fully discovered in its project ${entrypoint.project}`,
        )
      }
    }
  })
})
