export function configureRosetteOverlay() {
  const rosette = document.querySelector('.Rosette')

  if (!rosette) return

  const texts = Array.from(rosette.querySelectorAll('.Rosette-Text'))
  const slices = Array.from(rosette.querySelectorAll('.Rosette-Slice'))
  const descriptions = Array.from(
    rosette.querySelectorAll('.Rosette-Description'),
  )
  const circle = rosette.querySelector('.Rosette-Circle')

  if (!circle) return

  circle.addEventListener('mouseout', () => {
    texts.forEach((text) => text.classList.remove('hidden'))
    descriptions.forEach((description) => description.classList.add('hidden'))
    slices.forEach((slice) => slice.classList.remove('opacity-20'))
  })

  for (const slice of slices) {
    slice.addEventListener('mouseover', () => {
      const type = (slice as HTMLElement).dataset.rosette
      texts.forEach((text) => text.classList.add('hidden'))
      texts
        .find((text) => (text as HTMLElement).dataset.rosette === type)
        ?.classList.remove('hidden')
      slices.forEach((slice) => slice.classList.add('opacity-20'))
      slice.classList.remove('opacity-20')
      descriptions
        .find(
          (description) =>
            (description as HTMLElement).dataset.rosette === type,
        )
        ?.classList.remove('hidden')
    })
  }
}
