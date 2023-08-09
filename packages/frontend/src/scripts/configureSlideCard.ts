import { makeQuery } from './query'

export function configureSlideCards() {
  const { $$ } = makeQuery(document.body)

  const slideCards = $$('.SlideCard')

  if (slideCards.length === 0) {
    return
  }

  for (const slideCard of slideCards) {
    const { $ } = makeQuery(slideCard)
    const closeButton = $('.SlideCard-Toggle[data-role="close"]')
    const openButton = $('.SlideCard-Toggle[data-role="open"]')

    const content = $('.SlideCard-Content')

    closeButton.addEventListener('click', () => {
      content.classList.add('translate-y-full')
    })

    openButton.addEventListener('click', () => {
      content.classList.remove('translate-y-full')
    })
  }
}
