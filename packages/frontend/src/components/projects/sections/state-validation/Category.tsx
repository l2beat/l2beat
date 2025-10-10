import type { ProjectScalingStateValidation } from '@l2beat/config'
import { Markdown } from '~/components/markdown/Markdown'
import { SectionIncompleteNote } from '../contracts/SectionIncompleteNote'
import { ReferenceList } from '../ReferenceList'
import { RiskList } from '../RiskList'

type CategoryProps = {
  category: ProjectScalingStateValidation['categories'][number]
}

export function Category({ category }: CategoryProps) {
  const risks = category.risks?.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return (
    <div>
      <span className="font-bold text-lg md:text-xl">{category.title}</span>
      {category.isIncomplete && <SectionIncompleteNote />}
      <Markdown className="mt-2 text-paragraph-15 md:text-paragraph-16">
        {category.description}
      </Markdown>
      {risks && <RiskList risks={risks} />}
      {category.references && (
        <ReferenceList references={category.references} tight />
      )}
    </div>
  )
}
