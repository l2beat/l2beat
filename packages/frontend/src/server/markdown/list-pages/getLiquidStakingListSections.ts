import { LIQUID_STAKING_RISKS } from '~/pages/defi/liquid-staking/liquidStakingRisks'
import { getLiquidStakingProjects } from '~/server/features/defi/liquid-staking/getLiquidStakingProjects'
import {
  firstSentence,
  type LinkListSection,
  withFacts,
} from '../listPageMarkdown'

export async function getLiquidStakingListSections(): Promise<
  LinkListSection[]
> {
  const projects = await getLiquidStakingProjects()
  return [
    {
      heading: 'Liquid staking protocols (/defi/projects/{slug})',
      links: projects.map((p) => ({
        name: p.name,
        path: `/defi/projects/${p.slug}`,
        description: withFacts(
          firstSentence(p.display.description),
          LIQUID_STAKING_RISKS.map(
            ({ key, title }) => `${title}: ${p.liquidStaking.risks[key].value}`,
          ),
        ),
      })),
    },
  ]
}
