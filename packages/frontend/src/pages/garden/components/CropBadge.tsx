import type { OsiLicense, ProjectCropStatus } from '@l2beat/config'
import type {
  CropSentiment,
  ResolvedCropEvaluation,
} from '@l2beat/config/build/crops/canonicalCrops'
import type { CSSProperties, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { cn } from '~/utils/cn'
import { CROP_SENTIMENT_LABELS, CROP_STATUS_LABELS } from '../crops'

type PlantShape = 'flower' | 'bud' | 'wilt'

const PLANT_SHAPE: Record<CropSentiment, PlantShape> = {
  good: 'flower',
  neutral: 'flower',
  warning: 'bud',
  bad: 'wilt',
}

// The chip border is separate because the dashed border overrides it.
const PALETTE: Record<
  CropSentiment,
  { plant: string; chip: string; chipBorder: string }
> = {
  good: {
    plant: 'text-crop-good',
    chip: 'bg-crop-good/10 text-crop-good-ink',
    chipBorder: 'border-crop-good/50',
  },
  warning: {
    plant: 'text-crop-warning',
    chip: 'bg-crop-warning/10 text-crop-warning-ink',
    chipBorder: 'border-crop-warning/50',
  },
  bad: {
    plant: 'text-crop-bad',
    chip: 'bg-crop-bad/10 text-crop-bad-ink',
    chipBorder: 'border-crop-bad/50',
  },
  neutral: {
    plant: 'text-crop-neutral',
    chip: 'bg-crop-neutral/10 text-crop-neutral-ink',
    chipBorder: 'border-crop-neutral/50',
  },
}

// The dash signals the review state, not the colour, so it is always grey.
const CHIP_DASHED_BORDER = 'border-dashed border-crop-neutral'

interface Props {
  letter: string
  label: string
  note?: string
  evaluation: ResolvedCropEvaluation
  delay: number
}

export function CropBadge({ letter, label, note, evaluation, delay }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="hover:-translate-y-0.5 transition-transform duration-200">
          <CropPlantBadge
            letter={letter}
            label={label}
            status={evaluation.status}
            sentiment={evaluation.sentiment}
            delay={delay}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        <SentimentText
          sentiment={evaluation.sentiment}
          className="font-medium text-base"
        >
          {`${label}: ${getCropStatusText(evaluation.status, evaluation.sentiment)}`}
        </SentimentText>
        <CropNote note={note} />
        <CropFindings evaluation={evaluation} />
      </TooltipContent>
    </Tooltip>
  )
}

/** The plant and its chip without the tooltip, for where the findings are on the page. */
export function CropPlantBadge({
  letter,
  label,
  status,
  sentiment,
  delay,
  compact,
}: {
  letter: string
  label: string
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
  compact?: boolean
}) {
  // `fullyTransparent` is a finished assessment, so its ring stays solid.
  const isDashed = status === 'partiallyReviewed' || status === 'notReviewed'
  const palette = PALETTE[sentiment]
  return (
    <span
      className={cn(
        'flex flex-col items-center gap-1',
        compact ? 'w-8' : 'w-10',
      )}
      aria-label={`${label}: ${getCropStatusText(status, sentiment)}`}
    >
      <span
        className={cn(
          'flex items-end',
          compact ? 'h-8' : 'h-10',
          palette.plant,
        )}
      >
        <CropPlant
          status={status}
          sentiment={sentiment}
          delay={delay}
          compact={compact}
        />
      </span>
      <span
        className={cn(
          'flex items-center justify-center rounded-full border-[1.5px] font-semibold',
          compact ? 'size-[21px]' : 'size-[26px]',
          letter.length > 1 || compact ? 'text-[10px]' : 'text-xs',
          palette.chip,
          isDashed ? CHIP_DASHED_BORDER : palette.chipBorder,
        )}
        style={{
          animation: `garden-pop .5s ease-out ${delay}s both`,
        }}
      >
        {letter}
      </span>
    </span>
  )
}

/** Shared by the garden tooltip and the project page, so the two cannot drift. */
export function CropFindings({
  evaluation,
}: {
  evaluation: ResolvedCropEvaluation
}) {
  return (
    <>
      <CropSection
        title="What's good"
        items={evaluation.points}
        license={evaluation.license}
      />
      <CropSection title="What is missing" items={evaluation.missing} />
      <CropSection
        title="Additional considerations"
        items={evaluation.additionalConsiderations}
      />
      <CropSection title="Not reviewed yet" items={evaluation.notReviewed} />
    </>
  )
}

function CropLicenseText({ license }: { license: OsiLicense }) {
  return (
    <>
      {'License: '}
      <a
        href={license.url}
        target="_blank"
        rel="noreferrer noopener"
        className="text-link underline"
      >
        {license.name}
      </a>
      <span className="text-secondary">{` (${license.spdxId}, OSI approved)`}</span>
    </>
  )
}

