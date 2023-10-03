import { makeQuery } from './query'

type State = 'opened' | 'selected' | null

export function configureRichSelects() {
  document
    .querySelectorAll<HTMLElement>('.RichSelect')
    .forEach(configureRichSelect)
}

function configureRichSelect(element: HTMLElement) {
  const { $, $$ } = makeQuery(element)
  const items = $$('.RichSelect-Item')
  const selectedText = $('.RichSelect-SelectedText')
  const toggle = $('.RichSelect-Toggle')

  function setState(state: State) {
    element.dataset.state = state ?? ''
  }

  function setValue(value: string | undefined) {
    element.dataset.value = value ?? ''
  }

  toggle.addEventListener('click', () => onToggleClick())
  items.forEach((item) => onItemClick(item))
  document.addEventListener('click', (e) => onOutsideClick(e))

  function onToggleClick() {
    if (element.dataset.state === 'opened') {
      setState(null)
      return
    }

    if (element.dataset.state === 'selected') {
      setState(null)
      setValue(undefined)
      element.dispatchEvent(new Event('change'))
      return
    }

    setState('opened')
  }

  function onItemClick(item: HTMLElement) {
    const selectedLabel = item.dataset.selectedLabel
    const value = item.dataset.value
    if (!selectedLabel || !value) {
      throw new Error('Missing data-selected-label')
    }
    item.addEventListener('click', () => {
      setState('selected')
      selectedText.innerText = selectedLabel
      setValue(value)
      element.dispatchEvent(new Event('change'))
    })
  }

  function onOutsideClick(e: MouseEvent) {
    if (!element.contains(e.target as Node)) {
      if (element.dataset.state === 'opened') {
        setState(null)
      }
    }
  }
}

export function clearRichSelect(element: HTMLElement) {
  element.dataset.value = ''
  element.dataset.state = ''
  element.dispatchEvent(new Event('change'))
}

export function getRichSelectValue(element: HTMLElement) {
  return element.dataset.value
}
