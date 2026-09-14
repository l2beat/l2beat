import type { ProjectCropStatus } from '@l2beat/config'
import type { ComponentType, CSSProperties } from 'react'
import { cn } from '~/utils/cn'
import { CROP_PLANT_COLOR } from './cropPalette'
import type { CropSentiment } from './crops'

type PlantKind = 'flower' | 'bud' | 'wilt' | 'ghost' | 'transparent'

const GRADED_KIND: Record<CropSentiment, PlantKind> = {
  good: 'flower',
  neutral: 'flower',
  warning: 'bud',
  bad: 'wilt',
}

/** An ungraded status is a placeholder plant; a graded one is drawn by its sentiment. */
function getPlantKind(
  status: ProjectCropStatus,
  sentiment: CropSentiment,
): PlantKind {
  if (status === 'notReviewed') return 'ghost'
  if (status === 'fullyTransparent') return 'transparent'
  return GRADED_KIND[sentiment]
}

const PLANT: Record<PlantKind, ComponentType<{ delay: number }>> = {
  flower: Flower,
  bud: Bud,
  wilt: Wilt,
  ghost: Ghost,
  transparent: TransparentFlower,
}

/** The plant at any size; height follows the 34:40 viewBox. */
export function CropPlant({
  status,
  sentiment,
  delay,
  width = 46,
  label,
  className,
}: {
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
  width?: number
  /** Read out instead of the art. */
  label?: string
  className?: string
}) {
  const Plant = PLANT[getPlantKind(status, sentiment)]
  return (
    <span
      className={cn('flex items-end', CROP_PLANT_COLOR[sentiment], className)}
      aria-label={label}
    >
      <svg
        width={width}
        height={(width * 40) / 34}
        viewBox="0 0 34 40"
        className="block overflow-visible"
        aria-hidden
      >
        <Soil status={status} />
        <Plant delay={delay} />
      </svg>
    </span>
  )
}

/** The stem grows, the leaves unfold, the bloom pops, then the plant idles. */
function timings(delay: number) {
  const at = (origin: string, animation: string): CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: origin,
    animation,
  })
  return {
    grow: at(
      '50% 100%',
      `garden-grow .8s cubic-bezier(.18,.7,.24,1) ${delay}s both`,
    ),
    leafL: at('100% 100%', `garden-leaf .5s ease-out ${delay + 0.3}s both`),
    leafR: at('0% 100%', `garden-leaf .5s ease-out ${delay + 0.36}s both`),
    bloom: at(
      '50% 100%',
      `garden-bloom .55s cubic-bezier(.2,.9,.3,1.3) ${delay + 0.52}s both`,
    ),
    idle: (name: string, duration: string) =>
      at(
        '50% 100%',
        `${name} ${duration} ease-in-out ${delay + 0.8}s infinite`,
      ),
  }
}

const STEM = {
  stroke: 'currentColor',
  strokeWidth: 2.2,
  fill: 'none',
  strokeLinecap: 'round',
} as const

const FLOWER = {
  stem: 'M17 34 C17 27 17 20 17 13',
  leafL: 'M17 27 C11 27.5 6.5 24 5.6 18.8 C11.2 18.4 15.7 22 17 27 Z',
  leafR: 'M17 27 C23 27.5 27.5 24 28.4 18.8 C22.8 18.4 18.3 22 17 27 Z',
  petals: [
    { cx: 17, cy: 5.2 },
    { cx: 12.4, cy: 9 },
    { cx: 21.6, cy: 9 },
    { cx: 17, cy: 12.6 },
  ],
  /** The outline of the union of the four petals, for the see-through flower. */
  petalOutline:
    'M13.96 6.21 A3.2 3.2 0 1 1 20.04 6.21 A3.2 3.2 0 1 1 20.11 11.83 A3.2 3.2 0 1 1 13.89 11.83 A3.2 3.2 0 1 1 13.96 6.21 Z',
}

