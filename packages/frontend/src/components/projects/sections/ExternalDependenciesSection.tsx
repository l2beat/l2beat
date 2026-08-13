import { CustomLink } from '~/components/link/CustomLink'
import type { DefiDependency } from '~/server/features/defi/resolveDefiDependencies'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ExternalDependenciesSectionProps extends ProjectSectionProps {
  dependencies: DefiDependency[]
}

export function ExternalDependenciesSection({
  dependencies,
  ...sectionProps
}: ExternalDependenciesSectionProps) {
  if (dependencies.length === 0) {
    return (
      <ProjectSection {...sectionProps}>
        <p className="text-paragraph-15 md:text-paragraph-16">
          This project has no external dependencies: no oracle, bridge, or other
          third-party contract is required for its contracts to operate.
        </p>
      </ProjectSection>
    )
  }

  return (
    <ProjectSection {...sectionProps}>
      <ul className="flex flex-col gap-4">
        {dependencies.map((dependency) => (
          <li
            key={`${dependency.name}:${dependency.icon}`}
            className="flex items-start gap-3"
          >
            <img
              src={dependency.icon}
              alt={`${dependency.name} logo`}
              className="mt-0.5 size-6 shrink-0 rounded-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                {dependency.href ? (
                  <CustomLink href={dependency.href} className="font-bold">
                    {dependency.name}
                  </CustomLink>
                ) : (
                  <span className="font-bold">{dependency.name}</span>
                )}
                {!dependency.reviewed && (
                  <span className="inline-block h-min rounded bg-zinc-200 px-1.5 py-[3px] font-medium text-2xs text-zinc-600 uppercase leading-none! dark:bg-zinc-700 dark:text-zinc-300">
                    Not reviewed
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-paragraph-15 md:text-paragraph-16">
                {dependency.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ProjectSection>
  )
}
