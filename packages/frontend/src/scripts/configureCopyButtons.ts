import { makeQuery } from './query'

export function configureCopyButtons() {
  const { $$ } = makeQuery()

  const copyButtons = $$('[data-role="copy-button"]')
  copyButtons.forEach(configureCopyButton)
}

function configureCopyButton(button: HTMLElement) {
  const toCopy = button.getAttribute('data-to-copy')
  if (!toCopy) throw new Error('data-to-copy attribute is required')
  console.log(button)
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(toCopy).catch(() => {})

    button.setAttribute('data-copied', 'true')
    setTimeout(() => button.removeAttribute('data-copied'), 1000)
  })
}