/** The standing caveat for a crop - see `CropDefinition.note`. */
export function CropNote({
  note,
  className,
}: {
  note: string | undefined
  className?: string
}) {
  if (!note) {
    return null
  }
  return <p className={cn('mt-1.5 text-secondary', className)}>{note}</p>
}

function CropSection({
  title,
  items,
  license,
}: {
  title: string
  items: string[]
  /** Rendered as the first bullet. */
  license?: OsiLicense | undefined
}) {
  if (!license && items.length === 0) {
    return null
  }
  return (
    <>
      <p className="mt-2.5 font-semibold text-[10px] text-secondary uppercase tracking-wider">
        {title}
      </p>
      <ul className="mt-1 flex flex-col gap-1">
        {license && (
          <CropBullet>
            <CropLicenseText license={license} />
          </CropBullet>
        )}
        {items.map((item) => (
          <CropBullet key={item}>{item}</CropBullet>
        ))}
      </ul>
    </>
  )
}

function CropBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-primary">
      <span
        aria-hidden
        className="mt-[7px] size-1 shrink-0 rounded-full bg-current opacity-50"
      />
      <span>{children}</span>
    </li>
  )
}

export function getCropStatusText(
  status: ProjectCropStatus,
  sentiment: CropSentiment,
): string {
  if (status === 'notReviewed') {
    return CROP_STATUS_LABELS.notReviewed
  }
  if (status === 'fullyTransparent') {
    return CROP_STATUS_LABELS.fullyTransparent
  }
  if (status === 'partiallyReviewed') {
    return `${CROP_SENTIMENT_LABELS[sentiment]} · ${CROP_STATUS_LABELS.partiallyReviewed}`
  }
  return CROP_SENTIMENT_LABELS[sentiment]
}

/** The plant without the chip, for the legend. */
export function CropPlantSample({
  status,
  sentiment,
  delay,
}: {
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
}) {
  return (
    <span className={cn('flex h-10 items-end', PALETTE[sentiment].plant)}>
      <CropPlant status={status} sentiment={sentiment} delay={delay} />
    </span>
  )
}

/** The bare plant at any size, for layouts where it is the hero rather than a badge. */
export function CropPlantArt({
  status,
  sentiment,
  delay,
  width,
  className,
}: {
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
  width: number
  className?: string
}) {
  return (
    <span className={cn('flex items-end', PALETTE[sentiment].plant, className)}>
      <CropPlant
        status={status}
        sentiment={sentiment}
        delay={delay}
        width={width}
      />
    </span>
  )
}

