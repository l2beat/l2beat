import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { TrustedSetupsByProofSystemSection } from './ZkCatalogProjectSummary'

describe(TrustedSetupsByProofSystemSection.name, () => {
  it('says when a proof system is not used by any listed project', () => {
    const html = renderToStaticMarkup(
      <TooltipProvider>
        <TrustedSetupsByProofSystemSection
          trustedSetupsByProofSystem={{
            used: trustedSetupGroup([
              {
                id: ProjectId('used'),
                name: 'Used Project',
                slug: 'used',
                icon: '/icon.png',
                url: '/used',
              },
            ]),
            unused: trustedSetupGroup([]),
          }}
        />
      </TooltipProvider>,
    )

    // Every proof system gets a "Used in" label, so an unused one doesn't
    // read as sharing the projects listed for the other.
    const usedInLabels = countOf(html, '>Used in<')
    const notUsed = countOf(html, 'Not used by any listed project')
    expect(notUsed > 0).toEqual(true)
    expect(usedInLabels).toEqual(2 * notUsed)
  })
})

function trustedSetupGroup(
  projectsUsedIn: UsedInProjectWithIcon[],
): TrustedSetupsByProofSystem[string] {
  return {
    trustedSetups: [
      {
        id: 'setup',
        name: 'Setup',
        risk: 'yellow',
        shortDescription: 'A setup.',
        proofSystem: {
          id: 'groth16',
          type: 'Groth16',
          name: 'Groth16',
          description: 'Groth16',
        },
      },
    ],
    verifiers: {},
    projectsUsedIn,
    projectsUsedInByStatus: {},
  }
}

function countOf(haystack: string, needle: string) {
  return haystack.split(needle).length - 1
}
