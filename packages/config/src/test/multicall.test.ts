import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { expect } from 'earl'
import { layer2s } from '../processing/layer2s'

describe('update-monitor project has multicall configured', () => {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const chains = configReader.readAllChains().filter((c) => c !== 'ethereum')
  for (const chain of chains) {
    const project = layer2s.find((l2) => l2.id.toString() === chain)
    if (project === undefined) {
      continue
    }

    if (project.isUpcoming) {
      continue
    }

    it(`update-monitor chain has multicall configured - ${project.id.toString()}`, () => {
      expect(
        (project.chainConfig?.multicallContracts ?? []).filter(
          (c) => c.version === '3',
        ),
      ).not.toBeEmpty()
    })
  }
})
