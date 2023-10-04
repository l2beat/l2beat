import { makeQuery } from './query'

type State = 'opened' | 'selected' | null

export function configureRichSelects() {
  document
    .querySelectorAll<HTMLElement>('.RichSelect')
    .forEach(configureRichSelect)
}

function configureRichSelect(richSelect: HTMLElement) {
  const { $, $$ } = makeQuery(richSelect)
  const dropdown = $('.RichSelect-Dropdown')
  const items = $$('.RichSelect-Item')
  const selectedText = $('.RichSelect-SelectedText')
  const toggle = $('.RichSelect-Toggle')

  function setState(state: State) {
    richSelect.dataset.state = state ?? ''
  }

  function setValue(value: string | undefined) {
    richSelect.dataset.value = value ?? ''
  }

  toggle.addEventListener('click', () => onToggleClick())
  items.forEach((item) => onItemClick(item))
  document.addEventListener('click', (e) => onOutsideClick(e))

  if (richSelect.dataset.centered) {
    centerSelect()
  }

  function onToggleClick() {
    if (richSelect.dataset.state === 'opened') {
      setState(null)
      return
    }

    if (richSelect.dataset.state === 'selected') {
      setState(null)
      setValue(undefined)
      richSelect.dispatchEvent(new Event('change'))
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
      richSelect.dispatchEvent(new Event('change'))
    })
  }

  function onOutsideClick(e: MouseEvent) {
    if (!richSelect.contains(e.target as Node)) {
      if (richSelect.dataset.state === 'opened') {
        setState(null)
      }
    }
  }

  function centerSelect() {
    const dropdownRect = dropdown.getBoundingClientRect()
    const togglerRect = toggle.getBoundingClientRect()

    const left = dropdownRect.width / 2 - togglerRect.width / 2

    dropdown.style.left = `-${left}px`
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
