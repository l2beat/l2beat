import { THEME_DARK_QUERY, THEME_STORAGE_KEY } from '~/components/ThemeProvider'

/**
 * Applies the stored or system theme before first paint.
 *
 * Rendered in <head> on purpose: an inline script in <body> ahead of the page
 * content makes Arc flash a white frame on load.
 */
export function ThemeScript() {
  const script = `(function(){try{var d=document.documentElement,e=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}),t=e==="light"||e==="dark"?e:window.matchMedia(${JSON.stringify(THEME_DARK_QUERY)}).matches?"dark":"light";d.classList.add(t);d.style.colorScheme=t}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
