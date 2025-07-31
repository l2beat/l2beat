import {
  ConfigReader,
  colorize,
  combineStructureAndColor,
  DiscoveryRegistry,
  generateClingoForDiscoveries,
  generatePermissionConfigHash,
  getDependenciesToDiscoverForProject,
  getDiscoveryPaths,
  makeEntryStructureConfig,
  TemplateService,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isDeepStrictEqual } from 'util'
import { bridges } from '../../processing/bridges'
import { layer2s } from '../../processing/layer2s'
import { layer3s } from '../../processing/layer3s'

const paths = getDiscoveryPaths()
const configReader = new ConfigReader(paths.discovery)

// A list of onchain projects that are not L2s (or prelaunch) or bridges
// (so we don't show them on the frontend), but we still
// want to monitor using discovery.
export const onChainProjects: string[] = [
  'blobstream',
  'eigenda',
  'shared-eigenlayer',
  'swell',
  'worldcoin',
  'cronoszkevm',
  'nebraupa',
  'vector',
  'espresso',
  'dydx',
  'tokens',
  'gateway',
  'hibachi',
  'opcm16',
  ...configReader.getProjectsInGroup('tokens'),
]

describe('discovery config.jsonc', () => {
  const templateService = new TemplateService(paths.discovery)

  const chainConfigs = configReader
    .readAllDiscoveredProjects()
    .flatMap(({ project, chains }) =>
      chains.map((chain) => configReader.readConfig(project, chain)),
    )

  const projectIds = layer2s
    .map((p) => p.id.toString())
    .concat(bridges.map((p) => p.id.toString()))
    .concat(layer3s.map((p) => p.id.toString()))
    .concat(onChainProjects)

  it('every config name corresponds to ProjectId', () => {
    const notCorresponding =
      chainConfigs
        ?.flat()
        ?.filter((c) => !c.name.startsWith('shared-'))
        // TODO!: Please remove this check once transporter bridge is back in the config
        ?.filter((c) => c.name !== 'transporter')
        ?.filter((c) => !projectIds.includes(c.name))
        .map((c) => c.name) ?? []

    expect(notCorresponding).toBeEmpty()
    if (notCorresponding.length > 0) {
      console.log(
        'Following projects do not have the same name as ProjectIds: ' +
          notCorresponding.join(', ') +
          '. Add them to config/src/projects/[layer2s|bridges|layer3s|onChainProjects]',
      )
    }
  })

  it('every config name is equal to the name in discovery.json', () => {
    const notEqual = []

    for (const c of chainConfigs) {
      const discovery = configReader.readDiscovery(c.name, c.chain)
      if (discovery.name !== c.name) {
        notEqual.push(c.name)
      }
    }

    expect(notEqual).toBeEmpty()
    notEqual.forEach((p) => {
      console.log(
        `Following projects do not have the same name in config and discovery.json. Run "l2b discover <config.name>" - ${p}`,
      )
    })
  })

  it('every discovery.json has sorted entries', () => {
    const notSorted: string[] = []

    for (const c of chainConfigs ?? []) {
      const discovery = configReader.readDiscovery(c.name, c.chain)

      if (
        !isDeepStrictEqual(
          discovery.entries,
          discovery.entries
            .slice()
            .sort((a, b) => a.address.localeCompare(b.address.toString())),
        )
      ) {
        notSorted.push(c.name)
      }
    }

    assert(
      notSorted.length === 0,
      'Following projects do not have sorted entries: ' + notSorted.join(', '),
    )
  })

  it('committed discovery config hash, template hashes and shapeFilesHash are up to date', () => {
    for (const c of chainConfigs) {
      const discovery = configReader.readDiscovery(c.name, c.chain)
      const reason = templateService.discoveryNeedsRefresh(discovery, c)

      assert(
        reason === undefined,
        `${c.chain}/${c.name} project is outdated: ${reason}.\n Run "l2b refresh-discovery"`,
      )
    }
  })

  it('discovery.json does not include errors', () => {
    for (const c of chainConfigs) {
      const discovery = configReader.readDiscovery(c.name, c.chain)

      assert(
        discovery.entries.every((c) => c.errors === undefined),
        `${c.name} discovery.json includes errors. Run "l2b discover ${c.name}".`,
      )
    }
  })

  describe('overrides', () => {
    // this test ensures that every named override resolves to an address
    // do not remove it unless you know what you are doing
    describe('every override correspond to existing contract', () => {
      for (const c of chainConfigs ?? []) {
        for (const key of Object.keys(c.structure.overrides ?? {})) {
          it(`${c.name} on ${c.chain} with the override ${key}`, () => {
            expect(() =>
              makeEntryStructureConfig(c.structure, ChainSpecificAddress(key)),
            ).not.toThrow()
          })
        }
      }
    })

    describe('all shared modules exist', () => {
      for (const c of chainConfigs ?? []) {
        it(`${c.name} on ${c.chain}`, () => {
          for (const sharedModule of c.structure.sharedModules) {
            assert(
              chainConfigs?.flat()?.some((x) => x.name === sharedModule),
              `Shared module ${sharedModule} does not exist (${c.name})`,
            )
          }
        })
      }
    })

    // inversion logic depends on this
    describe('all accessControl fields keys are accessControl', () => {
      for (const c of chainConfigs ?? []) {
        const discovery = configReader.readDiscovery(c.name, c.chain)
        it(`${c.name}:${c.chain}`, () => {
          for (const entry of discovery.entries) {
            const fields = makeEntryStructureConfig(
              c.structure,
              entry.address,
            ).fields
            for (const [key, value] of Object.entries(fields)) {
              if (
                value.handler?.type === 'accessControl' &&
                value.handler.pickRoleMembers === undefined
              ) {
                expect(key).toEqual('accessControl')
              }
            }
          }
        })
      }
    })
  })

  // TODO(radomski): We have to skip this test because we have to duplicate
  // names for different chains, we don't have a catch-all chain
  it.skip('every name in config.jsonc is unique', () => {
    for (const c of chainConfigs ?? []) {
      if (c.color.names === undefined) {
        continue
      }

      assert(
        new Set(Object.values(c.color.names)).size ===
          Object.values(c.color.names).length,
        `names field in ${c.name} configuration includes duplicate names`,
      )
    }
  })

  it('discovered.json hash matches the one stored in diffHistory.md', () => {
    for (const c of chainConfigs ?? []) {
      const currentHash = configReader.readDiscoveryHash(c.name, c.chain)
      const savedHash = configReader.readDiffHistoryHash(c.name, c.chain)
      assert(
        savedHash !== undefined,
        `The diffHistory.md of ${c.chain}:${c.name} has to contain a hash of the discovered.json. Perhaps you generated the discovered.json without generating the diffHistory.md?`,
      )
      assert(
        currentHash === savedHash,
        `The hash for ${c.chain}:${
          c.name
        } of your local discovered.json (${currentHash.toString()}) does not match the hash stored in the diffHistory.md (${savedHash.toString()}). Perhaps you generated the discovered.json without generating the diffHistory.md?`,
      )
    }
  })

  it('is colorized correctly', () => {
    for (const c of chainConfigs ?? []) {
      const discovery = configReader.readDiscovery(c.name, c.chain)
      const color = colorize(c.color, discovery, templateService)

      const colorized = combineStructureAndColor(discovery, color)
      const changed = JSON.stringify(discovery) !== JSON.stringify(colorized)
      assert(
        !changed,
        `${c.name} is not colorized correctly. Run l2b colorize.`,
      )
    }
  })

  it('model-permissions is up to date', () => {
    for (const c of chainConfigs) {
      const dependencies = getDependenciesToDiscoverForProject(
        c.name,
        configReader,
      )
      const discoveries = new DiscoveryRegistry()
      for (const dependency of dependencies) {
        const discovery = configReader.readDiscovery(
          dependency.project,
          dependency.chain,
        )
        discoveries.set(dependency.project, dependency.chain, discovery)
      }
      const clingoInput = generateClingoForDiscoveries(
        discoveries,
        configReader,
        templateService,
      )
      const hash = generatePermissionConfigHash(clingoInput)
      assert(
        hash ===
          discoveries.get(c.name, c.chain)?.discoveryOutput
            .permissionsConfigHash,
        [
          '',
          `Permissions model of "${c.name}" is not up to date.`,
          `Run \`l2b model-permissions ${c.name}\`.`,
          'or to refresh all projects: \`l2b model-permissions all\`.',
          '',
        ].join('\n\n'),
      )
    }
  }).timeout(10000)

  describe('every chain in a project has the same timestamp', () => {
    const projects = configReader.readAllDiscoveredProjects()
    for (const { project, chains } of projects) {
      it(`${project}`, () => {
        const timestamps = chains.map(
          (c) => configReader.readDiscovery(project, c).timestamp,
        )

        expect(timestamps.every((t) => t === timestamps[0])).toEqual(true)
      })
    }
  })
})
