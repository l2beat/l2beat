import { makeQuery } from './query'

type State = 'opened' | 'selected' | null

export function configureSelects() {
  const { $$ } = makeQuery(document.body)

  const selects = $$<HTMLSelectElement>('.Select')

  selects.forEach(configureSelect)
}

function configureSelect(select: HTMLSelectElement) {
  const { toggle, options, selectedText } = getElements(select)

  const setState = (state: State) => {
    select.dataset.state = state ?? ''
  }

  toggle.addEventListener('click', () => {
    if (select.dataset.state === 'opened') {
      setState(null)
      return
    }

    if (select.dataset.state === 'selected') {
      setState(null)
      selectedText.innerText = ''
      select.value = ''
      select.dispatchEvent(new Event('change'))
      return
    }

    setState('opened')
  })

  options.forEach((option) =>
    option.addEventListener('click', () => {
      setState('selected')
      selectedText.innerText = option.innerText
      select.value = option.value
      select.dispatchEvent(new Event('change'))
    }),
  )
}

function getElements(select: HTMLSelectElement) {
  const { $, $$ } = makeQuery(select)
  const options = $$<HTMLOptionElement>('option')
  const selectedText = $('.Select-SelectedText')
  const toggle = $('.Select-Toggle')
  return {
    toggle,
    selectedText,
    options,
  }
}
