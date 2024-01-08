import { makeQuery } from './query'

export function configureEtherscanLinks() {
  const { $$ } = makeQuery(document.body)
  const etherscanLinks = $$<HTMLAnchorElement>('[data-role=etherscan-link]')

  etherscanLinks.forEach((etherscanLink) => {
    etherscanLink.addEventListener('mouseenter', () =>
      toggleHighlight(etherscanLink.href),
    )

    etherscanLink.addEventListener('mouseleave', () =>
      toggleHighlight(etherscanLink.href),
    )
  })

  function toggleState(element: HTMLAnchorElement) {
    const state = element.getAttribute('data-state')

    if (!state) {
      element.setAttribute('data-state', 'highlighted')
      return
    }

    element.removeAttribute('data-state')
  }

  function toggleHighlight(href: string) {
    const url = new URL(href)

    etherscanLinks.forEach((etherscanLink) => {
      const comparisonUrl = new URL(etherscanLink.href)
      if (url.pathname === comparisonUrl.pathname) {
        toggleState(etherscanLink)
      }
    })
  }
}
