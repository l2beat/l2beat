import { cn } from '~/utils/cn'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Each digit is a reel that turns to its next value, the way a block number
 * ticks over: only the digits that changed move. Columns are keyed from the
 * right, so a number gaining a digit does not spin every reel.
 */
export function Odometer({
  text,
  animate,
  className,
}: {
  text: string
  animate: boolean
  className?: string
}) {
  const chars = [...text]
  return (
    <span
      className={cn('inline-flex tabular-nums leading-none', className)}
      aria-label={text}
      role="img"
    >
      {chars.map((char, i) => {
        const key = chars.length - i
        const digit = DIGITS.indexOf(char)
        if (digit === -1) {
          return (
            <span key={key} aria-hidden>
              {char}
            </span>
          )
        }
        return (
          <span
            key={key}
            aria-hidden
            className="relative inline-block h-[1em] overflow-hidden"
          >
            <span className="invisible">0</span>
            <span
              className={cn(
                'absolute inset-x-0 top-0 flex flex-col',
                animate &&
                  'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              )}
              style={{ transform: `translateY(${-digit}em)` }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="h-[1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
