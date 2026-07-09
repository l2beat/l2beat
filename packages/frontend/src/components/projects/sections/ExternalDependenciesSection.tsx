import { CustomLink } from '~/components/link/CustomLink'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ExternalDependencyEntry {
  name: string
  description: string
  icon: string
  href: string
}

export interface ExternalDependenciesSectionProps extends ProjectSectionProps {
  dependencies: ExternalDependencyEntry[]
}

export function ExternalDependenciesSection({
  dependencies,
  ...sectionProps
}: ExternalDependenciesSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ul className="flex flex-col gap-4">
        {dependencies.map((dependency) => (
          <li key={dependency.href} className="flex items-start gap-3">
            <img
              src={dependency.icon}
              alt={`${dependency.name} logo`}
              className="mt-0.5 size-6 shrink-0 rounded-sm"
            />
            <div>
              <CustomLink href={dependency.href} className="font-bold">
                {dependency.name}
              </CustomLink>
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
