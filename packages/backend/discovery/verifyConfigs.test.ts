import { ChainId, ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'
import path from 'path'

describe('Verify Discovery config files', () => {
  const dir = process.cwd()

  process.chdir(path.resolve(__dirname, './..'))
  console.log('cwd', process.cwd())

  after(() => {
    process.chdir(dir)
  })

  const configReader = new ConfigReader()
  const chainIds = ChainId.getAll()

  for (const chainId of chainIds) {
    describe(`${ConfigReader.name} for ${ChainId.getName(chainId)}`, () => {
      const projects = configReader.readAllProjectsForChain(chainId)

      describe(ConfigReader.prototype.readConfig.name, () => {
        for (const project of projects) {
          it(`can read ${project} config`, async () => {
            const result = await configReader.readConfig(project, chainId)
            expect(result.name).toEqual(project)
          })
        }
      })

      describe(ConfigReader.prototype.readAllConfigsForChain.name, () => {
        it(`can read all configs for ${ChainId.getName(chainId)}`, async () => {
          const configReader = new ConfigReader()

          const result = await configReader.readAllConfigsForChain(chainId)

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
            const result = await configReader.readDiscovery(project, chainId)
            expect(result.name).toEqual(project)
          })
        }
      })

      describe('ChainId in config.jsonc matches the ChainId of the folder', () => {
        for (const project of projects) {
          it(`${project}`, async () => {
            const config = await configReader.readConfig(project, chainId)
            expect(config.chainId).toEqual(chainId)
          })
        }
      })

      describe('ChainId in discovered.json matches the ChainId of the folder', () => {
        for (const project of projects) {
          it(`${project}`, async () => {
            const discovered = await configReader.readDiscovery(
              project,
              chainId,
            )
            expect(ChainId.fromName(discovered.chain)).toEqual(chainId)
          })
        }
      })
    })
  }
})
