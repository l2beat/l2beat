export function click(selector: string) {
  document.querySelector<HTMLElement>(selector)?.click()
}
