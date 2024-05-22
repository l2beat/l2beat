import { makeQuery } from './query'

export function configureMultipleEscrowsButton() {
  const { $, $$ } = makeQuery()
  const multipleEscrowsButtons = $$('[data-role=multiple-escrows]')

  multipleEscrowsButtons.forEach((button) => {
    const token = button.dataset.token ?? ''
    const hiddenForToken = $$(
      `[data-role=multiple-escrows-hidden][data-token="${token}"]`,
    )
    const btnArrow = $(
      `[data-role=multiple-escrows-arrow][data-token="${token}"]`,
    )
    const row = $(`[data-role=multiple-escrows-row][data-token="${token}"]`)

    function toggle(classes: string[]) {
      classes.forEach((cls) => {
        row.classList.toggle(cls)
      })
    }

    button.addEventListener('click', () => {
      hiddenForToken.forEach((el) => {
        el.classList.toggle('hidden')
        el.classList.toggle('flex')
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
