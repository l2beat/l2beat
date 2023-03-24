import { bridges, layer2s } from '@l2beat/config'
import { assert } from '@l2beat/shared'

import { ConfigReader } from '../ConfigReader'
import { DiscoveryConfig } from '../DiscoveryConfig'
import { getDiscoveryConfigHash } from './getDiscoveryConfigHash'

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
    const notCorresponding = configs
      ?.filter((c) => !projectIds.includes(c.name))
      .map((c) => c.name)

    assert(
      notCorresponding?.length === 0,
      'Following projects do not have the same name as ProjectIds',
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
      if (config.overrides === undefined) {
        continue
      }

      const discovery = await configReader.readDiscovery(config.name)

      for (const [address, override] of Object.entries(config.overrides)) {
        if (override.ignoreDiscovery === true) {
          continue
        }

        if (override.ignoreInWatchMode === undefined) {
          continue
        }

        const contract = discovery.contracts.find(
          (c) => c.address.toString() === address,
        )

        const errorPrefix = `${config.name} - ${address}`

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

  it('committed discovery config hash matches committed config hash', async () => {
    const outdatedHashes: string[] = []
    for (const config of configs ?? []) {
      const discovery = await configReader.readDiscovery(config.name)

      const configHash = getDiscoveryConfigHash(config)

      if (discovery.configHash !== configHash) {
        outdatedHashes.push(config.name)
      }
    }
    assert(
      outdatedHashes.length === 0,
      'Following projects have outdated hashes. Run "yarn discover <config.name>',
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
})
