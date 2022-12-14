import { expect } from 'earljs'
import { readdirSync } from 'fs'

import { ConfigReader } from './ConfigReader'

describe(ConfigReader.name, () => {
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
