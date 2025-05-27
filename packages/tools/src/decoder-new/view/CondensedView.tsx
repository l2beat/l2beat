import type { DecodedResult } from '@l2beat/tools-api/types'

interface CondensedViewProps {
  decoded: DecodedResult
}

export function CondensedView({ decoded }: CondensedViewProps) {
  return <>{JSON.stringify(decoded, null, 2)}</>
}
