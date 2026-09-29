import type { ProjectScalingStage } from '@l2beat/config'
import { expect } from 'earl'
import {
  getTooltipTriggerDescription,
  renderOnServer,
} from '~/test/tooltipMarkup'
import { StageCell } from './StageCell'

describe(StageCell.name, () => {
  it('explains the stage in the server-rendered HTML', () => {
    const stageConfig: ProjectScalingStage = {
      stage: 'Stage 1',
      missing: {
        nextStage: 'Stage 2',
        principle: undefined,
        requirements: ['Fraud proof system is permissionless'],
      },
      summary: [],
      downgradePending: undefined,
      message: undefined,
    }

    const html = renderOnServer(
      <StageCell stageConfig={stageConfig} isAppchain={false} />,
    )

    const description = getTooltipTriggerDescription(html).text
    expect(description).toInclude('Limited training wheels')
    expect(description).toInclude('Items missing for Stage 2')
    expect(description).toInclude('Fraud proof system is permissionless')
    expect(description).not.toInclude('Click to view details')
  })
})
