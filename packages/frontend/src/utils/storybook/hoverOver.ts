import { RefObject } from 'react'

export function hoverOver<T extends HTMLElement>(ref: RefObject<T>) {
  ref.current?.dispatchEvent(new MouseEvent('mouseenter'))
  // remove all event listeners, leaving them will cause reg-viz to remove on hover state
  document.body.replaceWith(document.body.cloneNode(true))
}
