import { COLUMN, HeartbeatFrame } from './heartbeat/Frame'
import { isLostOnDark } from './heartbeat/logo'
import { WHITE } from './heartbeat/marks'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

interface Props {
  measure: TextMeasure
  /** The project's type: Layer 2, Privacy, DeFi... Never a stage or a number, so the image can't go stale. */
  label: string
  logoSrc: string
  name: string
  /** Shown instead of a name that would fall under 58 px. */
  shortName?: string
  roundLogo?: boolean
}

const GAP = 26
const MIN_FULL_NAME_SIZE = 58
/** How much of its plate a plated logo fills, leaving a light rim. */
const PLATED_LOGO = 0.78

/** The project's own logo, in its own colours, before its name, all on one line. */
export function ProjectOpengraphImage({
  measure,
  label,
  logoSrc,
  name,
  shortName,
  roundLogo,
}: Props) {
  let shown = name
  let size = fitRow(measure, shown)
  if (size < MIN_FULL_NAME_SIZE && shortName) {
    shown = shortName
    size = fitRow(measure, shown)
  }
  const logo = logoSize(size)
  const image = (width: number) => (
    <img
      src={logoSrc}
      alt=""
      width={width}
      height={width}
      style={roundLogo ? { borderRadius: width / 2 } : undefined}
    />
  )
  return (
    <HeartbeatFrame
      measure={measure}
      label={label}
      titleInkLeft={0}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
          {isLostOnDark(logoSrc) ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: logo,
                height: logo,
                borderRadius: logo / 2,
                backgroundColor: WHITE,
              }}
            >
              {image(logo * PLATED_LOGO)}
            </div>
          ) : (
            image(logo)
          )}
          <div
            style={{
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: -0.01 * size,
              whiteSpace: 'nowrap',
            }}
          >
            {shown}
          </div>
        </div>
      }
    />
  )
}

const logoSize = (size: number) =>
  Math.max(64, Math.min(112, Math.round(size * 1.18)))

/** The largest size, 38–96 px, at which logo and name fit the column. */
function fitRow(measure: TextMeasure, name: string) {
  for (let size = 96; size > 38; size--) {
    const width =
      satoriWidth(measure.width(name, size, 700, -0.01 * size)) +
      logoSize(size) +
      GAP
    if (width <= COLUMN) return size
  }
  return 38
}
