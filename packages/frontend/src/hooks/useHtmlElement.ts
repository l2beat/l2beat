import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

// Page-level state used to reach <html> through :has() rules on the root.
// Chrome then restyled the whole document on every DOM insertion, which was
// the bulk of the post-hydration stutter on project pages, so pages now set
// their root class or attribute directly.
export function useHtmlClass(className: string) {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add(className)
    return () => document.documentElement.classList.remove(className)
  }, [className])
}

export function useHtmlAttribute(name: string, value: string) {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute(name, value)
    return () => document.documentElement.removeAttribute(name)
  }, [name, value])
}
