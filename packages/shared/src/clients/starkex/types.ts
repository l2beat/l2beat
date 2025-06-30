import { v } from '@l2beat/validate'

export const StarkexApiSuccessResponse = v.object({ count: v.number() })
export const StarkexApiErrorResponse = v.object({ message: v.string() })
