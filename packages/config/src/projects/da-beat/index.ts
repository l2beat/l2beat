import { avail } from './avail/avail'
import { celestia } from './celestia/celestia'
import { eigenDA } from './eigen-da/eigen-da'
import { espressoDA } from './espressoDA/espressoDA'
import { ethereum } from './ethereum/ethereum'
import { memo } from './memo/memo'
import { near } from './near/near'

export * from './types'
// TODO: do not export from common and usedInProject
export { DaCommitteeSecurityRisk } from './common'
export { toUsedInProject } from './utils/to-used-in-project'

export const ethereumDaLayer = ethereum

export const daLayers = [avail, celestia, near, memo, espressoDA, eigenDA]
