import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { expect } from 'earl'

describe('Verify Discovery config files', () => {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const projects = configReader.readAllDiscoveredProjects()

  for (const { project, chains } of projects) {
    describe(`${ConfigReader.name} for ${project}`, () => {
      describe(ConfigReader.prototype.readConfig.name, () => {
        for (const chain of chains) {
          it(`can read ${project} config`, () => {
            const result = configReader.readConfig(project, chain)
            expect(result.name).toEqual(project)
            expect(result.chain).toEqual(chain)
          })
        }
      })

      describe(ConfigReader.prototype.readDiscovery.name, () => {
        for (const chain of chains) {
          it(`can read discovered.json for ${project}`, () => {
            const result = configReader.readDiscovery(project, chain)
            expect(result.name).toEqual(project)
            expect(result.chain).toEqual(chain)
          })
        }
      })
    })
  }
})
