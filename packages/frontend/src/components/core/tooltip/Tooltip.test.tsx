import { expect } from 'earl'
import {
  getTooltipTriggerDescription,
  renderOnServer,
} from '~/test/tooltipMarkup'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from './Tooltip'

describe(Tooltip.name, () => {
  it('renders nothing of the content by default', () => {
    const html = renderOnServer(
      <Tooltip>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    expect(html).not.toInclude('Why this is Stage 1')
    expect(html).not.toInclude('aria-describedby')
  })

  it('renders the content as a hidden description of the trigger', () => {
    const html = renderOnServer(
      <Tooltip hiddenDescription>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    const description = getTooltipTriggerDescription(html)
    expect(description.className.split(' ')).toInclude('sr-only')
    expect(description.text).toEqual('Why this is Stage 1')
  })

  it('leaves visual-only parts out of the hidden description', () => {
    const html = renderOnServer(
      <Tooltip hiddenDescription>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>
          Why this is Stage 1
          <TooltipVisualOnly>Click to view details</TooltipVisualOnly>
        </TooltipContent>
      </Tooltip>,
    )

    expect(getTooltipTriggerDescription(html).text).toEqual(
      'Why this is Stage 1',
    )
    expect(html).not.toInclude('Click to view details')
  })
})
