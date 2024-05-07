import { makeQuery } from './query'

export function configureAccordions() {
  const { $$ } = makeQuery(document.body)

  const accordions = $$('[data-role=accordion]')
  accordions.forEach(configureAccordion)
}

function configureAccordion(accordion: HTMLElement){
  const {$} = makeQuery(accordion)

  const trigger = $<HTMLInputElement>(
    '[data-role=accordion-trigger]',
  )

  const close = () =>
    accordion.removeAttribute('data-open')

  const open = () =>
    accordion.setAttribute('data-open', 'true')

  const isOpen = () => accordion.hasAttribute('data-open')

  trigger.addEventListener('click', () => {
    if (isOpen()) close()
    else open()
  })

  document.addEventListener('click', (event) => {
    const isClickInsideAccordion = accordion.contains(event.target as Node)

    if (!isClickInsideAccordion && isOpen()) {
      close()
      trigger.checked = false
    }
  })
}
