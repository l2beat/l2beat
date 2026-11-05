import type { TextMeasure } from './heartbeat/text'
import { fitTitle, MainPageOpengraphImage } from './MainPage'

interface Props {
  measure: TextMeasure
  /** The project's type: Layer 2, Privacy, DeFi... Never a stage or a number, so the image can't go stale. */
  label: string
  name: string
  /** Shown instead of a name that would fall under 58 px. */
  shortName?: string
}

const MIN_FULL_NAME_SIZE = 58

/**
 * The project's name under its type, without its logo: many logos are drawn
 * for light grounds and get lost on this dark one.
 */
export function ProjectOpengraphImage({
  measure,
  label,
  name,
  shortName,
}: Props) {
  const title =
    shortName && fitTitle(measure, name).size < MIN_FULL_NAME_SIZE
      ? shortName
      : name
  return (
    <MainPageOpengraphImage measure={measure} label={label} title={title} />
  )
}
