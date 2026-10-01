import { cn } from '~/utils/cn'

// The garden's sky and land, shared by its page backdrop and the CROPS
// banners elsewhere, so the garden looks the same wherever it shows.

/** Two rolling hills, drawn in a 1200x160 box. */
export const GARDEN_HILLS = {
  back: 'M0 90 C200 40 380 120 600 80 C820 40 1000 110 1200 70 L1200 160 L0 160 Z',
  backClassName: 'fill-[#dcead3]/70 dark:fill-[#1b2415]/70',
  front:
    'M0 130 C260 90 460 150 720 115 C940 85 1080 140 1200 115 L1200 160 L0 160 Z',
  frontClassName: 'fill-garden-border/70',
}

export function Sun({ className }: { className?: string }) {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45)
  return (
    <svg
      width={112}
      height={112}
      viewBox="0 0 112 112"
      className={cn('overflow-visible text-garden-sun', className)}
    >
      <circle cx="56" cy="56" r="52" className="fill-garden-sun/25" />
      <g
        style={{
          transformBox: 'fill-box',
          transformOrigin: '50% 50%',
          animation: 'garden-spin 90s linear infinite',
        }}
      >
        {rays.map((angle) => (
          <line
            key={angle}
            x1="56"
            y1="14"
            x2="56"
            y2="24"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${angle} 56 56)`}
          />
        ))}
      </g>
      <circle cx="56" cy="56" r="22" fill="currentColor" />
      <circle cx="56" cy="56" r="22" className="fill-white/25" />
    </svg>
  )
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg
      width={112}
      height={112}
      viewBox="0 0 112 112"
      className={cn('overflow-visible text-garden-moon', className)}
    >
      <circle cx="56" cy="56" r="52" className="fill-garden-moon/10" />
      <path
        d="M52.93 34.22 A22 22 0 1 0 76.58 63.78 A19 19 0 1 1 52.93 34.22 Z"
        fill="currentColor"
      />
    </svg>
  )
}

const BANNER_STARS = [
  { left: '8%', top: 10 },
  { left: '23%', top: 26 },
  { left: '41%', top: 8 },
  { left: '58%', top: 22 },
  { left: '74%', top: 12 },
]

/**
 * The garden in miniature, laid behind a banner's content: its canvas, the
 * sun (the moon and a few stars in the dark theme) and the hills. `compact`
 * draws it small enough for the side nav.
 */
export function GardenScenery({
  compact,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const skyClassName = compact
    ? '-top-2.5 right-1 size-9'
    : '-top-4 right-5 size-[72px]'
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden bg-garden-canvas',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-garden-sky to-transparent" />
      {!compact &&
        BANNER_STARS.map((star) => (
          <span
            key={star.left}
            className="absolute hidden size-[1.5px] rounded-full bg-garden-moon/70 dark:block"
            style={{ left: star.left, top: star.top }}
          />
        ))}
      <Sun className={cn('absolute dark:hidden', skyClassName)} />
      <Moon className={cn('absolute hidden dark:block', skyClassName)} />
      <svg
        className={cn(
          'absolute inset-x-0 bottom-0 w-full',
          compact ? 'h-1/2' : 'h-3/5',
        )}
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
      >
        <path d={GARDEN_HILLS.back} className={GARDEN_HILLS.backClassName} />
        <path d={GARDEN_HILLS.front} className={GARDEN_HILLS.frontClassName} />
      </svg>
    </div>
  )
}
