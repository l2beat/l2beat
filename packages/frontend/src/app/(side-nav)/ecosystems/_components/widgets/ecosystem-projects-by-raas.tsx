import Image from 'next/image'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemProjectsByRaas({
  projectsByRaas,
}: {
  projectsByRaas: Record<string, string[]>
}) {
  return (
    <EcosystemWidget>
      <EcosystemWidgetTitle>Rollup as a Service</EcosystemWidgetTitle>
      <div className="flex flex-col gap-2">
        {Object.entries(projectsByRaas).map(([raas, projectsSlugs]) => (
          <div key={raas} className="flex justify-between gap-2">
            <div className="whitespace-nowrap text-xs font-bold">{raas}</div>
            <div className="flex -space-x-2">
              {projectsSlugs.map((slug) => (
                <Image
                  key={slug}
                  src={`/icons/${slug}.png`}
                  alt={slug}
                  width={20}
                  height={20}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
