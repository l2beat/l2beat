import { makeQuery } from './query'

export function configureMultipleEscrowsButton() {
  const { $, $$ } = makeQuery(document.body)
  const multipleEscrowsButtons = $$('.MultipleEscrows')

  multipleEscrowsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const token = button.dataset.token ?? ''
      const hiddenForToken = $$(`.MultipleEscrowsHidden[data-token="${token}"]`)
      const btnArrow = $(`.MultipleEscrowsArrow[data-token="${token}"]`)

      hiddenForToken.forEach((el) => {
        el.classList.toggle('hidden')
      })
      btnArrow.classList.toggle('rotate-180')
      //   button.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.classList.toggle(
      //     'bg-pink-100',
      //   )
    })
  })
}
