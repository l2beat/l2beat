import type { TextMeasure } from './heartbeat/text'
import { fitTitle, MainPageOpengraphImage, titleFit } from './MainPage'

interface Props {
  measure: TextMeasure
  /** The project's type: Layer 2, Privacy, DeFi... Never a stage or a number, so the image can't go stale. */
  label: string
  name: string
  /** Shown instead of a name that would fall under 58 px. */
  shortName?: string
  /** A data URI. Dark logos get a version that reads on the dark ground. */
  logo?: string
}

const MIN_FULL_NAME_SIZE = 58

/** The project's name under its type, beside its logo. */
export function ProjectOpengraphImage({
  measure,
  label,
  name,
  shortName,
  logo,
}: Props) {
  const fit = titleFit(measure, { label, logo })
  const title =
    shortName && fitTitle(measure, name, fit).size < MIN_FULL_NAME_SIZE
      ? shortName
      : name
  return (
    <MainPageOpengraphImage
      measure={measure}
      label={label}
      title={title}
      logo={logo}
    />
  )
}
