export function configureExpandableContainer() {
  const expandableContainers = document.querySelectorAll<HTMLElement>(
    '.ExpandableContainer',
  )

  expandableContainers.forEach((container) => {
    const expandableContainerContent = container.querySelector<HTMLElement>(
      '.ExpandableContainerContent',
    )
    const expandableContainerContentGradient =
      container.querySelector<HTMLElement>(
        '.ExpandableContainerContentGradient',
      )
    const expandableContainerButton = container.querySelector<HTMLElement>(
      '.ExpandableContainerButton',
    )
    const expandableContainerButtonText =
      expandableContainerButton?.querySelector<HTMLElement>(
        '.ExpandableContainerButtonText',
      )
    const expandableContainerButtonArrow =
      expandableContainerButton?.querySelector<HTMLElement>(
        '.ExpandableContainerButtonArrow',
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
