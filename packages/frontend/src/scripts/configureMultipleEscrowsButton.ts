import { makeQuery } from './query'

export function configureMultipleEscrowsButton() {
  const { $, $$ } = makeQuery(document.body)
  const multipleEscrowsButtons = $$('.MultipleEscrows')

  multipleEscrowsButtons.forEach((button) => {
    const token = button.dataset.token ?? ''
    const hiddenForToken = $$(`.MultipleEscrowsHidden[data-token="${token}"]`)
    const btnArrow = $(`.MultipleEscrowsArrow[data-token="${token}"]`)
    const row = $(`.MultipleEscrowsRow[data-token="${token}"]`)

    function toggle(classes: string[]) {
      classes.forEach((cls) => {
        row.classList.toggle(cls)
      })
    }

    button.addEventListener('click', () => {
      hiddenForToken.forEach((el) => {
        el.classList.toggle('hidden')
      })
      btnArrow.classList.toggle('rotate-180')
      toggle([
        'bg-[#CB980029]/20',
        'hover:bg-black/[0.1]',
        'dark:hover:bg-white/[0.1]',
      ])
    })
  })
}
