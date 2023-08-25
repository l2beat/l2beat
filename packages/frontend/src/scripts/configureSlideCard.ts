import { makeQuery } from './query'

export function configureSlideCards() {
  const { $$ } = makeQuery(document.body)

  const slideCards = $$('.SlideCard')

  if (slideCards.length === 0) {
    return
  }

  for (const slideCard of slideCards) {
    const { $ } = makeQuery(slideCard)
    const openButton = $('.SlideCard-Toggle[data-role="open"]')
    const closeButton = $('.SlideCard-Toggle[data-role="close"]')

    const content = $('.SlideCard-Content')

    openButton.addEventListener('click', () => {
      content.classList.remove('translate-y-full')
      document.body.classList.add('w-screen', 'overflow-hidden')
    })

    closeButton.addEventListener('click', () => {
      slideCard.dispatchEvent(new Event('close-slidecard'))
    })

    content.addEventListener('click', () => {
      slideCard.dispatchEvent(new Event('close-slidecard'))
    })

    slideCard.addEventListener('close-slidecard', () => {
      content.classList.add('translate-y-full')
      document.body.classList.remove('w-screen', 'overflow-hidden')
    })
  }
}
