import { PageBackdrop } from '~/layouts/PageBackdrop'
import { cn } from '~/utils/cn'

/** A sky wash, a sun and two hills. */
export function GardenBackground() {
  return (
    <PageBackdrop name="garden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-garden-sky to-transparent" />
      <Sun className="absolute top-10 right-14 max-md:top-6 max-md:right-6 max-md:scale-75" />
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
          className="fill-garden-ground"
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
      className={cn(
        'overflow-visible text-[#ffd54a] dark:text-[#c9a437]',
        className,
      )}
    >
      <circle
        cx="56"
        cy="56"
        r="52"
        className="fill-[#ffd54a]/25 dark:fill-[#ffd54a]/10"
      />
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
      <circle
        cx="56"
        cy="56"
        r="22"
        className="fill-white/25 dark:fill-transparent"
      />
    </svg>
  )
}
