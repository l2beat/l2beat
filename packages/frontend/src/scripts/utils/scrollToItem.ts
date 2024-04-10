interface ScrollToItemOptions {
  item: HTMLAnchorElement
  destinationItem: HTMLAnchorElement | null
  overflowingContainer: HTMLElement
}

export function scrollHorizontallyToItem({
  item,
  destinationItem,
  overflowingContainer,
}: ScrollToItemOptions) {
  if (destinationItem && destinationItem !== item) {
    return
  }
  const scrollPosition =
    item.offsetLeft -
    overflowingContainer.getBoundingClientRect().width / 2 +
    item.offsetWidth / 2
  overflowingContainer.scrollTo({
    left: scrollPosition,
    behavior: 'smooth',
  })
  destinationItem = null
}

export function scrollVerticallyToItem({
  item,
  overflowingContainer,
  destinationItem,
}: ScrollToItemOptions) {
  if (destinationItem && destinationItem !== item) {
    return
  }
  const scrollPosition =
    item.offsetTop -
    overflowingContainer.getBoundingClientRect().height / 2 +
    item.offsetHeight / 2
  overflowingContainer.scrollTo({
    top: scrollPosition,
    behavior: 'smooth',
  })
  destinationItem = null
}
