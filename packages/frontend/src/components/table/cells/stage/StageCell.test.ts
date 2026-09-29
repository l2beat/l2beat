import type { StageConfigured } from '@l2beat/config'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { StageCell } from './StageCell'

// The stage cell's extra icons explain themselves only in a hover tooltip,
// which is not server-rendered. We render the cell to static markup and check
// that each icon carries its meaning as an accessible label instead.
const STAGE_ONE: StageConfigured = {
  stage: 'Stage 1',
  downgradePending: undefined,
  message: undefined,
  summary: [],
}

describe(StageCell.name, () => {
  it('labels the pending downgrade stopwatch with the target stage', () => {
    const html = renderCell({
      stageConfig: {
        ...STAGE_ONE,
        downgradePending: { expiresAt: 0, reasons: [], toStage: 'Stage 0' },
      },
    })

    expect(html).toInclude('aria-label="Downgrade to Stage 0 pending"')
  })

  it('labels the emergency icon with the warning', () => {
    const html = renderCell({
      stageConfig: STAGE_ONE,
      emergencyWarning: 'Security Council can upgrade instantly',
    })

    expect(html).toInclude(
      'aria-label="Emergency warning: Security Council can upgrade instantly"',
    )
  })

  it('labels a passed walkaway test', () => {
    const html = renderCell({ stageConfig: STAGE_ONE, walkAway: 'passed' })

    expect(html).toInclude('aria-label="Passes the walkaway test"')
  })

  it('labels a failed walkaway test', () => {
    const html = renderCell({ stageConfig: STAGE_ONE, walkAway: 'not-passed' })

    expect(html).toInclude('aria-label="Does not pass the walkaway test"')
  })
})

function renderCell(
  props: Omit<Parameters<typeof StageCell>[0], 'isAppchain'>,
): string {
  return renderToStaticMarkup(
    createElement(
      TooltipProvider,
      undefined,
      createElement(StageCell, { isAppchain: false, ...props }),
    ),
  )
}
