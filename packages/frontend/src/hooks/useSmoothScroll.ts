import { useHtmlClass } from './useHtmlElement'

/** Anchor navigation on the page scrolls smoothly for as long as it is mounted. */
export function useSmoothScroll() {
  useHtmlClass('scroll-smooth')
}
