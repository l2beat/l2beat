import { bridges, layer2s, layer3s, onChainProjects } from '@l2beat/config'
import { ConfigReader, TemplateService } from '@l2beat/discovery'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isEqual } from 'lodash'
import { discoveryNeedsRefresh } from '../../../tools/discoveryNeedsRefresh'
import { getDiffHistoryHash, getDiscoveryHash } from '../utils/hashing'

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()
  const templateService = new TemplateService()

  const chainConfigs = configReader
    .readAllChains()
    .map((chain) => configReader.readAllConfigsForChain(chain))

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

    for (const configs of chainConfigs) {
      for (const c of configs) {
        const discovery = configReader.readDiscovery(c.name, c.chain)
        if (discovery.name !== c.name) {
          notEqual.push(c.name)
        }
      }
    }

    expect(notEqual).toBeEmpty()
    notEqual.forEach((p) => {
      console.log(
        `Following projects do not have the same name in config and discovery.json. Run "pnpm discover <config.name>" - ${p}`,
      )
    })
  })

  it('every discovery.json has sorted contracts', () => {
    const notSorted: string[] = []

    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = configReader.readDiscovery(c.name, c.chain)

        if (
          !isEqual(
            discovery.contracts,
            discovery.contracts
              .slice()
              .sort((a, b) => a.address.localeCompare(b.address.toString())),
          )
        ) {
          notSorted.push(c.name)
        }
      }
    }

    assert(
      notSorted.length === 0,
      'Following projects do not have sorted contracts: ' +
        notSorted.join(', '),
    )
  })

  it('committed discovery config hash, template hashes and shapeFilesHash are up to date', () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = configReader.readDiscovery(c.name, c.chain)

        const needsDiscoveryReason = discoveryNeedsRefresh(
          discovery,
          c,
          templateService,
        )
        assert(
          needsDiscoveryReason === undefined,
          `${c.chain}/${c.name} project is outdated: ${needsDiscoveryReason}.\n Run "pnpm refresh-discovery"`,
        )
      }
    }
  })

  it('discovery.json does not include errors', () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = configReader.readDiscovery(c.name, c.chain)

        assert(
          discovery.contracts.every((c) => c.errors === undefined),
          `${c.name} discovery.json includes errors. Run "pnpm discover ${c.name}".`,
        )
      }
    }
  })

  describe('overrides', () => {
    // this test ensures that every named override resolves to an address
    // do not remove it unless you know what you are doing
    describe('every override correspond to existing contract', () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          it(`${c.name} on ${c.chain}`, () => {
            for (const key of Object.keys(c.raw.overrides ?? {})) {
              if (!EthereumAddress.check(key)) {
                expect(() => c.overrides.get(key)).not.toThrow()
              }
            }
          })
        }
      }
    })

    describe('all shared modules exist', () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          it(`${c.name} on ${c.chain}`, () => {
            for (const sharedModule of c.sharedModules) {
              assert(
                chainConfigs?.flat()?.some((x) => x.name === sharedModule),
                `Shared module ${sharedModule} does not exist (${c.name})`,
              )
            }
          })
        }
      }
    })

    // inversion logic depends on this
    describe('all accessControl fields keys are accessControl', () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          it(`${c.name}:${c.chain}`, () => {
            for (const override of c.overrides) {
              for (const [key, value] of Object.entries(
                override.fields ?? {},
              )) {
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
      }
    })
  })

  it('every name in config.jsonc is unique', () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        if (c.raw.names === undefined) {
          continue
        }

        assert(
          new Set(Object.values(c.raw.names)).size ===
            Object.values(c.raw.names).length,
          `names field in ${c.name} configuration includes duplicate names`,
        )
      }
    }
  })

  it('discovered.json hash matches the one stored in diffHistory.md', async () => {
    for (const configs of chainConfigs ?? []) {
      if (configs.length > 0) {
        for (const c of configs) {
          const diffHistoryPath = `./discovery/${c.name}/${c.chain}/diffHistory.md`
          const currentHash = await getDiscoveryHash(c.name, c.chain)
          const savedHash = getDiffHistoryHash(diffHistoryPath)
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
      }
    }
  })
})
