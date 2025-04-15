import Image from 'next/image'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/get-diagram-params'

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  return (
    <>
      <Image
        className={cn(
          'inline max-w-full align-[unset] dark:invert',
          diagram.src.dark && 'dark:hidden',
        )}
        alt={diagram.caption}
        {...diagram.src.light}
      />
      {diagram.src.dark && (
        <Image
          className="hidden max-w-full align-[unset] dark:inline"
          alt={diagram.caption}
          {...diagram.src.dark}
        />
      )}
    </>
  )
}
