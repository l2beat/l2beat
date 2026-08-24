import {
  ConfigReader,
  type DiscoveryOutput,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

interface RawEntrypointsFile {
  entrypoints?: Record<string, { project: string }>
}

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

  it('has exactly one owner project for each entrypoint address', () => {
    const owners = new Map<string, string>()

    for (const project of configReader.readAllDiscoveredProjects().sort()) {
      const filePath = join(
        configReader.getProjectPath(project),
        'entrypoints.json',
      )
      if (!existsSync(filePath)) continue

      const file = JSON.parse(
        readFileSync(filePath, 'utf8'),
      ) as RawEntrypointsFile
      for (const [rawAddress, entrypoint] of Object.entries(
        file.entrypoints ?? {},
      )) {
        const address = ChainSpecificAddress(rawAddress)
        assert(
          entrypoint.project === project,
          `Entrypoint ${address} in ${project} claims project ${entrypoint.project}`,
        )

        const owner = owners.get(address)
        assert(
          owner === undefined,
          `Entrypoint ${address} is claimed by both ${owner} and ${project}`,
        )
        owners.set(address, project)
      }
    }
  })

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

  it("doesn't reference legacy or not existing entrypoints", () => {
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
          // A stale targetProject makes readDiscoveryWithReferences read a
          // project that does not own the address, or throw when it no longer
          // exists at all.
          assert(
            entry.targetProject === existingEntrypoint.project,
            [
              `In project ${c.name}, contract ${entry.name ?? ''}(${entry.address})`,
              `references project ${entry.targetProject}`,
              `but the entrypoint is owned by ${existingEntrypoint.project}`,
            ].join(' '),
          )
        }
      }
    }
  })

  it('gives every referenced permission to an address of a referenced project', () => {
    for (const c of configs) {
      const discovery = getDiscovery(c.name)
      const referenced = configReader
        .readDiscoveryWithReferences(c.name)
        .slice(1)
        .flatMap((d) => d.entries)
        .filter((e) => e.type !== 'Reference')
        .map((e) => e.address)
      const owned = new Set(referenced)

      for (const address of Object.keys(
        discovery.referencedPermissions ?? {},
      )) {
        assert(
          owned.has(ChainSpecificAddress(address)),
          [
            `Project ${c.name} gives a referenced permission to ${address},`,
            'but no project it references discovered that address.',
          ].join(' '),
        )
      }
    }
  })

  // Otherwise a consumer would carry a copy of the shared module's own
  // permission graph, which belongs to the shared module.
  it('only stores referenced permissions given by its own contracts', () => {
    for (const c of configs) {
      const discovery = getDiscovery(c.name)
      const own = new Set(
        discovery.entries
          .filter((e) => e.type !== 'Reference')
          .map((e) => e.address),
      )

      for (const [address, permissions] of Object.entries(
        discovery.referencedPermissions ?? {},
      )) {
        const givers = [
          ...(permissions.receivedPermissions ?? []),
          ...(permissions.directlyReceivedPermissions ?? []),
        ].map((p) => p.from)
        for (const giver of givers) {
          assert(
            own.has(giver),
            [
              `Project ${c.name} stores a permission over ${giver} held by`,
              `${address}, but ${giver} is not one of its own contracts.`,
            ].join(' '),
          )
        }
      }
    }
  })

  it('sorts referenced permissions by address', () => {
    for (const c of configs) {
      const addresses = Object.keys(
        getDiscovery(c.name).referencedPermissions ?? {},
      )
      expect(addresses).toEqual([...addresses].sort())
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
