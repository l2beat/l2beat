export function makeQuery(element: Element) {
  function $<T extends HTMLElement>(selector: string) {
    const result = element.querySelector<T>(selector)
    if (!result) {
      throw new Error(`${selector} not found!`)
    }
    return result
  }
  function $$<T extends HTMLElement>(selector: string) {
    return Array.from(element.querySelectorAll<T>(selector))
  }
  return { $, $$ }
}
