import { GARDEN_HILLS, Moon, Sun } from '~/components/garden/GardenSky'
import { PageBackdrop } from '~/layouts/PageBackdrop'

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
        <path d={GARDEN_HILLS.back} className={GARDEN_HILLS.backClassName} />
        <path d={GARDEN_HILLS.front} className={GARDEN_HILLS.frontClassName} />
      </svg>
    </PageBackdrop>
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
