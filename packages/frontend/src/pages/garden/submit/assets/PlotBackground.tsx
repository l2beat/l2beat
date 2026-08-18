import type { CSSProperties } from 'react'
import { cn } from '~/utils/cn'

/**
 * The scenery behind the submission page. Deliberately a different scene from
 * the one on the garden itself: an early-morning plot rather than a sunlit
 * meadow - drifting clouds, freshly tilled furrows, a row of young seedlings
 * and a trellis waiting for something to climb it.
 */
export function PlotBackground() {
  return (
    <div
      aria-hidden
      className="-z-10 pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#fdf1de]/85 via-[#f4f6e6]/40 to-transparent dark:from-[#1e1b12]/70 dark:via-[#161c12]/40" />

      <Cloud className="absolute top-16 left-[7%] w-44 max-md:top-8 max-md:w-28" />
      <Cloud
        className="absolute top-36 right-[12%] w-28 max-md:hidden"
        duration="52s"
        delay="-14s"
      />

      {POLLEN.map((pollen) => (
        <span
          key={pollen.left}
          className="absolute size-1.5 rounded-full bg-[#e0b84a]/50 max-md:hidden dark:bg-[#ffd54a]/25"
          style={{
            left: pollen.left,
            bottom: pollen.bottom,
            animation: `plot-float ${pollen.duration} linear ${pollen.delay} infinite`,
          }}
        />
      ))}

      {/* Sunk 14px below the soil line of the plot below, so it reads as
          planted rather than floating when content scrolls past it. */}
      <Trellis className="absolute right-[9%] bottom-24 max-lg:hidden" />

      <div className="absolute inset-x-0 bottom-0 h-44">
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 1200 176"
          preserveAspectRatio="none"
        >
          {/* The plot: a straight, freshly turned bed rather than rolling hills. */}
          <path
            d="M0 66 C300 54 900 54 1200 66 L1200 176 L0 176 Z"
            className="fill-[#e7dcc6]/70 dark:fill-[#241f16]/75"
          />
          <path
            d="M0 96 C300 86 900 86 1200 96 L1200 176 L0 176 Z"
            className="fill-[#d8c9ac]/70 dark:fill-[#2a251b]/75"
          />
          {FURROWS.map((furrow) => (
            <path
              key={furrow}
              d={`M0 ${furrow} C300 ${furrow - 9} 900 ${furrow - 9} 1200 ${furrow}`}
              fill="none"
              strokeWidth="2"
              className="stroke-[#c3b394]/70 dark:stroke-[#3a3226]/80"
            />
          ))}
        </svg>
        <div className="absolute inset-x-4 bottom-[74px] flex items-end justify-between md:inset-x-10">
          {SEEDLINGS.map((seedling, index) => (
            <Seedling
              key={seedling.size}
              size={seedling.size}
              delay={index * 0.16}
              className={seedling.className}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const FURROWS = [112, 134, 156]

const POLLEN = [
  { left: '18%', bottom: '150px', duration: '11s', delay: '0s' },
  { left: '34%', bottom: '170px', duration: '14s', delay: '-3s' },
  { left: '58%', bottom: '140px', duration: '12s', delay: '-7s' },
  { left: '76%', bottom: '180px', duration: '15s', delay: '-5s' },
  { left: '89%', bottom: '155px', duration: '13s', delay: '-9s' },
]

// Uneven sizes so the row reads as a planted bed rather than a pattern. The
// smallest ones drop out on mobile, where the row has much less space.
const SEEDLINGS = [
  { size: 30, className: '' },
  { size: 20, className: 'max-md:hidden' },
  { size: 34, className: '' },
  { size: 22, className: 'max-md:hidden' },
  { size: 28, className: '' },
  { size: 18, className: 'max-md:hidden' },
  { size: 32, className: '' },
  { size: 24, className: 'max-md:hidden' },
]

function Seedling({
  size,
  delay,
  className,
}: {
  size: number
  delay: number
  className?: string
}) {
  const grow: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-grow .9s cubic-bezier(.18,.7,.24,1) ${delay}s both`,
  }
  const sway: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-sway-s ${5 + delay}s ease-in-out ${delay + 0.9}s infinite`,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      className={cn(
        'block overflow-visible text-[#7fae6a]/60 dark:text-[#3f6b3a]/70',
        className,
      )}
    >
      <g style={sway}>
        <g style={grow}>
          <path
            d="M17 34 V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M17 22 C12.6 22.4 9.4 20 8.7 16.4 C12.7 16 16 18.6 17 22 Z"
            fill="currentColor"
          />
          <path
            d="M17 18 C21.4 18.4 24.6 16 25.3 12.4 C21.3 12 18 14.6 17 18 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  )
}

function Cloud({
  className,
  duration = '40s',
  delay = '0s',
}: {
  className?: string
  duration?: string
  delay?: string
}) {
  return (
    <svg
      viewBox="0 0 120 48"
      className={cn(
        'h-auto text-white/55 dark:text-[#2b3140]/45',
        'motion-reduce:animate-none',
        className,
      )}
      style={{
        animation: `plot-drift ${duration} ease-in-out ${delay} infinite`,
      }}
    >
      <path
        d="M22 40 C10 40 4 33 8 26 C11 20 18 19 22 21 C24 11 34 6 43 9 C48 1 60 0 66 7 C74 3 84 7 86 16 C96 15 104 21 104 28 C104 35 98 40 88 40 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Trellis({ className }: { className?: string }) {
  return (
    <svg
      width={132}
      height={168}
      viewBox="0 0 132 168"
      className={cn('text-[#c0ac86]/50 dark:text-[#3a3226]/70', className)}
    >
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M28 168 V16" />
        <path d="M104 168 V16" />
        <path d="M28 30 H104" />
        <path d="M28 66 H104" />
        <path d="M28 102 H104" />
        <path d="M28 138 H104" />
      </g>
      <path
        d="M66 168 C66 140 40 132 40 104 C40 80 66 74 66 46"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-[#7fae6a]/50 dark:stroke-[#3f6b3a]/60"
      />
      {[
        { cx: 50, cy: 138 },
        { cx: 42, cy: 108 },
        { cx: 56, cy: 82 },
        { cx: 64, cy: 56 },
      ].map((leaf) => (
        <ellipse
          key={leaf.cy}
          cx={leaf.cx}
          cy={leaf.cy}
          rx="9"
          ry="5"
          transform={`rotate(-28 ${leaf.cx} ${leaf.cy})`}
          className="fill-[#7fae6a]/45 dark:fill-[#3f6b3a]/55"
        />
      ))}
    </svg>
  )
}
