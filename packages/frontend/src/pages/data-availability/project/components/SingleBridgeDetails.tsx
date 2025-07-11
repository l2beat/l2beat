import { RiskBanner } from '~/components/projects/RiskBanner'
import { NoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/NoBridgeGrissiniDetailsPlaceholder'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'

interface Props {
  project: DaProjectPageEntry
}

export function SingleBridgeDetails({ project }: Props) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-x-4 gap-y-2 max-lg:hidden">
        <div className="text-secondary text-xs md:col-span-2">
          {project.name} risks
        </div>
        <div className="col-span-3 text-secondary text-xs">DA Bridge risks</div>
        {project.header.daLayerGrissiniValues.map((value) => (
          <RiskBanner
            key={value.name}
            {...value}
            descriptionAsTooltip
            info="compact"
          />
        ))}
        {project.selectedBridge.isNoBridge ? (
          <NoBridgeGrissiniDetailsPlaceholder className="md:col-span-3" />
        ) : (
          project.header.daBridgeGrissiniValues.map((value) => (
            <RiskBanner
              key={value.name}
              {...value}
              descriptionAsTooltip
              info="compact"
            />
          ))
        )}
      </div>
      <div className="space-y-4 lg:hidden">
        <div className="space-y-2">
          <div className="text-secondary text-xs">{project.name} risks</div>
          <div className="grid gap-2 md:grid-cols-2">
            {project.header.daLayerGrissiniValues.map((value) => (
              <RiskBanner
                key={value.name}
                {...value}
                descriptionAsTooltip
                info="compact"
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-secondary text-xs">DA Bridge risks</div>
          <div className="grid gap-2 md:grid-cols-3">
            {project.selectedBridge.isNoBridge ? (
              <NoBridgeGrissiniDetailsPlaceholder className="md:col-span-3" />
            ) : (
              project.header.daBridgeGrissiniValues.map((value) => (
                <RiskBanner
                  key={value.name}
                  {...value}
                  descriptionAsTooltip
                  info="compact"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
