import { makeQuery } from './query'

export function configureCopyToClipboard() {
  const { $$ } = makeQuery(document.body)

  if (!document.querySelector('.CopyToClipboard')) {
    return
  }

  const copyToClipboards = $$('.CopyToClipboard')

  for (const copyButton of copyToClipboards) {
    copyButton.addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigator.clipboard.writeText(copyButton.dataset.valueToCopy ?? '')
    })
  }
}
