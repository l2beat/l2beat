import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { expect } from 'earl'

describe('Verify Discovery config files', () => {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const projects = configReader.readAllDiscoveredProjects()

  for (const project of projects) {
    describe(`${ConfigReader.name} for ${project}`, () => {
      describe(ConfigReader.prototype.readConfig.name, () => {
        it(`can read ${project} config`, () => {
          const result = configReader.readConfig(project)
          expect(result.name).toEqual(project)
        })
      })
    })
  }
})
