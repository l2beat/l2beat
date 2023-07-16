import { bridges, layer2s } from '@l2beat/config'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isEqual } from 'lodash'

import { ConfigReader } from './ConfigReader'
import { DiscoveryConfig } from './DiscoveryConfig'

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()
  let configs: DiscoveryConfig[] | undefined

  const projectIds = layer2s
    .map((p) => p.id.toString())
    .concat(bridges.map((p) => p.id.toString()))

  before(async () => {
    configs = await configReader.readAllConfigs()
  })

  it(`every config name corresponds to ProjectId`, () => {
    const notCorresponding =
      configs
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

    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)
      if (discovery.name !== config.name) {
        notEqual.push(config.name)
      }
    }

    assert(
      notEqual.length === 0,
      'Following projects do not have the same name in config and discovery.json. Run "yarn discover <config.name>"',
    )
  })

  it('fields inside ignoreInWatchMode exists in discovery', async function () {
    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)

      for (const override of config.overrides) {
        if (override.ignoreDiscovery === true) {
          continue
        }

        if (override.ignoreInWatchMode === undefined) {
          continue
        }

        const contract = discovery.contracts.find(
          (c) => c.address === override.address,
        )

        const errorPrefix = `${config.name} - ${override.address.toString()}`

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
  })

  it(`every discovery.json has sorted contracts`, async () => {
    const notSorted: string[] = []

    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)

      if (
        !isEqual(
          discovery.contracts,
          discovery.contracts
            .slice()
            .sort((a, b) => a.address.localeCompare(b.address.toString())),
        )
      ) {
        notSorted.push(config.name)
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
    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)

      if (discovery.configHash !== config.hash) {
        outdatedHashes.push(config.name)
      }
    }
    assert(
      outdatedHashes.length === 0,
      `Following projects have outdated hashes: ${outdatedHashes.join(
        ', ',
      )}. Run yarn discover <outdatedProjectName>`,
    )
  })

  it('discovery.json does not include errors', async () => {
    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)

      assert(
        discovery.contracts.every((c) => c.errors === undefined),
        `${config.name} discovery.json includes errors. Run "yarn discover ${config.name}".`,
      )
    }
  })

  describe('overrides', () => {
    // this test ensures that every named override resolves to an address
    // do not remove it unless you know what you are doing
    it('every override correspond to existing contract', async () => {
      for (const config of configs ?? []) {
        for (const key of Object.keys(config.raw.overrides ?? {})) {
          if (!EthereumAddress.check(key)) {
            expect(() => config.overrides.get(key)).not.toThrow()
          }
        }
      }
    })

    it('all shared modules exist', async () => {
      for (const config of configs ?? []) {
        for (const sharedModule of config.sharedModules) {
          assert(
            configs?.some((c) => c.name === sharedModule),
            `Shared module ${sharedModule} does not exist (${config.name})`,
          )
        }
      }
    })

    // inversion logic depends on this
    it('all accessControl fields keys are accessControl', async () => {
      for (const config of configs ?? []) {
        for (const override of config.overrides) {
          if (override.fields === undefined) {
            continue
          }

          for (const [key, value] of Object.entries(override.fields)) {
            if (value.type === 'accessControl') {
              assert(
                key === 'accessControl',
                `${
                  config.name
                } - ${override.address.toString()} - accessControl field must be named accessControl`,
              )
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
      for (const config of configs ?? []) {
        if (config.raw.names === undefined) {
          continue
        }

        assert(
          new Set(Object.values(config.raw.names)).size ===
            Object.values(config.raw.names).length,
          `names field in ${config.name} configuration includes duplicate names`,
        )
      }
    })
  })
})
