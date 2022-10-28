import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { ARBITRUM_NAME, getArbitrumParameters } from '../projects/arbitrum'
import { CBRIDGE_NAME, getCBridgeParameters } from '../projects/cBridge'
import { DYDX_NAME, getDydxParameters } from '../projects/dYdX'
import { getHopParameters, HOP_NAME } from '../projects/hop'
import { getNovaParameters, NOVA_NAME } from '../projects/nova'
import {
  getOrbitBridgeParameters,
  ORBIT_BRIDGE_NAME,
} from '../projects/orbitBridge'
import {
  getPolynetworkBridgeParameters,
  POLYNETWORK_BRIDGE_NAME,
} from '../projects/polynetworkBridge'
import {
  getSolletBridgeParameters,
  SOLLET_BRIDGE_NAME,
} from '../projects/solletBridge'
import { getStarkNetParameters, STARK_NET_NAME } from '../projects/starknet'
import { getSynapseParameters, SYNAPSE_NAME } from '../projects/synapse'
import { getZkSpaceParameters, ZK_SPACE_NAME } from '../projects/zkSpace'
import { getZkSwap1Parameters, ZK_SWAP_1_NAME } from '../projects/zkSwap1'
import { getZkSwap2Parameters, ZK_SWAP_2_NAME } from '../projects/zkSwap2'
import { getZkSyncParameters, ZK_SYNC_NAME } from '../projects/zkSync'
import { ProjectParameters } from '../types'
import { getEnv } from './getEnv'
import { exitWithUsage } from './usage'

type GetParameters = (
  provider: providers.JsonRpcProvider,
) => Promise<ProjectParameters>

export async function analyze(projects: string[]) {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    getEnv('ALCHEMY_API_KEY'),
  )

  const items: [string, GetParameters][] = [
    [ZK_SYNC_NAME, getZkSyncParameters],
    [ZK_SWAP_1_NAME, getZkSwap1Parameters],
    [ZK_SWAP_2_NAME, getZkSwap2Parameters],
    [ZK_SPACE_NAME, getZkSpaceParameters],
    [ARBITRUM_NAME, getArbitrumParameters],
    [STARK_NET_NAME, getStarkNetParameters],
    [HOP_NAME, getHopParameters],
    [NOVA_NAME, getNovaParameters],
    [DYDX_NAME, getDydxParameters],
    [POLYNETWORK_BRIDGE_NAME, getPolynetworkBridgeParameters],
    [SOLLET_BRIDGE_NAME, getSolletBridgeParameters],
    [ORBIT_BRIDGE_NAME, getOrbitBridgeParameters],
    [SYNAPSE_NAME, getSynapseParameters],
    [CBRIDGE_NAME, getCBridgeParameters],
  ]

  const unknownArguments = projects.filter(
    (x) => !items.some((y) => y[0] === x),
  )

  if (unknownArguments.length > 0) {
    exitWithUsage(`Unknown argument ${unknownArguments[0]}`)
  }

  const filtered = items.filter(
    (x) => projects.length === 0 || projects.some((y) => y === x[0]),
  )

  const results = await Promise.all(filtered.map((x) => x[1](provider)))

  for (const project of results) {
    await writeFile(
      `dist/${project.name}.json`,
      JSON.stringify(project, null, 2),
    )
  }
}
