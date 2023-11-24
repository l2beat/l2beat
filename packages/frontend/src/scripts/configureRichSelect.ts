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
  const { $ } = makeQuery(slideCard)
  const content = $('.RichSelect-SlideCard-Content')
  const gestureZone = $('.RichSelect-SlideCard-GestureZone')
  const closeButton = $('.RichSelect-SlideCard-CloseButton')
  const background = $('.RichSelect-SlideCard-Background')
  let touchStartY = 0

  function onTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY
    background.classList.remove('transition-opacity')
  }

  function onTouchMove(e: TouchEvent) {
    const touchMoveY = e.touches[0].clientY
    const diff = touchMoveY - touchStartY

    const translateY = clamp(diff, 0, window.innerHeight)
    const opacity = 1 - translateY / content.clientHeight
    content.style.transform = `translateY(${translateY}px)`
    background.style.opacity = `${opacity}`
  }

  function onTouchEnd(e: TouchEvent) {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchEndY - touchStartY
    content.style.transform = ''
    background.style.opacity = ''
    if (diff > CLOSE_GESTURE_Y_DIFF) {
      setState(null)
    }
    background.classList.add('transition-opacity')
  }

  function close() {
    setState(null)
  }

  gestureZone.addEventListener('touchstart', onTouchStart)
  gestureZone.addEventListener('touchmove', onTouchMove)
  gestureZone.addEventListener('touchend', onTouchEnd)

  const closeElements = [background, closeButton]
  closeElements.forEach((slideCardClose) => {
    slideCardClose.addEventListener('click', close)
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
