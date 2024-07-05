import { ProjectHeader } from '~/app/_components/projects/project-header'
import { DaBridgeSelect } from './da-bridge-select'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { DesktopProjectLinks } from '~/app/_components/projects/links/desktop-project-links'
import { DaHeaderDetails } from './da-header-details'
import { BigRosette } from '~/app/_components/rosette/big-rosette/big-rosette'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { ReadMore } from '~/app/_components/read-more'

interface Props {
  project: DaProjectEntry
}

export function DaHeader({ project }: Props) {
  return (
    <header>
      <div className="flex gap-10">
        <div className="w-full space-y-4">
          <div>
            <ProjectHeader
              title={project.name}
              src={`/icons/${project.slug}.png`}
            />
            <DaBridgeSelect project={project} />
          </div>
          <HorizontalSeparator className="!my-6" />
          <DesktopProjectLinks projectLinks={project.links} />
          <DaHeaderDetails project={project} />
        </div>
        <BigRosette className="max-lg:hidden mt-auto" values={project.risks} />
      </div>
      <HorizontalSeparator className="my-6" />
      {project.description ? (
        <div className="flex flex-1 flex-col gap-2 text-base lg:min-w-[400px]">
          <h2 className="font-medium text-gray-600 text-xs uppercase">About</h2>
          <p>
            <ReadMore onlyOnMobile>{project.description}</ReadMore>
          </p>
        </div>
      ) : null}
    </header>
  )
}
