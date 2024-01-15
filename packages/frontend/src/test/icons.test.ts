import { bridges, layer2s, layer3s } from '@l2beat/config'
import { expect } from 'earl'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

describe('icons', () => {
  const projects = [...layer2s, ...bridges, ...layer3s]
  for (const project of projects) {
    it(`${project.display.name} has an associated icon`, () => {
      const iconPath = path.join(
        __dirname,
        `../static/icons/${project.display.slug}.png`,
      )
      expect(existsSync(iconPath)).toEqual(true)
    })
  }

  const PROJECTS_TO_SKIP = [
    'aevo',
    'ancient',
    'apex',
    'arbitrum',
    'astarzkevm',
    'aztec-v2',
    'base',
    'blast',
    'bob',
    'bobanetwork',
    'brine',
    'canto',
    'capx',
    'canvasconnect',
    'debank',
    'honeypot',
    'degate',
    'degate2',
    'degate3',
    'dydx',
    'eclipse',
    'frame',
    'fuel',
    'fuelv1',
    'gluon',
    'grvt',
    'hermez',
    'hypr',
    'immutablex',
    'immutablezkevm',
    'kinto',
    'kroma',
    'linea',
    'lisk',
    'loopring',
    'lyra',
    'mantapacific',
    'mantle',
    'metal',
    'metis',
    'mint',
    'mode',
    'molten',
    'morph',
    'myria',
    'nova',
    'obscuro',
    'omgnetwork',
    'optimism',
    'orb3',
    'palm',
    'paradex',
    'parallel',
    'polygon-miden',
    'polygonzkevm',
    'polygon-pos-2',
    'publicgoodsnetwork',
    'reddioex',
    'reddiozkvm',
    'deversifi',
    'scroll',
    'sorare',
    'specular',
    'starknet',
    'stealthchain',
    'taiko',
    'x1',
    'xchain',
    'zkfair',
    'zkspace',
    'zksync2',
    'zksync',
    'zora',
    'across-v2',
    'allbridge',
    'amarok',
    'avalanche',
    'aptos',
    'beamer-bridge-v2',
    'cbridge',
    'connext',
    'debridge',
    'gravity',
    'harmony',
    'chainport',
    'hop',
    'hyphen',
    'lzomnichain',
    'multichain',
    'near',
    'nomad',
    'omni',
    'opticsV1',
    'opticsV2',
    'orbit',
    'orbiter',
    'polygon-plasma',
    'polygon-pos',
    'polynetwork',
    'pNetwork',
    'pulseChain',
    'ronin',
    'satellite',
    'skale-ima',
    'sollet',
    'stargate',
    'synapse',
    'portal',
    'wormholeV1',
    'xdai',
    'symbiosis',
    'deri',
    'xai',
    'zklinknexus',
  ]

  for (const project of projects) {
    const description = `${project.id.toString()} every icon has proper dimensions and size`
    if (PROJECTS_TO_SKIP.includes(project.id.toString())) {
      it.skip(description)
      continue
    }
    it(description, () => {
      const iconPath = path.join(
        __dirname,
        `../static/icons/${project.display.slug}.png`,
      )

      const buffer = readFileSync(iconPath)
      const width = buffer.readUInt32BE(16)
      const height = buffer.readUInt32BE(20)
      const size = buffer.length

      expect(width).toEqual(128)
      expect(height).toEqual(128)
      expect(size).toBeLessThanOrEqual(10240)
    })
  }
})
