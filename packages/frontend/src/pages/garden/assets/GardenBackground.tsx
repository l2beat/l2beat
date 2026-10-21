import { PageBackdrop } from '~/layouts/PageBackdrop'
import { cn } from '~/utils/cn'

/** A sky wash, a sun and two hills. In dark mode the day turns into night. */
export function GardenBackground() {
  return (
    <PageBackdrop name="garden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-garden-sky to-transparent" />
      <Stars />
      <Sun className="absolute top-10 right-14 max-md:top-6 max-md:right-6 max-md:scale-75 dark:hidden" />
      <Moon className="absolute top-10 right-14 hidden max-md:top-6 max-md:right-6 max-md:scale-75 dark:block" />
      <svg
        className="absolute bottom-0 left-0 h-36 w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
      >
        <path
          d="M0 90 C200 40 380 120 600 80 C820 40 1000 110 1200 70 L1200 160 L0 160 Z"
          className="fill-[#dcead3]/70 dark:fill-[#1b2415]/70"
        />
        <path
          d="M0 130 C260 90 460 150 720 115 C940 85 1080 140 1200 115 L1200 160 L0 160 Z"
          className="fill-garden-border/70"
        />
      </svg>
    </PageBackdrop>
  )
}

function Sun({ className }: { className?: string }) {
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

function Moon({ className }: { className?: string }) {
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

const STARS = [
  { left: '4%', top: 28, size: 2 },
  { left: '11%', top: 96, size: 1.5 },
  { left: '19%', top: 44, size: 1.5 },
  { left: '27%', top: 132, size: 2 },
  { left: '36%', top: 20, size: 1.5 },
  { left: '44%', top: 84, size: 2 },
  { left: '53%', top: 36, size: 1.5 },
  { left: '61%', top: 120, size: 1.5 },
  { left: '69%', top: 56, size: 2 },
  { left: '77%', top: 16, size: 1.5 },
  { left: '84%', top: 148, size: 1.5 },
  { left: '96%', top: 104, size: 2 },
]

function Stars() {
  return (
    <div className="absolute inset-x-0 top-0 hidden h-64 dark:block">
      {STARS.map((star) => (
        <span
          key={star.left}
          className="absolute rounded-full bg-garden-moon/70"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </div>
  )
}
