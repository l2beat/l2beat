import { UnixTime } from '@l2beat/shared-pure'

const CONSIDER_EXCLUDED_AFTER_DAYS = 7

export function getExclusionBoundary(targetTimestamp: UnixTime): UnixTime {
  return targetTimestamp - CONSIDER_EXCLUDED_AFTER_DAYS * UnixTime.DAY
}
