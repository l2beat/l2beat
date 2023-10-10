import clamp from 'lodash/clamp'

import { makeQuery } from './query'
import { isMobile } from './utils/isMobile'

const CLOSE_GESTURE_Y_DIFF = 150

type State = 'opened' | 'selected' | null

export function configureRichSelects() {
  document
    .querySelectorAll<HTMLElement>('.RichSelect')
    .forEach(configureRichSelect)
}

function configureRichSelect(richSelect: HTMLElement) {
  const { $, $$ } = makeQuery(richSelect)
  const dropdown = $('.RichSelect-Dropdown')
  const slideCard = $('.RichSelect-SlideCard')
  const items = $$('.RichSelect-Item')
  const selectedText = $('.RichSelect-SelectedText')
  const toggle = $('.RichSelect-Toggle')

  function setState(state: State) {
    if (isMobile()) {
      const classList = ['w-screen', 'overflow-hidden', 'touch-none']
      if (state === 'opened') {
        document.body.classList.add(...classList)
      } else {
        document.body.classList.remove(...classList)
      }
    }

    richSelect.dataset.state = state ?? ''
  }

  function setValue(value: string | undefined) {
    richSelect.dataset.value = value ?? ''
  }

  toggle.addEventListener('click', () => onToggleClick())
  items.forEach((item) => onItemClick(item))
  document.addEventListener('click', (e) => onOutsideClick(e))
  configureSlideCard(slideCard, setState)

  if (richSelect.dataset.centered) {
    centerSelect()
    window.addEventListener('resize', () => centerSelect())
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

    const left = clamp(
      togglerRect.left + togglerRect.width / 2 - dropdownRect.width / 2,
      32,
      window.innerWidth - 32 - dropdownRect.width,
    )

    dropdown.style.left = `${left}px`
  }
}

function configureSlideCard(
  slideCard: HTMLElement,
  setState: (state: State) => void,
) {
  const { $, $$ } = makeQuery(slideCard)
  const slideCardContent = $('.RichSelect-SlideCard-Content')
  const slideCardGestureZone = $('.RichSelect-SlideCard-GestureZone')
  const slideCardCloses = $$('.RichSelect-SlideCard-Close')

  let touchStartY = 0

  slideCardGestureZone.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
  })

  slideCardGestureZone.addEventListener('touchmove', (e) => {
    const touchMoveY = e.touches[0].clientY
    const diff = touchMoveY - touchStartY
    if (diff < 0) {
      return
    }
    slideCardContent.style.transform = `translateY(${
      touchMoveY - touchStartY
    }px)`
  })

  slideCardGestureZone.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchEndY - touchStartY
    slideCardContent.style.transform = ''
    if (diff > CLOSE_GESTURE_Y_DIFF) {
      setState(null)
    }
  })

  slideCardCloses.forEach((slideCardClose) => {
    slideCardClose.addEventListener('click', () => setState(null))
  })
}

export function clearRichSelect(element: HTMLElement) {
  element.dataset.value = ''
  element.dataset.state = ''
  element.dispatchEvent(new Event('change'))
}

export function getRichSelectValue(element: HTMLElement) {
  return element.dataset.value
}
