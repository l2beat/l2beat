import { makeQuery } from './query'

export function configureAddresses() {
  const { $$ } = makeQuery(document.body)
  const elements = $$('.Address')

  elements.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      const address = element.getAttribute('data-address')
      if (!address) {
        return
      }
      toggleBgColor(address)
    })

    element.addEventListener('mouseleave', function () {
      const address = element.getAttribute('data-address')
      if (!address) {
        return
      }
      toggleBgColor(address)
    })
  })
}

function toggleBgColor(address: string) {
  const { $$ } = makeQuery(document.body)
  $$(`.Address[data-address="${address}"]`).forEach((element) => {
    element.classList.toggle('bg-yellow-250')
  })
}
