import { bridges, layer2s } from '@l2beat/config'
import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { assert, ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isEqual } from 'lodash'

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()
  let chainConfigs: DiscoveryConfig[][] | undefined

  const projectIds = layer2s
    .map((p) => p.id.toString())
    .concat(bridges.map((p) => p.id.toString()))

  before(async () => {
    chainConfigs = await Promise.all(
      ChainId.getAll().map(
        async (chainId) => await configReader.readAllConfigsForChain(chainId),
      ),
    )
  })

  it(`every config name corresponds to ProjectId`, () => {
    const notCorresponding =
      chainConfigs
        ?.flat()
        ?.filter((c) => !c.name.startsWith('l2beat-'))
        ?.filter((c) => !projectIds.includes(c.name))
        .map((c) => c.name) ?? []

    assert(
      notCorresponding.length === 0,
      'Following projects do not have the same name as ProjectIds: ' +
        notCorresponding.join(', '),
    )
  })

  it(`every config name is equal to the name in discovery.json`, async () => {
    const notEqual = []

    for (const configs of chainConfigs ?? []) {
      if (configs.length > 0) {
        for (const c of configs) {
          const discovery = await configReader.readDiscovery(c.name, c.chainId)
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
        const discovery = await configReader.readDiscovery(c.name, c.chainId)

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

          const errorPrefix = `${c.name} (chain: ${ChainId.getName(
            c.chainId,
          )}) - ${override.address.toString()}`

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

  it(`every discovery.json has sorted contracts`, async () => {
    const notSorted: string[] = []

    for (const configs of chainConfigs ?? []) {
      for (const c of configs) {
        const discovery = await configReader.readDiscovery(c.name, c.chainId)

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
        const discovery = await configReader.readDiscovery(c.name, c.chainId)

        if (discovery.configHash !== c.hash) {
          outdatedHashes.push(`${ChainId.getName(c.chainId)}-${c.name}`)
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
        const discovery = await configReader.readDiscovery(c.name, c.chainId)

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

  describe('names', () => {
    // TODO: L2B-1235
    // it('every name correspond to existing contract', async () => {
    //   for (const config of configs ?? []) {
    //     const discovery = await configReader.readDiscovery(config.name)

    //     assert(
    //       Object.keys(config.names ?? {}).every((address) =>
    //         discovery.contracts.some((c) => c.address.toString() === address),
    //       ),
    //       `names field in ${config.name} configuration includes addresses that do not exist inside discovery.json`,
    //     )
    //   }
    // })

    it('every name is unique', async () => {
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
  })
})
