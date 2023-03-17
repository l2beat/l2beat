export function configureRosetteOverlay() {
  const rosettes = Array.from(document.querySelectorAll('.Rosette'))

  for (const rosette of rosettes) {
    const texts = Array.from(rosette.querySelectorAll('.Rosette-Text'))
    const slices = Array.from(rosette.querySelectorAll('.Rosette-Slice'))
    const descriptions = Array.from(
      rosette.querySelectorAll('.Rosette-Description'),
    )
    const circle = rosette.querySelector('.Rosette-Circle')

    if (!circle) return

    function show(slice: HTMLElement) {
      const type = slice.dataset.rosette
      texts.forEach((text) => text.classList.add('hidden'))
      texts
        .find((text) => (text as HTMLElement).dataset.rosette === type)
        ?.classList.remove('hidden')
      slices.forEach((slice) => slice.classList.add('opacity-20'))
      slice.classList.remove('opacity-20')
      descriptions.forEach((description) => description.classList.add('hidden'))
      descriptions
        .find(
          (description) =>
            (description as HTMLElement).dataset.rosette === type,
        )
        ?.classList.remove('hidden')
    }

    function hide() {
      texts.forEach((text) => text.classList.remove('hidden'))
      descriptions.forEach((description) => description.classList.add('hidden'))
      slices.forEach((slice) => slice.classList.remove('opacity-20'))
    }

    circle.addEventListener('mouseleave', () => {
      hide()
    })

    for (const slice of slices) {
      slice.addEventListener('mouseenter', () => {
        show(slice as HTMLElement)
      })

      slice.addEventListener('focus', () => {
        show(slice as HTMLElement)
      })

      slice.addEventListener('blur', () => {
        hide()
      })
    }
  }
}
