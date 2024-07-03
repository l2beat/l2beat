import { makeQuery } from './query'

const { $$ } = makeQuery()

export function configureReadMore() {
  const readMoreComponents = $$('[data-role=read-more]')

  for (const component of readMoreComponents) {
    const { $ } = makeQuery(component)
    const collapsible = $('[data-role=read-more-collapsible]')
    const indicator = $('[data-role=read-more-indicator]')
    const toggle = $('[data-role=read-more-toggle]')

    component.addEventListener('click', () => {
      collapsible.style.display = 'inline'
      indicator.style.display = 'none'
      toggle.style.display = 'none'
    })
  }
}
