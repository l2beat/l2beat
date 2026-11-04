import type { TextMeasure } from './heartbeat/text'
import { ProjectOpengraphImage } from './Project'

interface Props {
  measure: TextMeasure
  iconSrc: string
  symbol: string
}

// Unlike the other templates in this directory, this one is rendered by the
// express server at runtime (see getInteropTokenOgImage), which is why it is
// exempted from the tsx boundary check in scripts/buildServer.ts.
export function TokenOpengraphImage({ measure, iconSrc, symbol }: Props) {
  return (
    <ProjectOpengraphImage
      measure={measure}
      label="Token"
      logoSrc={iconSrc}
      name={symbol}
      roundLogo
    />
  )
}
