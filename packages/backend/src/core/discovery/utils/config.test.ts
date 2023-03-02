import { assert } from '@l2beat/shared'
import { expect } from 'earljs'

import { ConfigReader } from '../ConfigReader'
import { getDiscoveryConfigHash } from './getDiscoveryConfigHash'

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()

  it('fields inside ignoreInWatchMode exists in discovery', async function () {
    const configs = await configReader.readAllConfigs()

    for (const config of configs) {
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
        const extraMessage = `${errorPrefix} - [${ignore.join(',')}]`

        expect(values, { extraMessage }).toBeAnArrayWith(...ignore)
      }
    }
  })

  it('committed discovery config hash matches committed config hash', async () => {
    const configs = await configReader.readAllConfigs()

    for (const config of configs) {
      const discovery = await configReader.readDiscovery(config.name)

      const configHash = getDiscoveryConfigHash(config)

      const extraMessage = `${config.name} discovery config hash does not match current config hash. Run "yarn discover ${config.name}".`
      expect(discovery.configHash, { extraMessage }).toEqual(configHash)
    }
  })

  it('discovery.json does not include errors', async () => {
    const configs = await configReader.readAllConfigs()
    for (const config of configs) {
      const discovery = await configReader.readDiscovery(config.name)

      const extraMessage = `${config.name} discovery.json includes errors. Run "yarn discover ${config.name}".`
      expect(
        discovery.contracts.every((c) => c.errors === undefined),
        { extraMessage },
      ).toEqual(true)
    }
  })
})
