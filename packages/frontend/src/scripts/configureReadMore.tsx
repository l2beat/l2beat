import { makeQuery } from './query'

const { $$ } = makeQuery()

export function configureReadMore() {
  const readMoreComponents = $$('[data-role=read-more]')

  for (const component of readMoreComponents) {
    const { $ } = makeQuery(component)
    const toggle = $('[data-role=read-more-toggle]')

    toggle.addEventListener('click', () => {
      component.dataset.collapsed =
        component.dataset.collapsed === 'false' ? 'true' : 'false'
    })
  }
}
