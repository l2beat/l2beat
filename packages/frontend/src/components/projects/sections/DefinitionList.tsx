import { Markdown } from '../../markdown/Markdown'

/**
 * Short named facts (a term and a sentence or two each), set as one grid so
 * every research section with this shape of content reads the same way.
 */
export function DefinitionList({ entries }: { entries: [string, string][] }) {
  return (
    <dl className="border-divider border-t">
      {entries.map(([name, description]) => (
        <div
          key={name}
          className="grid gap-1 border-divider border-b py-3 md:grid-cols-[180px_1fr] md:gap-4"
        >
          <dt className="font-medium text-label-value-14 leading-5 md:pt-0.5">
            {name}
          </dt>
          <dd>
            <Markdown className="text-paragraph-14 md:text-paragraph-15">
              {description}
            </Markdown>
          </dd>
        </div>
      ))}
    </dl>
  )
}
