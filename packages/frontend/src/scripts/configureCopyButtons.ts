import { makeQuery } from './query'
import { copyStringToClipboard } from './utils/copyToClipboard'

export function configureCopyButtons() {
  const { $$ } = makeQuery()

  const copyButtonWrappers = $$('[data-role="copy-button-wrapper"]')
  copyButtonWrappers.forEach(configureCopyButton)
}

function configureCopyButton(wrapper: HTMLElement) {
  const { $ } = makeQuery(wrapper)

  const button = $('[data-role="copy-button"]')
  const toCopy = button.getAttribute('data-to-copy')
  if (!toCopy) throw new Error('data-to-copy attribute is required')

  button.addEventListener('click', () => {
    copyStringToClipboard(toCopy)

    wrapper.setAttribute('data-copied', 'true')
    setTimeout(() => wrapper.removeAttribute('data-copied'), 1000)
  })
}
