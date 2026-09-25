import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { type ProjectCellProject, ProjectNameCell } from './ProjectNameCell'

// Status icons next to a project name explain themselves only in hover
// tooltips, which are not server-rendered, and the red and yellow shields
// differ only by colour. We render the cell to static markup and check each
// icon carries its meaning as a label.
const PROJECT: ProjectCellProject = {
  icon: '/icon.png',
  name: 'Example',
  slug: 'example',
  backgroundColor: undefined,
  isLayer3: true,
  ecosystemInfo: { id: ProjectId('superchain'), isPartOfSuperchain: true },
  quantumResistance: 'prover',
  statuses: {
    redWarning: { text: 'Funds can be stolen' },
    yellowWarning: 'Some concern',
    verificationWarnings: {
      contracts: 'Unverified contracts',
      programHashes: undefined,
      programHashesDescription: undefined,
    },
    underReview: 'config',
    syncWarning: 'Data is stale',
    ongoingAnomaly: true,
  },
}

describe(ProjectNameCell.name, () => {
  it('labels every status icon with its meaning', () => {
    const html = renderToStaticMarkup(
      createElement(
        TooltipProvider,
        undefined,
        createElement(ProjectNameCell, { project: PROJECT }),
      ),
    )

    for (const label of [
      'Layer 3',
      'Part of the Superchain',
      'Plausibly quantum resistant',
      'Unverified code',
      'Critical warning',
      'Warning',
      'Under review',
      'Data not synced',
      'Ongoing anomaly',
    ]) {
      // Desktop and mobile variants are both server-rendered.
      expect(countOccurrences(html, `aria-label="${label}"`)).toEqual(2)
    }
  })
})

function countOccurrences(text: string, search: string): number {
  return text.split(search).length - 1
}
