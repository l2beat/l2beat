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
      // Unreviewed protocols have no page, and no risks to list.
      links: projects.flatMap(({ name, slug, display, liquidStaking }) => {
        const { risks } = liquidStaking
        if (!risks) return []
        return {
          name,
          path: `/defi/projects/${slug}` as const,
          description: withFacts(
            firstSentence(display?.description ?? ''),
            LIQUID_STAKING_RISKS.map(
              ({ key, title }) => `${title}: ${risks[key].value}`,
            ),
          ),
        }
      }),
    },
  ]
}
