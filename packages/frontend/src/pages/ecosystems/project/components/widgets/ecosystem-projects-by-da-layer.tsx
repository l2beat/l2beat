import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import ProgressBar from '~/components/progress-bar'
import type { BlobsData } from '~/server/features/ecosystems/get-blobs-data'
import type { ProjectsByDaLayer } from '~/server/features/ecosystems/get-projects-by-da-layer'
import { formatPercent } from '~/utils/calculate-percentage-change'
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
      <div className="grid sm:grid-cols-2">
        <table className="h-min text-xs" cellPadding={0} cellSpacing={0}>
          <tbody>
            {Object.entries(projectsByDaLayer).map(
              ([daLayer, projectCount]) => (
                <tr key={daLayer} className="h-min">
                  <td className="font-bold">{daLayer}</td>
                  <td className="text-secondary max-sm:text-right">
                    {projectCount} projects
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        <div className="relative mt-3 rounded bg-surface-secondary p-4 sm:-mt-2">
          <div className="absolute left-0 top-2.5 -translate-x-full max-sm:hidden">
            <div className="size-0 border-y-8 border-r-[10px] border-y-transparent border-r-surface-secondary"></div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xs font-medium text-secondary">
              Blobs posted
            </h3>
            <p className="text-sm font-bold">
              {formatBytes(blobsData.totalData)}
            </p>
          </div>
          <HorizontalSeparator className="my-2.5" />
          <ProgressBar
            progress={blobsData.blobsShare * 100}
            className="h-3 w-full"
            progressClassName="bg-[--ecosystem-primary]"
            trackClassName="border-[--ecosystem-secondary]"
          />
          <p className="mt-1 text-center text-2xs text-secondary">
            {formatPercent(blobsData.blobsShare)} of total blob size
          </p>
        </div>
      </div>
    </EcosystemWidget>
  )
}
