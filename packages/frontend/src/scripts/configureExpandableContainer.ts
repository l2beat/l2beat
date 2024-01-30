export function configureExpandableContainer() {
  const expandableContainers = document.querySelectorAll<HTMLElement>(
    '[data-role=expandable-container]',
  )

  expandableContainers.forEach((container) => {
    const expandableContainerContent = container.querySelector<HTMLElement>(
      '[data-role=expandable-container-content]',
    )
    const expandableContainerContentGradient =
      container.querySelector<HTMLElement>(
        '[data-role=expandable-container-content-gradient]',
      )
    const expandableContainerButton = container.querySelector<HTMLElement>(
      '[data-role=expandable-container-button]',
    )
    const expandableContainerButtonText =
      expandableContainerButton?.querySelector<HTMLElement>(
        '[data-role=expandable-container-button-text]',
      )
    const expandableContainerButtonArrow =
      expandableContainerButton?.querySelector<HTMLElement>(
        '[data-role=expandable-container-button-arrow]',
      )

    if (
      !expandableContainerContent ||
      !expandableContainerContentGradient ||
      !expandableContainerButton ||
      !expandableContainerButtonArrow ||
      !expandableContainerButtonText
    ) {
      return
    }

    const maxHeightClassName = Array.from(
      expandableContainerContent.classList,
    ).filter((className) => className.startsWith('max-h-'))[0]
    const maxHeightValue = Number(maxHeightClassName.replace('max-h-', ''))

    if (expandableContainerContent.scrollHeight <= maxHeightValue * 4) {
      expandableContainerButton.classList.add('hidden')
      expandableContainerContentGradient.classList.add('hidden')
      return
    }

    const expand = () => {
      expandableContainerContent.classList.remove(maxHeightClassName)
      expandableContainerContent.classList.add('max-h-screen')
      expandableContainerButtonArrow.classList.add('-rotate-180')
      expandableContainerContentGradient.classList.add('hidden')
      expandableContainerButtonText.innerText = 'Show less'
    }

    const collapse = () => {
      expandableContainerContent.classList.remove('max-h-screen')
      expandableContainerContent.classList.add(maxHeightClassName)
      expandableContainerButtonArrow.classList.remove('-rotate-180')
      expandableContainerContentGradient.classList.remove('hidden')
      expandableContainerButtonText.innerText = 'Show more'
    }

    expandableContainerButton.addEventListener('click', () => {
      if (expandableContainerContent.classList.contains(maxHeightClassName)) {
        expand()
      } else {
        collapse()
      }
    })
  })
}
