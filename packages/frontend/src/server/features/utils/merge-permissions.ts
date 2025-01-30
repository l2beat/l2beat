import type { ScalingProjectPermissions } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'

// TODO(radomski): This is temporary, config will export the same type as
// nativePermissions. There is really not reason for it to be seperated
export function mergePermissions(
  hostPermissions: ScalingProjectPermissions | 'UnderReview',
  nativePermissions:
    | Record<string, ScalingProjectPermissions>
    | 'UnderReview'
    | undefined,
  hostChain: ProjectId,
): Record<string, ScalingProjectPermissions> | 'UnderReview' {
  if (
    hostPermissions === 'UnderReview' ||
    nativePermissions === 'UnderReview'
  ) {
    assert(hostPermissions === nativePermissions)
    return 'UnderReview'
  }

  return {
    [hostChain.toString()]: hostPermissions,
    ...(nativePermissions ?? {}),
  }
}
