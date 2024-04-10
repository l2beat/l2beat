import { bridges, layer2s, layer3s, onChainProjects } from '@l2beat/config'
import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isEqual } from 'lodash'

import { getDiffHistoryHash, getDiscoveryHash } from '../utils/hashing'

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()
  let chainConfigs: DiscoveryConfig[][] | undefined

  const projectIds = layer2s
    .map((p) => p.id.toString())
    .concat(bridges.map((p) => p.id.toString()))
    .concat(layer3s.map((p) => p.id.toString()))
    .concat(onChainProjects)

  before(async () => {
    chainConfigs = await Promise.all(
      configReader
        .readAllChains()
        .map((chain) => configReader.readAllConfigsForChain(chain)),
    )
  })

  it('every config name corresponds to ProjectId', () => {
    const notCorresponding =
      chainConfigs
        ?.flat()
        ?.filter((c) => !c.name.startsWith('l2beat-'))
        ?.filter((c) => !c.name.startsWith('shared-'))
        ?.filter((c) => !projectIds.includes(c.name))
        .map((c) => c.name) ?? []

    assert(
      notCorresponding.length === 0,
      'Following projects do not have the same name as ProjectIds: ' +
        notCorresponding.join(', ') +
        '. Add them to config/src/[layer2s|bridges|layer3s|onChainProjects]',
    )
  })

  it('every config name is equal to the name in discovery.json', async () => {
    const notEqual = []

    for (const configs of chainConfigs ?? []) {
      if (configs.length > 0) {
        for (const c of configs) {
          const discovery = await configReader.readDiscovery(c.name, c.chain)
          if (discovery.name !== c.name) {
            notEqual.push(c.name)
          }
        }
      }
    }

    assert(
      notEqual.length === 0,
      'Following projects do not have the same name in config and discovery.json. Run "yarn discover <config.name>"',
    )
  })

  it('fields inside ignoreInWatchMode exist in discovery', async () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = await configReader.readDiscovery(c.name, c.chain)

        for (const override of c.overrides) {
          if (override.ignoreDiscovery === true) {
            continue
          }

          if (override.ignoreInWatchMode === undefined) {
            continue
          }

          const contract = discovery.contracts.find(
            (c) => c.address === override.address,
          )

          const errorPrefix = `${c.name} (chain: ${
            c.chain
          }) - ${override.address.toString()}`

          assert(
            contract,
            `${errorPrefix} - contract does not exist in discovery.json`,
          )

          assert(
            contract.values,
            `${errorPrefix} - values does not exist for this contract in discovery.json`,
          )

          const ignore = override.ignoreInWatchMode
          const values = Object.keys(contract.values)

          assert(
            ignore.every((x) => values.includes(x)),
            `${errorPrefix} - [${ignore.join(
              ',',
            )}] - fields do not exist in discovery.json`,
          )
        }
      }
    }
  })

  it('every discovery.json has sorted contracts', async () => {
    const notSorted: string[] = []

    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = await configReader.readDiscovery(c.name, c.chain)

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

  it('committed discovery config hash matches committed config hash', async () => {
    const outdatedHashes: string[] = []
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = await configReader.readDiscovery(c.name, c.chain)

        if (discovery.configHash !== c.hash) {
          outdatedHashes.push(`${c.chain}-${c.name}`)
        }
      }
      assert(
        outdatedHashes.length === 0,
        `Following projects have outdated hashes (chain-project): ${outdatedHashes.join(
          ', ',
        )}. Run yarn discover <chain> <project>`,
      )
    }
  })

  it('discovery.json does not include errors', async () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = await configReader.readDiscovery(c.name, c.chain)

        assert(
          discovery.contracts.every((c) => c.errors === undefined),
          `${c.name} discovery.json includes errors. Run "yarn discover ${c.name}".`,
        )
      }
    }
  })

  describe('overrides', () => {
    // this test ensures that every named override resolves to an address
    // do not remove it unless you know what you are doing
    it('every override correspond to existing contract', async () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          for (const key of Object.keys(c.raw.overrides ?? {})) {
            if (!EthereumAddress.check(key)) {
              expect(() => c.overrides.get(key)).not.toThrow()
            }
          }
        }
      }
    })

    it('all shared modules exist', async () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          for (const sharedModule of c.sharedModules) {
            assert(
              chainConfigs?.flat()?.some((x) => x.name === sharedModule),
              `Shared module ${sharedModule} does not exist (${c.name})`,
            )
          }
        }
      }
    })

    // inversion logic depends on this
    it('all accessControl fields keys are accessControl', async () => {
      for (const configs of chainConfigs ?? []) {
        for (const c of configs) {
          for (const override of c.overrides) {
            if (override.fields === undefined) {
              continue
            }

            for (const [key, value] of Object.entries(override.fields)) {
              if (value.type === 'accessControl') {
                assert(
                  key === 'accessControl',
                  `${
                    c.name
                  } - ${override.address.toString()} - accessControl field must be named accessControl`,
                )
              }
            }
          }
        }
      }
    })
  })

  it('every name in config.jsonc is unique', async () => {
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

  it('meta.json is of correct schema', async () => {
    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        await expect(
          async () => await configReader.readMeta(c.name, c.chain),
        ).not.toBeRejected()
      }
    }
  })
})
