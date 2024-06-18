export const restoreCollapsibleNavStateScript = {
  dangerouslySetInnerHTML: {
    __html: `document.documentElement.classList[localStorage.getItem('l2beat-sidenav-collapsed') === "true" ? "add" : "remove"]("sidenav-collapsed")`,
  },
} as const

export const glossarySectionTreshold = {
  desktop: '164px',
  mobile: '132px',
} as const

// NOTE(radomski): This is not an ASCII minus character, but a UTF-8 "Em Dash"
// Look here for more: https://www.compart.com/en/unicode/U+2014
export const EM_DASH = '—'
