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

  // An open tooltip is the only state Radix renders on the server, so it is
  // how these tests observe what Radix does on hover.
  it('keeps Radix describing the trigger with the open content', () => {
    const html = renderOnServer(
      <Tooltip defaultOpen>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    const description = getTooltipTriggerDescription(html)
    expect(description.text).toEqual('Why this is Stage 1')
  })

  it('keeps the content in the HTML as a description of the trigger', () => {
    const html = renderOnServer(
      <Tooltip contentInHtml>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    const description = getTooltipTriggerDescription(html)
    expect(description.className.split(' ')).toInclude('sr-only')
    expect(description.text).toEqual('Why this is Stage 1')
  })

  it('leaves visual-only parts out of the HTML copy', () => {
    const html = renderOnServer(
      <Tooltip contentInHtml>
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
