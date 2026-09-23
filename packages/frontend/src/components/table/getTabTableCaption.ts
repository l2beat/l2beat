/** Tables shared across tabs name the tab, so each caption says which slice it lists. */
export function getTabTableCaption(subject: string, tabLabel: string) {
  return `${subject}, ${tabLabel} tab`
}
