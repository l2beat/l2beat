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
 * Beside CROPS from md, under it on phones.
 * The mandate itself is drawn in the corner, flat like the garden beside it:
 * a charter signed with L2BEAT's heartbeat and sealed with its heart.
 */
export function HomeMandateBanner({ className }: { className?: string }) {
  return (
    // The page's one block of colour.
    <HomeCard
      asChild
      // Deeper at the bottom, so the rule runs clear of the text.
      className={cn(
        HOME_BANNER_CLASS,
        'bg-brand pb-7 text-pure-white [--charter-w:6rem] md:pb-8 lg:[--charter-w:7rem] xl:[--charter-w:8rem]',
        className,
      )}
    >
      <a href={MANDATE_HREF}>
        {/* A rule, running in from the edge. When the charter
            is picked up it straightens, and its heartbeat carries the rule
            on. */}
        <span
          aria-hidden
          className="absolute left-0 bg-pure-white"
          style={RULE_STYLE}
        />
        {/* Lifts toward the reader on hover, as if picked up. Smaller below
            lg, where the card is one line of text tall, so its top shows. */}
        <MandateCharter className="-right-2 -bottom-5 group-hover:-translate-y-1.5 pointer-events-none absolute w-(--charter-w) rotate-[-7deg] transition-[rotate,translate] duration-300 ease-out group-hover:rotate-0" />
        {/* White on the pink, the title and the line under it alike; the
            line keeps clear of the drawing, on the left. */}
        <div className="relative flex flex-col gap-1.5">
          <h2 className={cn(HOME_TEXT.title, HOME_BANNER_TITLE_CLASS)}>
            Read our mandate
          </h2>
          {/* Medium weight: regular white reads thin on the pink. */}
          <p
            className={cn(
              'max-w-[68%]',
              HOME_TEXT.body,
              'text-balance font-medium text-pure-white',
            )}
          >
            {/* "stands for" stays together when the line wraps. */}
            What L2BEAT stands{'\u00a0'}for and how we work.
          </p>
        </div>
      </a>
    </HomeCard>
  )
}

/**
 * The rule meets the charter's heartbeat as the charter rests once picked
 * up: straight, 6px up from where it hangs, 20px below the card's bottom and
 * 8px past its right edge. In the charter's units (180 across its width), the
 * beat's line is at y = 132 of 170, starts at its left edge, x = 26, and is
 * 3.5 thick; the rule goes on 6px under the charter.
 */
const RULE_STYLE = {
  height: 'calc(var(--charter-w) * 3.5 / 180)',
  bottom: 'calc(var(--charter-w) * (170 - 132 - 1.75) / 180 - 14px)',
  right: 'calc(var(--charter-w) * (180 - 26) / 180 - 14px)',
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
        className="fill-[#ccd0da]"
      />
      {/* The charter, its top corner folded. */}
      <path
        d="M26 22a8 8 0 0 1 8-8h94l24 24v140H26z"
        className="fill-[#fafafa]"
      />
      <path d="M128 14v18a6 6 0 0 0 6 6h18z" className="fill-[#ccd0da]" />
      <rect
        x="42"
        y="36"
        width="58"
        height="8"
        rx="4"
        className="fill-[#ccd0da]"
      />
      {TEXT_LINES.map(([y, width]) => (
        <rect
          key={y}
          x="42"
          y={y}
          width={width}
          height="5"
          rx="2.5"
          className="fill-[#ccd0da]"
        />
      ))}
      {/* Signed with the beat in L2BEAT, once, as the page loads. It starts
          at the edge, where the banner's rule meets it. */}
      <path
        d="M26 132h40l6-12 9 26 8-34 6 20h14"
        pathLength={1}
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand"
        style={{
          strokeDasharray: 1,
          animation: 'mandate-sign 0.9s ease-out 0.4s both',
        }}
      />
      {/* The seal: the heart of the logo. */}
      <circle cx="134" cy="132" r="17" className="fill-brand" />
      <path
        d={HEART}
        transform="translate(123 121) scale(0.92)"
        className="fill-white"
      />
    </svg>
  )
}
