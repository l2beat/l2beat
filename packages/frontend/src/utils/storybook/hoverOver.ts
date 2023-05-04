export function hoverOver(selector: string) {
  document.querySelector(selector)?.dispatchEvent(new MouseEvent('mouseenter'))
  // remove all event listeners, leaving them will cause reg-viz to remove on hover state
  document.body.replaceWith(document.body.cloneNode(true))
}
