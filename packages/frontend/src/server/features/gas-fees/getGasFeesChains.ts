import { assert, ProjectId } from '@l2beat/shared-pure'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { ps } from '~/server/projects'
import { generateAccessibleColors } from '~/utils/generateColors'
import { manifest } from '~/utils/Manifest'
import {
  GAS_FEES_CHAINS,
  GAS_FEES_L2S,
  type GasFeesChainId,
  type GasToken,
  gasTokenOf,
} from './chains'
import { FEE_NOTES, type FeeNotes } from './feeNotes'

export interface GasFeesChain {
  id: GasFeesChainId
  name: string
  type: string
  gasToken: GasToken
  href: string
  iconUrl: string
  color: string
  notes: FeeNotes
}

/** In GAS_FEES_CHAINS order, Ethereum first */
export async function getGasFeesChains(): Promise<GasFeesChain[]> {
  const projects = await ps.getProjects({
    ids: GAS_FEES_CHAINS.map(ProjectId),
    optional: ['scalingInfo'],
  })
  const l2Colors = generateAccessibleColors(GAS_FEES_L2S.length)
  return GAS_FEES_CHAINS.map((id) => {
    const project = projects.find((p) => p.id === id)
    assert(project, 'Gas fees chain without a project', { cause: { id } })
    const l2Index = GAS_FEES_L2S.indexOf(id as (typeof GAS_FEES_L2S)[number])
    return {
      id,
      name: project.name,
      type: id === 'ethereum' ? 'Layer 1' : (project.scalingInfo?.type ?? ''),
      gasToken: gasTokenOf(id),
      href:
        id === 'ethereum'
          ? ETHEREUM_PROJECT_PATH
          : `/layer2s/projects/${project.slug}`,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      color:
        id === 'ethereum'
          ? 'var(--chart-ethereum)'
          : (l2Colors[l2Index] ?? '#888888'),
      notes: FEE_NOTES[id] ?? {},
    }
  })
}
