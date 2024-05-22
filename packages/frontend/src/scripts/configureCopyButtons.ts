import { setActiveTooltipContent } from './configureTooltips'
import { makeQuery } from './query'
import { copyStringToClipboard } from './utils/copyToClipboard'

export function configureCopyButtons() {
  const { $$ } = makeQuery()

  const copyButtons = $$('[data-role="copy-button"]')
  copyButtons.forEach(configureCopyButton)
}

function configureCopyButton(button: HTMLElement) {
  const toCopy = button.getAttribute('data-to-copy')
  if (!toCopy) throw new Error('data-to-copy attribute is required')

  button.addEventListener('click', () => {
    copyStringToClipboard(toCopy)

    button.setAttribute('data-copied', 'true')
    setActiveTooltipContent('Copied!')
    setTimeout(() => button.removeAttribute('data-copied'), 1000)
  })
}
