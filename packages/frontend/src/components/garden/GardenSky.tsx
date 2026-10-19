import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { CropPlant, type PlantMotion } from './CropPlant'

// The garden's landscape, shared by its page backdrop and the CROPS banners
// elsewhere, so the garden looks the same wherever it shows: four ridges that
// fade with distance and a low sun behind the farthest one, a moon in dark mode.
// The hills sit low on the left, where a banner puts its text.

const SKY =
  'bg-[linear-gradient(180deg,#e2eee1_0%,#edf2de_55%,#f8f0cf_100%)] dark:bg-[linear-gradient(180deg,#060b16_0%,#0c1527_60%,#1a2336_100%)]'

/** Far to near, drawn in a 1200x200 box. */
const RIDGES = [
  {
    d: 'M0 170 C200 162 380 140 560 114 C720 94 820 70 940 72 C1060 74 1130 90 1200 84 L1200 200 L0 200 Z',
    className: 'fill-[#d5e4cb] dark:fill-[#172131]',
  },
  {
    d: 'M0 182 C220 178 420 166 600 142 C760 124 880 106 1000 110 C1100 113 1160 122 1200 120 L1200 200 L0 200 Z',
    className: 'fill-[#bdd6ac] dark:fill-[#152620]',
  },
  {
    d: 'M0 190 C260 188 480 180 700 166 C860 154 1000 142 1200 150 L1200 200 L0 200 Z',
    className: 'fill-[#9fc48a] dark:fill-[#132b1b]',
  },
  {
    d: 'M0 196 C300 195 560 192 800 182 C960 176 1100 172 1200 176 L1200 200 L0 200 Z',
    className: 'fill-[#7eab68] dark:fill-[#0f2314]',
  },
]

/** The moon, 24 units across: the full disc less one shifted right. */
const CRESCENT = 'M16.92 1.05A12 12 0 1 0 16.92 22.95A11 11 0 0 1 16.92 1.05Z'

/**
 * The sky, the sun and the ridges, filling the nearest positioned parent.
 * `lightClassName` places and sizes the sun (the moon in dark mode);
 * `ridgesClassName` sets how tall the hills are (the full height by
 * default). `flat` leaves out the sky and the glow, for a card among cards:
 * the ridges and the sun alone on the card's own surface.
 */
export function GardenLandscape({
  lightClassName,
  ridgesClassName = 'h-full',
  flat = false,
  className,
  children,
}: {
  lightClassName: string
  ridgesClassName?: string
  flat?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        !flat && SKY,
        className,
      )}
    >
      <span
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 absolute',
          lightClassName,
        )}
      >
        {!flat && (
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,206,84,.55)_0%,rgba(255,206,84,.16)_38%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(233,228,200,.22)_0%,rgba(233,228,200,.06)_40%,transparent_70%)]" />
        )}
        {/* A crescent: a pale disc alone reads as a second sun. */}
        <span className="absolute inset-[38%]">
          <span className="block size-full rounded-full bg-[#ffd76a] dark:hidden" />
          <svg
            viewBox="0 0 24 24"
            className="hidden size-full fill-garden-moon dark:block"
          >
            <path d={CRESCENT} transform="rotate(-25 12 12)" />
          </svg>
        </span>
      </span>
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className={cn('absolute inset-x-0 bottom-0 w-full', ridgesClassName)}
      >
        {RIDGES.map((ridge) => (
          <path key={ridge.d} d={ridge.d} className={ridge.className} />
        ))}
      </svg>
      {children}
    </span>
  )
}

export interface GardenFlower {
  left: string
  bottom: string
  width: number
}

/** Flowers standing on the nearest ridge, growing in one after another. */
export function GardenFlowers({
  flowers,
  motion,
}: {
  flowers: GardenFlower[]
  /** Scenery, so never the garden's endless sway: see `PlantMotion`. */
  motion: Exclude<PlantMotion, 'sway'>
}) {
  return flowers.map((flower, index) => (
    <span
      key={flower.left}
      className="-translate-x-1/2 absolute"
      style={{ left: flower.left, bottom: flower.bottom }}
    >
      <CropPlant
        status="reviewed"
        sentiment="good"
        delay={0.25 + index * 0.18}
        width={flower.width}
        soil={false}
        motion={motion}
      />
    </span>
  ))
}
