export const restoreCollapsibleNavStateScript = {
  dangerouslySetInnerHTML: {
    __html: `document.documentElement.classList[localStorage.getItem('l2beat-sidenav-collapsed') === "true" ? "add" : "remove"]("sidenav-collapsed")`,
  },
} as const
