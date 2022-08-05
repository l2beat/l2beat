import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { ARBITRUM_NAME, getArbitrumParameters } from '../projects/arbitrum'
import { getStarkNetParameters, STARK_NET_NAME } from '../projects/starknet'
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
