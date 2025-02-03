import { InlinedNoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/no-bridge-grissini-details-placeholder'
import { SingleGrissiniDetails } from '~/components/rosette/grissini/single-grissini-details'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/get-da-project-entry'

interface Props {
  project: DaProjectPageEntry
}

export function SingleBridgeDetails({ project }: Props) {
  return (
    <div className="grid gap-y-2 max-md:mt-4 md:grid-cols-5 md:gap-x-3">
      <div className="text-xs text-secondary md:col-span-2">
        {project.name} risks
      </div>
      <div className="col-span-3 text-xs text-secondary max-md:hidden">
        DA Bridge risks
      </div>
      {project.header.daLayerGrissiniValues.map((value) => (
        <SingleGrissiniDetails key={value.name} {...value} />
      ))}
      <div className="mt-3 text-xs text-secondary md:hidden">
        DA Bridge risks
      </div>
      {project.selectedBridge.isNoBridge ? (
        <InlinedNoBridgeGrissiniDetailsPlaceholder className="md:col-span-3" />
      ) : (
        project.header.daBridgeGrissiniValues.map((value) => (
          <SingleGrissiniDetails key={value.name} {...value} />
        ))
      )}
    </div>
  )
}
