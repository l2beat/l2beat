interface ScrollToItemOptions {
  item: HTMLElement
  overflowingContainer: HTMLElement
  behavior?: ScrollBehavior
}

export function scrollHorizontallyToItem({
  item,
  overflowingContainer,
  behavior,
}: ScrollToItemOptions) {
  const scrollPosition =
    item.offsetLeft -
    overflowingContainer.getBoundingClientRect().width / 2 +
    item.offsetWidth / 2
  overflowingContainer.scrollTo({
    left: scrollPosition,
    behavior,
  })
}

export function scrollVerticallyToItem({
  item,
  overflowingContainer,
  behavior,
}: ScrollToItemOptions) {
  const scrollPosition =
    item.offsetTop -
    overflowingContainer.getBoundingClientRect().height / 2 +
    item.offsetHeight / 2
  overflowingContainer.scrollTo({
    top: scrollPosition,
    behavior,
  })
}
