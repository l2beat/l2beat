import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { expect } from 'earl'
import {
  getTooltipTriggerDescription,
  renderOnServer,
} from '~/test/tooltipMarkup'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
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

  it('describes an open trigger once when the content is also in the HTML', () => {
    const html = renderOnServer(
      <Tooltip contentInHtml defaultOpen>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    expect(getTooltipTriggerDescription(html).text).toEqual(
      'Why this is Stage 1',
    )
  })

  it('follows a controlled open state when describing the trigger', () => {
    const html = renderOnServer(
      <Tooltip contentInHtml defaultOpen open={false}>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    expect(getTooltipTriggerDescription(html).text).toEqual(
      'Why this is Stage 1',
    )
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

  it('renders a controlled open tooltip', () => {
    const html = renderOnServer(
      <Tooltip open>
        <TooltipTrigger>Stage 1</TooltipTrigger>
        <TooltipContent>Why this is Stage 1</TooltipContent>
      </Tooltip>,
    )

    expect(getTooltipTriggerDescription(html).text).toEqual(
      'Why this is Stage 1',
    )
  })

  // Until a tooltip is first used it renders without Radix, and Radix takes
  // over in the browser. Comparing the server HTML to what Radix renders for
  // the same trigger shows the swap changes nothing on screen.
  describe('before first use', () => {
    it('renders the trigger as Radix does', () => {
      const html = renderOnServer(
        <Tooltip>
          <TooltipTrigger className="size-5">Stage 1</TooltipTrigger>
          <TooltipContent>Why this is Stage 1</TooltipContent>
        </Tooltip>,
      )

      expect(html).toEqual(
        renderOnServer(
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger
              data-role="tooltip-trigger"
              className="size-5"
            >
              Stage 1
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Content>
              Why this is Stage 1
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Root>,
        ),
      )
    })

    it('renders a trigger with asChild as Radix does', () => {
      const html = renderOnServer(
        <Tooltip>
          <TooltipTrigger asChild disabledOnTouch>
            <a href="/scaling/projects/arbitrum" className="size-5">
              Arbitrum
            </a>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>Arbitrum One</TooltipContent>
          </TooltipPortal>
        </Tooltip>,
      )

      expect(html).toEqual(
        renderOnServer(
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <a href="/scaling/projects/arbitrum" className="size-5">
                Arbitrum
              </a>
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content>Arbitrum One</TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </TooltipPrimitive.Root>,
        ),
      )
    })
  })
})
