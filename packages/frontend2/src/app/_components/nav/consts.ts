export const restoreCollapsibleNavStateScript = {
  dangerouslySetInnerHTML: {
    __html: `document.documentElement.classList[localStorage.getItem('l2beat-sidenav-collapsed') === "true" ? "add" : "remove"]("sidenav-collapsed")`,
  },
} as const

export const glossarySectionTreshold = {
  desktop: '164px',
  mobile: '132px',
} as const
