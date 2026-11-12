import { useEffect } from 'react'

/**
 * Puts the home theme (`.home-theme` in globals.css) on `<html>` while the
 * page is mounted, so popovers portalled to `<body>` get it too. The page
 * also sets the class on its own wrapper, which themes the first paint.
 */
export function useHomeTheme() {
  useEffect(() => {
    document.documentElement.classList.add('home-theme')
    return () => document.documentElement.classList.remove('home-theme')
  }, [])
}
