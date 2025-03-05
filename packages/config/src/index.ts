/**
 * IMPORTANT! PLEASE READ
 *
 * In an effort to streamline working with config all current non-type
 * exports are explicitly stated in this file. The aim is to reduce non-type
 * exports to the absolute minimum.
 *
 * Ideally this file would look like this:
 *
 * ```ts
 * export { ProjectService } from './projects'
 * export type * from './types'
 * ```
 *
 * As you can see it'll take us a while to get there. In the meantime
 * DO NOT ADD NEW NON-TYPE EXPORTS to @l2beat/config. Thanks!
 */

export { HOMEPAGE_MILESTONES } from './global/milestones'
export { PROJECT_COUNTDOWNS } from './global/countdowns'
export { ProjectService, type Project } from './projects/project/ProjectService'
export {
  safeGetTokenByAssetId,
  tokenList,
} from './tokens/tokens'
export type * from './types'
export { getCommonContractsIn } from './utils/commonContracts'
import { runConfigAdjustments } from './adjustments'

runConfigAdjustments()
