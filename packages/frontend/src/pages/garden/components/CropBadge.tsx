import type {
  OsiLicense,
  ProjectCropEvaluation,
  ProjectCropStatus,
  Sentiment,
} from '@l2beat/config'
import type { CSSProperties, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { cn } from '~/utils/cn'
import { CROP_SENTIMENT_LABELS, CROP_STATUS_LABELS } from '../crops'

// The shape of the plant is driven by the sentiment (quality) of the crop.
type PlantShape = 'flower' | 'bud' | 'wilt'

const PLANT_SHAPE: Record<Sentiment, PlantShape> = {
  good: 'flower',
  neutral: 'flower',
  UnderReview: 'bud',
  warning: 'bud',
  bad: 'wilt',
}

// The color of the plant, driven by the sentiment.
const PLANT_COLOR: Record<Sentiment, string> = {
  good: 'text-[#1a9d4f] dark:text-[#15ca60]',
  neutral: 'text-[#bcbfc7] dark:text-[#5a5f68]',
  UnderReview: 'text-[#e0a52a] dark:text-[#ffc107]',
  warning: 'text-[#e0a52a] dark:text-[#ffc107]',
  bad: 'text-[#ef4d4d] dark:text-[#ff5d5d]',
}

// The chip fill + text color, driven by the sentiment.
const CHIP_FILL: Record<Sentiment, string> = {
  good: 'bg-[#eef9f1] text-[#16863f] dark:bg-[#15ca60]/10 dark:text-[#3fe07f]',
  neutral: 'bg-[#f7f8fa] text-[#aab0b8] dark:bg-white/5 dark:text-[#6b7079]',
  UnderReview:
    'bg-[#fdf7ea] text-[#b07d18] dark:bg-[#ffc107]/10 dark:text-[#ffcf3a]',
  warning:
    'bg-[#fdf7ea] text-[#b07d18] dark:bg-[#ffc107]/10 dark:text-[#ffcf3a]',
  bad: 'bg-[#fdeeee] text-[#d83a3a] dark:bg-[#ff5d5d]/10 dark:text-[#ff8080]',
}

// The solid chip border, driven by the sentiment, used for reviewed crops.
const CHIP_BORDER: Record<Sentiment, string> = {
  good: 'border-[#b6e0c4] dark:border-[#15ca60]/50',
  neutral: 'border-[#e0e2e8] dark:border-[#3a3f47]',
  UnderReview: 'border-[#efd9a6] dark:border-[#ffc107]/50',
  warning: 'border-[#efd9a6] dark:border-[#ffc107]/50',
  bad: 'border-[#f4c7c7] dark:border-[#ff5d5d]/50',
}

// Partially/not reviewed crops always get a grey dashed border, regardless of
// sentiment - the dash only signals the review state, not the color.
const CHIP_DASHED_BORDER =
  'border-dashed border-[#aab0b8] dark:border-[#5a5f68]'

interface Props {
  letter: string
  label: string
  /** Caveat shown above the findings - see `CropDefinition.note`. */
  note?: string
  /**
   * A resolved evaluation is assignable here: the license arrives already
   * looked up, so the plant never has to reach into the OSI list itself.
   */
  evaluation: ProjectCropEvaluation & { license?: OsiLicense }
  delay: number
}

export function CropBadge({ letter, label, note, evaluation, delay }: Props) {
  const status = resolveStatus(evaluation)
  const sentiment = resolveSentiment(evaluation)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="hover:-translate-y-0.5 transition-transform duration-200">
          <CropPlantBadge
            letter={letter}
            label={label}
            status={status}
            sentiment={sentiment}
            delay={delay}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        <SentimentText sentiment={sentiment} className="font-medium text-base">
          {`${label}: ${getCropStatusText(status, sentiment)}`}
        </SentimentText>
        <CropNote note={note} />
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
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * The plant and its lettered chip, with no tooltip around them. Used on its
 * own where the reasoning is already on the page in full, so hovering would
 * only repeat what the reader can see.
 */
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
  sentiment: Sentiment
  delay: number
  /** Smaller plant and chip, for a page that shows all four at once. */
  compact?: boolean
}) {
  // The dash marks an assessment that is not finished. `fullyTransparent` is
  // finished - there was simply nothing to grade - so its ring stays solid.
  const isDashed = status === 'partiallyReviewed' || status === 'notReviewed'
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
          PLANT_COLOR[sentiment],
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
          CHIP_FILL[sentiment],
          isDashed ? CHIP_DASHED_BORDER : CHIP_BORDER[sentiment],
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

/** Defaults `status` the way the config leaves it implicit. */
export function resolveStatus(
  evaluation: ProjectCropEvaluation,
): ProjectCropStatus {
  return evaluation.status ?? 'reviewed'
}

/** A not-reviewed crop has no color, so it always resolves to neutral. */
export function resolveSentiment(evaluation: ProjectCropEvaluation): Sentiment {
  return resolveStatus(evaluation) === 'notReviewed'
    ? 'neutral'
    : (evaluation.sentiment ?? 'neutral')
}

/**
 * The license behind a green Open source crop, worded to sit among the other
 * findings. It carries the OSI's own name for the license and links to their
 * page, because it is the one claim here a reader can go and check.
 */
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

/**
 * The standing caveat for a crop, ahead of anything we found about one
 * protocol. Muted because it is context rather than a finding, but never
 * hidden: a reader who only reads the plant should still meet it.
 */
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

export function CropSection({
  title,
  items,
  license,
}: {
  title: string
  items: string[] | undefined
  /** Rendered as the first bullet of this group - see `CropBullets`. */
  license?: OsiLicense | undefined
}) {
  if (!license && (items === undefined || items.length === 0)) {
    return null
  }
  return (
    <>
      <p className="mt-2.5 font-semibold text-[10px] text-secondary uppercase tracking-wider">
        {title}
      </p>
      <CropBullets items={items} license={license} className="mt-1" />
    </>
  )
}

export function CropBullets({
  items,
  license,
  className,
}: {
  items: string[] | undefined
  /** Rendered as the first bullet, ahead of the findings it underpins. */
  license?: OsiLicense | undefined
  className?: string
}) {
  if (!license && (items === undefined || items.length === 0)) {
    return null
  }
  return (
    <ul className={cn('flex flex-col gap-1', className)}>
      {license && (
        <CropBullet>
          <CropLicenseText license={license} />
        </CropBullet>
      )}
      {items?.map((item) => (
        <CropBullet key={item}>{item}</CropBullet>
      ))}
    </ul>
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
  sentiment: Sentiment,
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

/**
 * The plant on its own, without the letter chip - used by the legend on the
 * plant legend, which explains the shapes rather than a single crop.
 */
export function CropPlantSample({
  status,
  sentiment,
  delay,
}: {
  status: ProjectCropStatus
  sentiment: Sentiment
  delay: number
}) {
  return (
    <span className={cn('flex h-10 items-end', PLANT_COLOR[sentiment])}>
      <CropPlant status={status} sentiment={sentiment} delay={delay} />
    </span>
  )
}

function CropPlant({
  status,
  sentiment,
  delay,
  compact,
}: {
  status: ProjectCropStatus
  sentiment: Sentiment
  delay: number
  compact?: boolean
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

  return (
    <svg
      width={compact ? 27 : 34}
      height={compact ? 32 : 40}
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
 * The whole flower, drawn as an outline instead of a solid shape: every part of
 * it is there, and you see straight through it. Used for a property a protocol
 * makes no claim to and hides nothing about, which is an answer rather than a
 * gap - so unlike the not-reviewed ghost, the plant is complete and unbroken.
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
  // Outline only, and unbroken: the plant is whole and simply see-through,
  // which is the opposite claim to the dashes on a crop nobody has assessed.
  const outline = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const

  return (
    <g style={idleSway}>
      <g style={grow}>
        <path d="M17 34 C17 27 17 20 17 13" strokeWidth="1.8" {...outline} />
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
          <circle cx="17" cy="5.2" r="3.2" strokeWidth="1.3" {...outline} />
          <circle cx="12.4" cy="9" r="3.2" strokeWidth="1.3" {...outline} />
          <circle cx="21.6" cy="9" r="3.2" strokeWidth="1.3" {...outline} />
          <circle cx="17" cy="12.6" r="3.2" strokeWidth="1.3" {...outline} />
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
          className="fill-[#cfc4b0] dark:fill-[#2a251d]"
        />
        <path
          d="M17 32.2 A12 3.2 0 0 1 17 38.6"
          fill="none"
          strokeWidth="1.1"
          strokeDasharray="3 2.6"
          className="stroke-[#bcbfc7] dark:stroke-[#5a5f68]"
        />
      </>
    )
  }
  return (
    <ellipse
      cx="17"
      cy="35.4"
      rx="12"
      ry="3.2"
      className="fill-[#cfc4b0] dark:fill-[#2a251d]"
    />
  )
}
