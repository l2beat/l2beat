import { makeQuery } from './query'

export function configureAddresses() {
  const { $$ } = makeQuery(document.body)
  if (!document.querySelector('.Tooltip-Popup')) {
    return
  }

  const elements = $$('.Address')

  elements.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      const address = element.getAttribute('data-address')
      if (!address) {
        return
      }
      changeBackgroundColor(address)
    })

    element.addEventListener('mouseleave', function () {
      const address = element.getAttribute('data-address')
      if (!address) {
        return
      }
      changeBackgroundColor(address)
    })
  })
}

function changeBackgroundColor(address: string) {
  const { $$ } = makeQuery(document.body)
  $$(`.Address[data-address="${address}"]`).forEach((element) => {
    element.classList.toggle('bg-yellow-250')
  })
}
