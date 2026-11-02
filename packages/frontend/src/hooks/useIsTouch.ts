import { useEffect, useState } from 'react'

/**
 * Whether the main input is a finger: no hover and a coarse pointer. Width
 * says nothing about this, so a touch tablet in landscape counts and a narrow
 * desktop window does not. False during server rendering.
 */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(hover: none) and (pointer: coarse)')
    setTouch(query.matches)
    const onChange = () => setTouch(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return touch
}
