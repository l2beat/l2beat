import { expect } from 'earljs'
import { readdirSync } from 'fs'

import { ConfigReader } from './ConfigReader'

describe(ConfigReader.name, () => {
  describe(ConfigReader.prototype.readConfig.name, () => {
    const configs = readdirSync('discovery').filter(
      (x) => x !== 'config.schema.json' && x !== 'README.md',
    )

    const configReader = new ConfigReader()

    for (const project of configs) {
      it(`can read ${project} config`, async () => {
        const result = await configReader.readConfig(project)
        expect(result.name).toEqual(project)
      })
    }
  })

  describe(ConfigReader.prototype.readAllConfigs.name, () => {
    it('can read all configs', async () => {
      const configs = readdirSync('discovery').filter(
        (x) => x !== 'config.schema.json' && x !== 'README.md',
      )

      const configReader = new ConfigReader()

      const result = await configReader.readAllConfigs()

      const readConfigs: string[] = []
      for (const project of configs) {
        const i = result.find((r) => r.name === project)
        if (i) {
          readConfigs.push(project)
        }
      }

      expect(configs).toEqual(readConfigs)
    })
  })

  describe(ConfigReader.prototype.readDiscovery.name, () => {
    const configs = readdirSync('discovery').filter(
      (x) => x !== 'config.schema.json' && x !== 'README.md',
    )

    const configReader = new ConfigReader()

    for (const project of configs) {
      it(`can read discovered.json for ${project}`, async () => {
        const result = await configReader.readDiscovery(project)
        expect(result.name).toEqual(project)
      })
    }
  })
})
