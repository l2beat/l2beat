import { expect } from 'earljs'

import { ConfigReader } from '../ConfigReader'

export {}

describe('discovery config.jsonc', () => {
  const configReader = new ConfigReader()

  it('fields inside ignoreInWatchMode exists in discovery', async function () {
    const configs = await configReader.readAllConfigs()

    for (const config of configs) {
      const discovery = await configReader.readDiscovery(config.name)
      if (config.overrides === undefined) {
        return
      }
      for (const [address, override] of Object.entries(config.overrides)) {
        if (override.ignoreDiscovery === true) {
          continue
        }

        const contract = discovery.contracts.find(
          (c) => c.address.toString() === address,
        )

        expect(contract, {
          extraMessage: `${config.name} - ${address} - this contract does not exist in discovery.json`,
        }).not.toEqual(undefined)
        if (contract === undefined) {
          continue
        }

        if (override.ignoreInWatchMode === undefined) {
          continue
        }

        expect(contract.values, {
          extraMessage: `${config.name} - ${address} - values does not exist for this contract in discovery.json`,
        }).not.toEqual(undefined)
        if (contract.values === undefined) {
          continue
        }

        const ignoreInWatchMode = override.ignoreInWatchMode
        const valueNames = Object.keys(contract.values)

        for (const i of ignoreInWatchMode) {
          const valueName = valueNames.find((v) => v === i) ?? ''
          expect(valueName, {
            extraMessage: `${config.name} - ${address} - ${i}`,
          }).toEqual(i)
        }
      }
    }
  })
})
