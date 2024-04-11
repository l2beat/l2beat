interface ScrollToItemOptions {
  item: HTMLAnchorElement
  overflowingContainer: HTMLElement
}

export function scrollHorizontallyToItem({
  item,
  overflowingContainer,
}: ScrollToItemOptions) {
  const scrollPosition =
    item.offsetLeft -
    overflowingContainer.getBoundingClientRect().width / 2 +
    item.offsetWidth / 2
  overflowingContainer.scrollTo({
    left: scrollPosition,
    behavior: 'smooth',
  })
}

export function scrollVerticallyToItem({
  item,
  overflowingContainer,
}: ScrollToItemOptions) {
  const scrollPosition =
    item.offsetTop -
    overflowingContainer.getBoundingClientRect().height / 2 +
    item.offsetHeight / 2
  overflowingContainer.scrollTo({
    top: scrollPosition,
    behavior: 'smooth',
  })
}
