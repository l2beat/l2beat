import { makeQuery } from './query'

export function configureMultipleEscrowsButton() {
  const { $$ } = makeQuery(document.body)
  const multipleEscrowsButtons = $$('.MultipleEscrows')
  const multipleEscrowsHidden = $$('.MultipleEscrowsHidden')

  multipleEscrowsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const token = button.dataset.token
      const hiddenForToken = multipleEscrowsHidden.filter(
        (el) => el.dataset.token === token,
      )
      hiddenForToken.forEach((el) => {
        el.classList.toggle('hidden')
      })
    })
  })
}
