import { CustomLink } from '~/components/link/CustomLink'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ExternalDependencyEntry {
  name: string
  description: string
  icon: string
  /** Link to the dependency's L2BEAT page; absent when the dependency is not reviewed. */
  href?: string
  /** Whether L2BEAT reviews this dependency. Not-reviewed ones show a tag and no link. */
  reviewed: boolean
  /** Number of permissions this reviewed dependency introduces; tag hidden when 0/undefined. */
  additionalPermissionsCount?: number
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
          <li key={dependency.name} className="flex items-start gap-3">
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
                {!!dependency.additionalPermissionsCount && (
                  <CustomLink
                    href="#permissions"
                    variant="primary"
                    underline={false}
                    className="inline-flex h-min items-center gap-1 rounded bg-blue-500/10 px-1.5 py-[3px] font-medium text-2xs leading-none!"
                  >
                    Introduces {dependency.additionalPermissionsCount}{' '}
                    additional permission
                    {dependency.additionalPermissionsCount === 1 ? '' : 's'}
                    <ArrowRightIcon className="size-3 fill-current" />
                  </CustomLink>
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
