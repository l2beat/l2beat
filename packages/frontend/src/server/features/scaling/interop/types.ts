import { InteropBridgeType } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type InteropDashboardParams = v.infer<typeof InteropDashboardParams>
export const InteropDashboardParams = v.object({
  from: v.array(v.string()),
  to: v.array(v.string()),
  type: InteropBridgeType.optional(),
})
