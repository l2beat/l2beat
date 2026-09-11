import type { StakingProjectId, StakingSource } from '../types'
import { fetchAztecProviders } from './aztecnetwork'
import { fetchEthereumValidators } from './ethereum'
import { fetchGnosisValidators } from './gnosis'
import { fetchPolygonValidators } from './polygonPos'

export const stakingSources: Record<StakingProjectId, StakingSource> = {
  aztecnetwork: fetchAztecProviders,
  ethereum: fetchEthereumValidators,
  gnosis: fetchGnosisValidators,
  'polygon-pos': fetchPolygonValidators,
}
