import { cn } from '~/utils/cn'

interface Props {
  title: string
  description?: string
  /** `md` for the explainers under the garden table, `lg` for a page of its own. */
  size?: 'md' | 'lg'
}

export function SectionHeading({ title, description, size = 'lg' }: Props) {
  return (
    <div className="mb-4 max-md:px-4 md:mb-6 lg:pl-2">
      <h2
        className={cn(
          'font-bold',
          size === 'lg'
            ? 'text-heading-24 md:text-heading-32'
            : 'text-heading-20 md:text-heading-24',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-pretty text-paragraph-15 text-secondary md:text-paragraph-16">
          {description}
        </p>
      )}
    </div>
  )
}
