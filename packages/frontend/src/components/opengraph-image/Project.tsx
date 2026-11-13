import { onDarkGround } from './heartbeat/logo'
import type { TextMeasure } from './heartbeat/text'
import { fitTitle, MainPageOpengraphImage, titleFit } from './MainPage'

interface Props {
  measure: TextMeasure
  /**
   * Above the name. Project pages have none: a project has one page whatever
   * sections it is in, and an image with nothing that changes never goes stale.
   */
  label?: string
  name: string
  /** Shown instead of a name that would fall under 58 px. */
  shortName?: string
  /** A data URI. Dark logos get a version that reads on the dark ground. */
  logo?: string
}

const MIN_FULL_NAME_SIZE = 58

/** A name, under its label if any, beside its logo. */
export function ProjectOpengraphImage({
  measure,
  label,
  name,
  shortName,
  logo,
}: Props) {
  const onDark = logo === undefined ? undefined : onDarkGround(logo)
  const fit = titleFit(measure, { label, logo: onDark })
  const title =
    shortName && fitTitle(measure, name, fit).size < MIN_FULL_NAME_SIZE
      ? shortName
      : name
  return (
    <MainPageOpengraphImage
      measure={measure}
      label={label}
      title={title}
      logo={onDark}
    />
  )
}
