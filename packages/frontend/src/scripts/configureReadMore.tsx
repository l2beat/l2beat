import { makeQuery } from './query'

const { $$ } = makeQuery()

export function configureReadMore() {
  const readMoreComponents = $$('[data-role=read-more]')

  for (const component of readMoreComponents) {
    const { $$ } = makeQuery(component)
    const toggles = $$('[data-role=read-more-toggle]')

    for (const toggle of toggles) {
      toggle.addEventListener('click', () => {
        component.dataset.collapsed =
          component.dataset.collapsed === 'false' ? 'true' : 'false'
      })
    }
  }
}
