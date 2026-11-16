import type { TextMeasure } from './heartbeat/text'
import { ProjectOpengraphImage } from './Project'

interface Props {
  measure: TextMeasure
  symbol: string
  /** The token's icon as a data URI, when it could be fetched. */
  icon?: string
}

// Unlike the other templates in this directory, this one is rendered by the
// express server at runtime (see getInteropTokenOgImage), which is why it is
// exempted from the tsx boundary check in scripts/buildServer.ts.
export function TokenOpengraphImage({ measure, symbol, icon }: Props) {
  return (
    <ProjectOpengraphImage
      measure={measure}
      label="Token"
      name={symbol}
      logo={icon}
    />
  )
}
