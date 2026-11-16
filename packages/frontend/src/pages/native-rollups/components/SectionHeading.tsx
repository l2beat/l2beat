export function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-4 max-md:px-4 md:mb-6">
      <h2 className="font-semibold text-heading-24 md:text-heading-32">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-paragraph-15 text-secondary md:text-paragraph-16">
          {description}
        </p>
      )}
    </div>
  )
}
