import path from 'path'
import { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'

describe('Verify Discovery config files', () => {
  const dir = process.cwd()

  process.chdir(path.resolve(__dirname, './..'))
  console.log('cwd', process.cwd())

  after(() => {
    process.chdir(dir)
  })

  const configReader = new ConfigReader()
  const chains = configReader.readAllChains()

  for (const chain of chains) {
    describe(`${ConfigReader.name} for ${chain}`, () => {
      const projects = configReader.readAllProjectsForChain(chain)

      describe(ConfigReader.prototype.readConfig.name, () => {
        for (const project of projects) {
          it(`can read ${project} config`, async () => {
            const result = await configReader.readConfig(project, chain)
            expect(result.name).toEqual(project)
          })
        }
      })

      describe(ConfigReader.prototype.readAllConfigsForChain.name, () => {
        it(`can read all configs for ${chain}`, async () => {
          const configReader = new ConfigReader()

          const result = await configReader.readAllConfigsForChain(chain)

          const readConfigs: string[] = []
          for (const project of projects) {
            const i = result.find((r) => r.name === project)
            if (i) {
              readConfigs.push(project)
            }
          }

          expect(projects).toEqual(readConfigs)
        })
      })

      describe(ConfigReader.prototype.readDiscovery.name, () => {
        for (const project of projects) {
          it(`can read discovered.json for ${project}`, async () => {
            const result = await configReader.readDiscovery(project, chain)
            expect(result.name).toEqual(project)
          })
        }
      })

      describe('ChainId in config.jsonc matches the ChainId of the folder', () => {
        for (const project of projects) {
          it(`${project}`, async () => {
            const config = await configReader.readConfig(project, chain)
            expect(config.chain).toEqual(chain)
          })
        }
      })

      describe('ChainId in discovered.json matches the ChainId of the folder', () => {
        for (const project of projects) {
          it(`${project}`, async () => {
            const discovered = await configReader.readDiscovery(project, chain)
            expect(discovered.chain).toEqual(chain)
          })
        }
      })
    })
  }
})
