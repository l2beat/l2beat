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
    <div className="space-y-2 py-3">
      {techStack.zkVM && (
        <div>
          <span className="font-medium text-[11px] text-secondary leading-none">
            zkVM
          </span>
          <div className="flex flex-wrap gap-x-[5px] gap-y-1">
            {techStack.zkVM.map((zkVM, i) => (
              <TechStackTag key={`${zkVM.name}-${i}`} tag={zkVM} />
            ))}
          </div>
        </div>
      )}
      {techStack.finalWrap && (
        <div>
          <span className="font-medium text-[11px] text-secondary leading-none">
            Final wrap
          </span>
          <div className="flex flex-wrap gap-x-[5px] gap-y-1">
            {techStack.finalWrap.map((finalWrap, i) => (
              <TechStackTag key={`${finalWrap.name}-${i}`} tag={finalWrap} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
