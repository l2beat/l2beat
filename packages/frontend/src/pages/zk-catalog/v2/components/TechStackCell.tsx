import type { ProjectZkCatalogInfo } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { TechStackTag } from './TechStackTag'

export function TechStackCell({
  techStack,
}: {
  techStack: ProjectZkCatalogInfo['techStack']
}) {
  if (!techStack.zkVM && !techStack.finalWrap) {
    return <NoDataBadge />
  }

  return (
    <div className="space-y-2 py-4">
      {techStack.zkVM && (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[11px] text-secondary leading-none">
            zkVM
          </span>
          <div className="flex flex-nowrap gap-x-[5px] gap-y-1 overflow-x-auto md:max-h-[50px] md:min-w-[250px] md:flex-wrap">
            {techStack.zkVM.map((zkVM, i) => (
              <TechStackTag key={`${zkVM.name}-${i}`} tag={zkVM} />
            ))}
          </div>
        </div>
      )}
      {techStack.snark && (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[11px] text-secondary leading-none">
            SNARK
          </span>
          <div className="flex flex-nowrap gap-x-[5px] gap-y-1 overflow-x-auto md:max-h-[50px] md:min-w-[250px] md:flex-wrap">
            {techStack.snark.map((snark, i) => (
              <TechStackTag key={`${snark.name}-${i}`} tag={snark} />
            ))}
          </div>
        </div>
      )}
      {techStack.finalWrap && (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[11px] text-secondary leading-none">
            Final wrap
          </span>
          <div className="flex flex-nowrap gap-x-[5px] gap-y-1 overflow-x-auto md:max-h-[50px] md:min-w-[250px] md:flex-wrap">
            {techStack.finalWrap.map((finalWrap, i) => (
              <TechStackTag key={`${finalWrap.name}-${i}`} tag={finalWrap} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
