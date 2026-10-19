import { cn } from '~/utils/cn'
import {
  HOME_BANNER_CLASS,
  HOME_BANNER_TITLE_CLASS,
  HOME_TEXT,
} from '../homeStyles'
import { HomeCard } from './HomeCard'

// TODO: point at the mandate once it is published; About Us, with our
// mission, stands in until then.
const MANDATE_HREF = '/about-us'

/**
 * Beside CROPS from lg; alone below it, where the menu takes CROPS's place.
 * The mandate itself is drawn in the corner, flat like the garden beside it:
 * a charter signed with L2BEAT's heartbeat and sealed with its heart.
 */
export function HomeMandateBanner({ className }: { className?: string }) {
  return (
    <HomeCard asChild className={cn(HOME_BANNER_CLASS, className)}>
      <a href={MANDATE_HREF}>
        {/* Lifts toward the reader on hover, as if picked up. */}
        <MandateCharter className="-right-2 -bottom-5 group-hover:-translate-y-1.5 pointer-events-none absolute w-32 rotate-[-7deg] transition-[rotate,translate] duration-300 ease-out group-hover:rotate-[-3deg] lg:max-xl:w-28" />
        {/* The title runs above the drawing; the line under it keeps clear
            of it, on the left. */}
        <div className="relative flex flex-col gap-1.5">
          <h2 className={cn(HOME_TEXT.title, HOME_BANNER_TITLE_CLASS)}>
            Read our mandate
          </h2>
          <p className={cn('max-w-[62%]', HOME_TEXT.body)}>
            What L2BEAT stands for and how we work.
          </p>
        </div>
      </a>
    </HomeCard>
  )
}

/** A heart, 24 units square, as in the logo's mark. */
const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

/** The charter's lines of text: [y, width], ragged like a real paragraph. */
const TEXT_LINES = [
  [60, 96],
  [74, 104],
  [88, 84],
  [102, 98],
] as const

function MandateCharter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 170"
      aria-hidden
      className={cn('overflow-visible', className)}
    >
      {/* The page beneath, a little askew. */}
      <rect
        x="38"
        y="10"
        width="124"
        height="168"
        rx="8"
        transform="rotate(7 100 94)"
        className="fill-surface-tertiary"
      />
      {/* The charter, its top corner folded. */}
      <path
        d="M26 22a8 8 0 0 1 8-8h94l24 24v140H26z"
        className="fill-surface-secondary"
      />
      <path
        d="M128 14v18a6 6 0 0 0 6 6h18z"
        className="fill-surface-tertiary"
      />
      <rect
        x="42"
        y="36"
        width="58"
        height="8"
        rx="4"
        className="fill-surface-tertiary"
      />
      {TEXT_LINES.map(([y, width]) => (
        <rect
          key={y}
          x="42"
          y={y}
          width={width}
          height="5"
          rx="2.5"
          className="fill-surface-tertiary"
        />
      ))}
      {/* Signed with the beat in L2BEAT, once, as the page loads. */}
      <path
        d="M42 132h24l6-12 9 26 8-34 6 20h14"
        pathLength={1}
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand-red dark:stroke-brand-red-dark"
        style={{
          strokeDasharray: 1,
          animation: 'mandate-sign 0.9s ease-out 0.4s both',
        }}
      />
      {/* The seal: the heart of the logo. */}
      <circle
        cx="134"
        cy="132"
        r="17"
        className="fill-brand-red dark:fill-brand-red-dark"
      />
      <path
        d={HEART}
        transform="translate(123 121) scale(0.92)"
        className="fill-white"
      />
    </svg>
  )
}
