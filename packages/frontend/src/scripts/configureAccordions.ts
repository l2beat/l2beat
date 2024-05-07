import { makeQuery } from './query'

export function configureAccordions() {
  const { $$ } = makeQuery(document.body)

  const accordions = $$('[data-role=accordion]')
  accordions.forEach(configureAccordion)
}

function configureAccordion(accordion: HTMLElement) {
  const { $$ } = makeQuery(accordion)
  const type = accordion.getAttribute('data-type') ?? 'single'
  const items = $$('[data-role=accordion-item]')

  const closeAllItems = () => {
    items.forEach((item) => item.removeAttribute('data-open'))
  }
  const onOpen = type === 'single' ? closeAllItems : undefined

  items.forEach((item) => configureAccordionItem(item, onOpen))
}

function configureAccordionItem(
  item: HTMLElement,
  onOpen: (() => void) | undefined,
) {
  const { $ } = makeQuery(item)

  const trigger = $<HTMLInputElement>('[data-role=accordion-trigger]')

  const close = () => item.removeAttribute('data-open')

  const open = () => item.setAttribute('data-open', 'true')

  const isOpen = () => item.hasAttribute('data-open')

  trigger.addEventListener('click', () => {
    if (isOpen()) {
      close()
      return
    }

    onOpen?.()
    open()
  })
}
