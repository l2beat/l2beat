import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/get-diagram-params'

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={cn(
          'inline max-w-full align-[unset] dark:invert',
          diagram.src.dark && 'dark:hidden',
        )}
        src={diagram.src.light}
        alt={diagram.caption}
      />
      {diagram.src.dark && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="hidden max-w-full align-[unset] dark:inline"
          src={diagram.src.dark}
          alt={diagram.caption}
        />
      )}
    </>
  )
}
