import { providers, utils } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'

export const L2FZK_NAME = 'layer2FinanceZk'

export async function getLayer2FinanceZkParameters(
  _provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: L2FZK_NAME,
    contracts: await Promise.all([]),
  }
  return parameters
}

export async function discoverLayer2FinanceZk(
  discoveryEngine: DiscoveryEngine,
) {
  const broker = '0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5'
  const logs = await discoveryEngine.provider.getLogs({
    address: broker,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [
      '0xe4aa558ee975bfb27422ee387b2408dc4a1333b8e777c09ca9f0e25c42615d86',
    ],
  })
  const strategies = logs
    .map((x) => utils.getAddress('0x' + x.data.slice(-40)))
    .filter((x, i, a) => a.indexOf(x) === i)

  console.log('Found strategies', strategies)

  await discoveryEngine.discover(
    L2FZK_NAME,
    [
      '0x82123571C8a5e0910280C066bc634c4945FFcbC8',
      '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
      '0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5',
      ...strategies,
    ],
    {
      skipAddresses: [
        '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // uniswap
        '0xc00e94Cb662C3520282E6f5717214004A7f26888', // comp token
      ],
      overrideImplementations: {
        '0x82123571C8a5e0910280C066bc634c4945FFcbC8': [
          '0x4EDD62189732e9fF476ABa880b48c29432A7AC9B',
          '0x62BCA4DB742A99c834e2c24b609656A70EA25379',
          '0x8536850750956c2FEebeCAB786d82271a5467687',
          '0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2',
          '0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1',
          '0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339',
          '0xB3788a88F063B217227E27ae16Ba550db3132bE6',
        ],
      },
      skipMethods: {
        '0x82123571C8a5e0910280C066bc634c4945FFcbC8': [
          'getEthKey',
          'isAssetRegistered',
          'getQuantum',
        ],
        '0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5': [
          'prices',
          'actualPrices',
          'ridesShares',
          'rideInfos',
          'rideDeparted',
          'slippages',
        ],
      },
    },
  )
}
