import { layer2s, layer3s } from '@l2beat/config'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'
import { partition } from 'lodash'
import { env } from '~/env'

const othersIds: ProjectId[] = [
  'Blast',
  'Linea',
  'Worldchain',
  'Mode',
  'Fuel Ignition',
  'Taiko',
  'Zircuit',
  'Lisk',
  'BOB',
  'Zora',
  'Boba',
  'Binary',
  'Kroma',
  'Morph',
  'Polynomial',
  'Mint',
  'Shape',
  'DeBank Chain',
  'Optopia',
  'Swan Chain',
  'Honeypot',
  'SuperLumio',
  'Metal',
  'Parallel',
  'River',
  'Frame Chain',
  'Race Network',
  'Deri',
  'Lambda Chain',
  'Ethernity',
  'Bug Buster',
  'Mantle',
  'Manta Pacific',
  'Metis',
  'Fraxtal',
  'Gravity',
  'Immutable X',
  'Cronos zkEVM',
  'RSS3 VSL',
  'zkLink Nova',
  'Derive',
  'ApeX',
  'Aevo',
  'Cyber',
  'Re.al',
  'X Layer',
  'K2',
  'Sanko',
  'Reya',
  'Sorare',
  'Orderly',
  'SX Network',
  'ZKFair',
  'Silicon',
  'rhino.fi',
  'WINR',
  'Degen Chain',
  'Astar zkEVM',
  'Xai',
  'Redstone',
  'Ancient8',
  'Fluence',
  'tanX',
  'XCHAIN',
  'Ham',
  'AlienX',
  'HYCHAIN',
  'PoP Apex',
  'RARI Chain',
  'Aleph Zero EVM',
  'PGN',
  'PoP Boss',
  'Myria',
  'Everclear Hub',
  'Edgeless',
  'Hypr',
  'OEV Network',
  'GM Network',
  'Pay Chain',
  'Xterio Chain',
  'Molten',
  'Automata',
  'L3X',
  'Stack',
  'GPT Protocol',
  'Witness Chain',
  'Blessnet',
  'InEVM',
  'PlayBlock',
  'ApeChain',
]
  .map((x) =>
    [...layer2s, ...layer3s].find(
      (p) => p.display.name === x || p.display.shortName === x,
    ),
  )
  .map((p) => p?.id)
  .filter(notUndefined)

export type CategorisedScalingEntries<
  T extends { id: ProjectId; category: string | undefined; isOther?: boolean },
> = ReturnType<typeof groupByMainCategories<T>>

export function groupByMainCategories<
  T extends { id: ProjectId; category: string | undefined; isOther?: boolean },
>(projects: T[]) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS === true) {
    const mappedOthers = projects.map((project) => {
      if (othersIds.includes(project.id)) {
        project.isOther = true
      }
      return project
    })
    const [others, rest] = partition(mappedOthers, (project) => project.isOther)
    const [rollups, validiumsAndOptimiums] = partition(
      rest,
      (project) =>
        project.category === 'ZK Rollup' ||
        project.category === 'Optimistic Rollup',
    )
    return {
      rollups,
      validiumsAndOptimiums,
      others,
    }
  }
  const [rollups, validiumsAndOptimiums] = partition(
    projects,
    (project) =>
      project.category === 'ZK Rollup' ||
      project.category === 'Optimistic Rollup',
  )

  return {
    rollups,
    validiumsAndOptimiums,
  }
}
