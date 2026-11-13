import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'

/**
 * Wide diagrams keep a readable 720px on phones and scroll inside their own
 * box; shrunk to the screen their labels fell to 3–7px. The box runs to the
 * screen edge and a hint says it scrolls, so the crop reads as continuation.
 */
const PHONE_READABLE_WIDTH = 720

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  const scrollsOnPhones = diagram.src.light.width > PHONE_READABLE_WIDTH
  const phoneClassName = scrollsOnPhones && 'max-md:w-[720px] max-md:max-w-none'
  return (
    <>
      {/* Above the image, so the caption stays directly under it. */}
      {scrollsOnPhones && (
        <p className="mb-2 text-left text-label-value-13 text-secondary md:hidden">
          Scroll sideways to see the whole diagram, or tap to open it.
        </p>
      )}
      <div
        className={cn(
          scrollsOnPhones &&
            'max-md:-mx-4 max-md:overflow-x-auto max-md:px-4 max-md:text-left',
        )}
      >
        <a
          href={diagram.src.light.src}
          target="_blank"
          rel="noreferrer"
          className="inline-block"
        >
          <img
            className={cn(
              // Inverting swaps red and green; rotating the hue puts them back.
              'inline max-w-full align-[unset] dark:hue-rotate-180 dark:invert',
              phoneClassName,
              diagram.src.dark && 'dark:hidden',
            )}
            alt={diagram.caption}
            {...diagram.src.light}
          />
          {diagram.src.dark && (
            <img
              className={cn(
                'hidden max-w-full align-[unset] dark:inline',
                phoneClassName,
              )}
              alt={diagram.caption}
              {...diagram.src.dark}
            />
          )}
        </a>
      </div>
    </>
  )
}
