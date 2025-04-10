import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import ProgressBar from '~/components/progress-bar'
import type { BlobsData } from '~/server/features/ecosystems/get-blobs-data'
import type { ProjectsByDaLayer } from '~/server/features/ecosystems/get-projects-by-da-layer'
import { formatBytes } from '~/utils/number-format/format-bytes'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemProjectsByDaLayer({
  projectsByDaLayer,
  blobsData,
  className,
}: {
  projectsByDaLayer: ProjectsByDaLayer
  blobsData: BlobsData
  className?: string
}) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>DA Layers used</EcosystemWidgetTitle>
      <div className="grid grid-cols-2">
        <table className="h-min text-xs" cellPadding={0} cellSpacing={0}>
          <tbody>
            {Object.entries(projectsByDaLayer).map(
              ([daLayer, projectCount]) => (
                <tr key={daLayer} className="h-min">
                  <td className="pr-2 font-bold">{daLayer}</td>
                  <td className="text-secondary">{projectCount} projects</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        <div className="relative -mt-4 rounded bg-surface-secondary p-4">
          <div className="absolute left-0 top-[18px] -translate-x-full">
            <div className="size-0 border-y-8 border-r-[10px] border-y-transparent border-r-surface-secondary"></div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xs font-medium text-secondary">Total data</h3>
            <p className="text-sm font-bold">
              {formatBytes(blobsData.totalData.value)}
            </p>
          </div>
          <HorizontalSeparator className="my-2.5" />
          <ProgressBar
            progress={75}
            className="mt-2 h-3 w-full"
            progressClassName="bg-[--ecosystem-primary]"
            trackClassName="border-[--ecosystem-secondary]"
          />
          <p className="mt-1 text-2xs text-secondary">
            {blobsData.blobsShare}% of total blob size
          </p>
        </div>
      </div>
    </EcosystemWidget>
  )
}
