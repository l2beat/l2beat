import type { StakingProjectId, StakingSource } from '../types'
import { fetchAztecProviders } from './aztecnetworkv6'
import { fetchEthereumValidators } from './ethereum'
import { fetchGnosisValidators } from './gnosis'
import { fetchPolygonValidators } from './polygonPos'

export const stakingSources: Record<StakingProjectId, StakingSource> = {
  aztecnetworkv6: fetchAztecProviders,
  ethereum: fetchEthereumValidators,
  gnosis: fetchGnosisValidators,
  'polygon-pos': fetchPolygonValidators,
}
