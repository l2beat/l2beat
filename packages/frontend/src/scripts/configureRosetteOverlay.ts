export function configureRosetteOverlay() {
  const rosettes = Array.from(document.querySelectorAll('.Rosette'))

  for (const rosette of rosettes) {
    const texts = Array.from(
      rosette.querySelectorAll<HTMLElement>('.Rosette-Text'),
    )
    const slices = Array.from(
      rosette.querySelectorAll<HTMLElement>('.Rosette-Slice'),
    )
    const descriptions = Array.from(
      rosette.querySelectorAll<HTMLElement>('.Rosette-Description'),
    )

    function show(slice: HTMLElement) {
      const type = slice.dataset.rosette
      texts.forEach((text) => text.classList.add('hidden'))
      texts
        .find((text) => text.dataset.rosette === type)
        ?.classList.remove('hidden')
      slices.forEach((slice) => slice.classList.add('opacity-20'))
      slice.classList.remove('opacity-20')
      descriptions.forEach((description) => description.classList.add('hidden'))
      descriptions
        .find((description) => description.dataset.rosette === type)
        ?.classList.remove('hidden')
    }

    function hide() {
      texts.forEach((text) => text.classList.remove('hidden'))
      descriptions.forEach((description) => description.classList.add('hidden'))
      slices.forEach((slice) => slice.classList.remove('opacity-20'))
    }

    for (const slice of slices) {
      slice.addEventListener('mouseenter', () => {
        show(slice)
      })

      slice.addEventListener('mouseleave', () => {
        hide()
      })

      slice.addEventListener('focus', () => {
        show(slice)
      })

      slice.addEventListener('blur', () => {
        hide()
      })
    }
  }
}
