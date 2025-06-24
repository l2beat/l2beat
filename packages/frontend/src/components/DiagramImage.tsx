import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  return (
    <>
      <img
        className={cn(
          'inline max-w-full align-[unset] dark:invert',
          diagram.src.dark && 'dark:hidden',
        )}
        alt={diagram.caption}
        {...diagram.src.light}
      />
      {diagram.src.dark && (
        <img
          className="hidden max-w-full align-[unset] dark:inline"
          alt={diagram.caption}
          {...diagram.src.dark}
        />
      )}
    </>
  )
}
