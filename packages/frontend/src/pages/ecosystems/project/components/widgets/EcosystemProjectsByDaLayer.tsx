import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProgressBar } from '~/components/ProgressBar'
import type { BlobsData } from '~/server/features/ecosystems/getBlobsData'
import type { ProjectsByDaLayer } from '~/server/features/ecosystems/getProjectsByDaLayer'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

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
      <div className="grid gap-x-2.5 sm:grid-cols-2">
        <table className="h-min text-xs" cellPadding={0} cellSpacing={0}>
          <tbody>
            {Object.entries(projectsByDaLayer).map(
              ([daLayer, projectCount]) => (
                <tr key={daLayer} className="h-min">
                  <td className="pr-0.5 font-bold">{daLayer}</td>
                  <td className="whitespace-nowrap text-secondary max-sm:text-right">
                    {projectCount} projects
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        <div className="sm:-mt-2 relative mt-3 rounded bg-surface-secondary p-4">
          <div className="-translate-x-full absolute top-2.5 left-0 max-sm:hidden">
            <div className="size-0 border-y-8 border-y-transparent border-r-10 border-r-surface-secondary" />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-2xs text-secondary">
              Blobs posted
            </h3>
            <p className="font-bold text-sm">
              {formatBytes(blobsData.totalData)}
            </p>
          </div>
          <HorizontalSeparator className="my-2.5" />
          <ProgressBar
            progress={blobsData.blobsShare * 100}
            className="h-3 w-full"
            progressClassName="bg-branding-primary"
            trackClassName="border-branding-secondary"
          />
          <p className="mt-1 text-center text-2xs text-secondary">
            {formatPercent(blobsData.blobsShare)} of total blob size
          </p>
        </div>
      </div>
    </EcosystemWidget>
  )
}
