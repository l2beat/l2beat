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
  const content = $<HTMLElement>(
    '[data-role=accordion-content]',
  )

  const close = () =>
    content.removeAttribute('data-open')

  const open = () =>
    content.setAttribute('data-open', 'true')

  trigger.addEventListener('change', () => {
    if (trigger.checked) open()
    else close()
  })

  document.addEventListener('click', (event) => {
    const isClickInsideAccordion = accordion.contains(event.target as Node)

    if (!isClickInsideAccordion && trigger.checked) {
      close()
      trigger.checked = false
    }
  })
}
