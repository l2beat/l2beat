import React from 'react'

export function useScreenElementWith(element: HTMLElement | null) {
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  React.useEffect(() => {
    if (element === null) {
      return
    }
    const handler = () => {
      setRect(element.getBoundingClientRect())
    }
    handler()
    window.addEventListener('resize', handler)

    return () => window.removeEventListener('resize', handler)
  }, [element])
  return rect
}