function Flower({ delay }: { delay: number }) {
  const t = timings(delay)
  return (
    <g style={t.idle('garden-sway', '4.6s')}>
      <g style={t.grow}>
        <path d={FLOWER.stem} {...STEM} />
        <path d={FLOWER.leafL} fill="currentColor" style={t.leafL} />
        <path d={FLOWER.leafR} fill="currentColor" style={t.leafR} />
        <g style={t.bloom}>
          {FLOWER.petals.map((petal) => (
            <circle
              key={`${petal.cx}-${petal.cy}`}
              {...petal}
              r="3.2"
              fill="currentColor"
            />
          ))}
          <circle cx="17" cy="9" r="2.05" className="fill-garden-sun" />
        </g>
      </g>
    </g>
  )
}

function Bud({ delay }: { delay: number }) {
  const t = timings(delay)
  return (
    <g style={t.idle('garden-sway-s', '5.2s')}>
      <g style={t.grow}>
        <path d="M17 34 C17 29 17 25 17 20" {...STEM} />
        <path
          d="M17 23 C12.5 23.4 9.3 21 8.6 17.4 C12.6 17 16 19.6 17 23 Z"
          fill="currentColor"
          style={t.leafL}
        />
        <path
          d="M17 23 C21.5 23.4 24.7 21 25.4 17.4 C21.4 17 18 19.6 17 23 Z"
          fill="currentColor"
          style={t.leafR}
        />
        <ellipse
          cx="17"
          cy="18"
          rx="2.5"
          ry="3.3"
          fill="currentColor"
          style={t.bloom}
        />
      </g>
    </g>
  )
}

function Wilt({ delay }: { delay: number }) {
  const t = timings(delay)
  return (
    <g style={t.idle('garden-wilt', '5.6s')}>
      <g style={t.grow}>
        <path d="M17 34 C17 28 18.6 24 13.4 22" {...STEM} />
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
  )
}

/** A dashed sprout that fades in and out: nothing has been looked at yet. */
function Ghost() {
  const dashed = {
    stroke: 'currentColor',
    fill: 'none',
    strokeLinecap: 'round',
    strokeDasharray: '2 2.4',
  } as const
  return (
    <g
      style={{
        transformBox: 'fill-box',
        transformOrigin: '50% 100%',
        animation: 'garden-ghost 3.6s ease-in-out infinite',
      }}
    >
      <path d="M17 33 V27" strokeWidth="1.5" {...dashed} />
      <path
        d="M17 29.5 C13.8 29.5 11.3 27.4 10.9 24.2"
        strokeWidth="1.3"
        {...dashed}
      />
      <path
        d="M17 29.5 C20.2 29.5 22.7 27.4 23.1 24.2"
        strokeWidth="1.3"
        {...dashed}
      />
    </g>
  )
}

/**
 * The whole flower as an unbroken outline: complete and see-through, for a
 * property the protocol makes no claim to. Closed parts are filled in the
 * colour of the surface behind them, so where they overlap only the
 * silhouette reads as a line.
 */
function TransparentFlower({ delay }: { delay: number }) {
  const t = timings(delay)
  const outline = {
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const
  return (
    <g style={t.idle('garden-sway', '4.6s')} className="fill-surface-primary">
      <g style={t.grow}>
        <path
          d="M17 31.5 C17 26 17 19.5 17 13"
          strokeWidth="1.8"
          fill="none"
          {...outline}
        />
        <path d={FLOWER.leafL} strokeWidth="1.4" {...outline} style={t.leafL} />
        <path d={FLOWER.leafR} strokeWidth="1.4" {...outline} style={t.leafR} />
        <g style={t.bloom}>
          <path d={FLOWER.petalOutline} strokeWidth="1.3" {...outline} />
          <circle cx="17" cy="9" r="2.05" strokeWidth="1.2" {...outline} />
        </g>
      </g>
    </g>
  )
}

const SOIL_OUTLINE = {
  cx: 17,
  cy: 35.4,
  rx: 11.5,
  ry: 3,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
}

/** Solid ground under a finished review; dashed where it is not final; an outline where nothing is graded. */
function Soil({ status }: { status: ProjectCropStatus }) {
  switch (status) {
    case 'fullyTransparent':
      return <ellipse {...SOIL_OUTLINE} />
    case 'notReviewed':
      return <ellipse {...SOIL_OUTLINE} strokeDasharray="3 2.6" />
    case 'partiallyReviewed':
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
    case 'reviewed':
      return (
        <ellipse
          cx="17"
          cy="35.4"
          rx="12"
          ry="3.2"
          className="fill-garden-soil"
        />
      )
  }
}
