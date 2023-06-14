import { expect } from 'earl'
import { readdirSync } from 'fs'
import path from 'path'

import { ConfigReader } from './ConfigReader'

describe(ConfigReader.name, () => {
  // FIXME: This is a temporary hack to make the tests while configs are in backend
  const dir = process.cwd()
  process.chdir(path.dirname(require.resolve('@l2beat/backend/package.json')))

  after(() => {
    process.chdir(dir)
  })

  const configs = readdirSync('discovery', { withFileTypes: true })
    .filter((x) => x.isDirectory())
    .map((x) => x.name)

  describe(ConfigReader.prototype.readConfig.name, () => {
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
    const configReader = new ConfigReader()

    for (const project of configs) {
      it(`can read discovered.json for ${project}`, async () => {
        const result = await configReader.readDiscovery(project)
        expect(result.name).toEqual(project)
      })
    }
  })
})
