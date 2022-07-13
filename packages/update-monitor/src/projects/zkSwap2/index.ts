import { providers } from 'ethers'
import { readFile } from 'fs/promises'

import { getSimpleProxy } from '../../common/simpleProxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export const ZK_SWAP_2_NAME = 'zkSwap2'

export async function getZkSwap2Parameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: ZK_SWAP_2_NAME,
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      getSimpleProxy(provider, addresses.verifier, 'Verifier'),
      getSimpleProxy(provider, addresses.verifierExit, 'VerifierExit'),
      getSimpleProxy(provider, addresses.pairManager, 'PairManager'),
    ]),
  }
}

export async function discoverZkSwap2(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ZK_SWAP_2_NAME,
    [addresses.upgradeGatekeeper],
    {
      addAbis: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7': JSON.parse(
          await readFile('abi/zkSwap2/ZkSwap2UpgradeGatekeeper.json', 'utf-8'),
        ),
      },
    },
  )
}