function CropPlant({
  status,
  sentiment,
  delay,
  compact,
  width,
}: {
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
  compact?: boolean
  /** Overrides the badge sizes; height follows the 34:40 viewBox. */
  width?: number
}) {
  const grow: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-grow .8s cubic-bezier(.18,.7,.24,1) ${delay}s both`,
  }
  const leafL: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '100% 100%',
    animation: `garden-leaf .5s ease-out ${delay + 0.3}s both`,
  }
  const leafR: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '0% 100%',
    animation: `garden-leaf .5s ease-out ${delay + 0.36}s both`,
  }
  const bloom: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-bloom .55s cubic-bezier(.2,.9,.3,1.3) ${delay + 0.52}s both`,
  }
  const idle = (name: string, duration: string): CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `${name} ${duration} ease-in-out ${delay + 0.8}s infinite`,
  })

  const shape = PLANT_SHAPE[sentiment]
  const svgWidth = width ?? (compact ? 27 : 34)

  return (
    <svg
      width={svgWidth}
      height={(svgWidth * 40) / 34}
      viewBox="0 0 34 40"
      className="block overflow-visible"
      aria-hidden
    >
      <Soil status={status} />
      {status === 'fullyTransparent' ? (
        <TransparentFlower
          grow={grow}
          leafL={leafL}
          leafR={leafR}
          bloom={bloom}
        />
      ) : status === 'notReviewed' ? (
        <g
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
            animation: 'garden-ghost 3.6s ease-in-out infinite',
          }}
        >
          <path
            d="M17 33 V27"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
          <path
            d="M17 29.5 C13.8 29.5 11.3 27.4 10.9 24.2"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
          <path
            d="M17 29.5 C20.2 29.5 22.7 27.4 23.1 24.2"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
        </g>
      ) : shape === 'flower' ? (
        <g style={idle('garden-sway', '4.6s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 27 17 20 17 13"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M17 27 C11 27.5 6.5 24 5.6 18.8 C11.2 18.4 15.7 22 17 27 Z"
              fill="currentColor"
              style={leafL}
            />
            <path
              d="M17 27 C23 27.5 27.5 24 28.4 18.8 C22.8 18.4 18.3 22 17 27 Z"
              fill="currentColor"
              style={leafR}
            />
            <g style={bloom}>
              <circle cx="17" cy="5.2" r="3.2" fill="currentColor" />
              <circle cx="12.4" cy="9" r="3.2" fill="currentColor" />
              <circle cx="21.6" cy="9" r="3.2" fill="currentColor" />
              <circle cx="17" cy="12.6" r="3.2" fill="currentColor" />
              <circle cx="17" cy="9" r="2.05" className="fill-[#ffd54a]" />
            </g>
          </g>
        </g>
      ) : shape === 'bud' ? (
        <g style={idle('garden-sway-s', '5.2s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 29 17 25 17 20"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M17 23 C12.5 23.4 9.3 21 8.6 17.4 C12.6 17 16 19.6 17 23 Z"
              fill="currentColor"
              style={leafL}
            />
            <path
              d="M17 23 C21.5 23.4 24.7 21 25.4 17.4 C21.4 17 18 19.6 17 23 Z"
              fill="currentColor"
              style={leafR}
            />
            <ellipse
              cx="17"
              cy="18"
              rx="2.5"
              ry="3.3"
              fill="currentColor"
              style={bloom}
            />
          </g>
        </g>
      ) : (
        <g style={idle('garden-wilt', '5.6s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 28 18.6 24 13.4 22"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M13.4 22 C9.4 21 6.7 23.2 6.3 26.6 C10.3 27 12.9 24.8 13.4 22 Z"
              fill="currentColor"
            />
            <path
              d="M18.4 28 C21.9 27.6 24.4 29.4 24.8 32 C21.4 32 19 30.6 18.4 28 Z"
              fill="currentColor"
              opacity=".8"
            />
          </g>
        </g>
      )}
    </svg>
  )
}

/**
 * The whole flower as an unbroken outline: complete and see-through, for a
 * property the protocol makes no claim to. The not-reviewed ghost is dashed.
 */
function TransparentFlower({
  grow,
  leafL,
  leafR,
  bloom,
}: {
  grow: CSSProperties
  leafL: CSSProperties
  leafR: CSSProperties
  bloom: CSSProperties
}) {
  const outline = {
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const

  // Closed parts are filled in the colour of the surface behind them, so where
  // they overlap only the silhouette reads as a line. A tinted card overrides
  // `--crop-plant-bg`.
  const knockout: CSSProperties = {
    fill: 'var(--crop-plant-bg, var(--surface-primary))',
  }

  return (
    <g style={{ ...idleSway, ...knockout }}>
      <g style={grow}>
        <path
          d="M17 31.5 C17 26 17 19.5 17 13"
          strokeWidth="1.8"
          fill="none"
          {...outline}
        />
        <path
          d="M17 27 C11 27.5 6.5 24 5.6 18.8 C11.2 18.4 15.7 22 17 27 Z"
          strokeWidth="1.4"
          {...outline}
          style={leafL}
        />
        <path
          d="M17 27 C23 27.5 27.5 24 28.4 18.8 C22.8 18.4 18.3 22 17 27 Z"
          strokeWidth="1.4"
          {...outline}
          style={leafR}
        />
        <g style={bloom}>
          {/* The outline of the union of the solid flower's four petal circles. */}
          <path
            d="M13.96 6.21 A3.2 3.2 0 1 1 20.04 6.21 A3.2 3.2 0 1 1 20.11 11.83 A3.2 3.2 0 1 1 13.89 11.83 A3.2 3.2 0 1 1 13.96 6.21 Z"
            strokeWidth="1.3"
            {...outline}
          />
          <circle cx="17" cy="9" r="2.05" strokeWidth="1.2" {...outline} />
        </g>
      </g>
    </g>
  )
}

const idleSway: CSSProperties = {
  transformBox: 'fill-box',
  transformOrigin: '50% 100%',
  animation: 'garden-sway 4.6s ease-in-out 1s infinite',
}

function Soil({ status }: { status: ProjectCropStatus }) {
  if (status === 'fullyTransparent') {
    return (
      <ellipse
        cx="17"
        cy="35.4"
        rx="11.5"
        ry="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    )
  }
  if (status === 'notReviewed') {
    return (
      <ellipse
        cx="17"
        cy="35.4"
        rx="11.5"
        ry="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="3 2.6"
      />
    )
  }
  if (status === 'partiallyReviewed') {
    return (
      <>
        <path
          d="M17 32.2 A12 3.2 0 0 0 17 38.6 Z"
          className="fill-garden-soil"
        />
        <path
          d="M17 32.2 A12 3.2 0 0 1 17 38.6"
          fill="none"
          strokeWidth="1.1"
          strokeDasharray="3 2.6"
          className="stroke-crop-neutral"
        />
      </>
    )
  }
  return (
    <ellipse cx="17" cy="35.4" rx="12" ry="3.2" className="fill-garden-soil" />
  )
}
