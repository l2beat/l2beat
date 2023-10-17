export function getChangeHtml(value: string) {
  const isMore = value.startsWith('+')
  const isLess = value.startsWith('-')

  const arrowDown = `
  <svg width="10" height="5" viewBox="0 0 10 5" fill="var(--text)" role="img" aria-label="Arrow down icon" alt-text="-" class="inline-block rotate-180 fill-red-300 absolute top-1/2 translate-y-[-50%]">
    <path d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z"></path>
  </svg>
  `
  const arrowUp = `
  <svg width="10" height="5" viewBox="0 0 10 5" fill="var(--text)" role="img" aria-label="Arrow up icon" alt-text="+" class="inline-block fill-green-300 dark:fill-green-450 absolute top-1/2 translate-y-[-50%]">
    <path th d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z"></path>
  </svg>
  `
  return `
  <span class="relative ${isLess ? 'text-red-300' : ''}${
    isMore ? 'text-green-300 dark:text-green-450' : ''
  }">
    ${isMore ? arrowUp : ''}
    ${isLess ? arrowDown : ''}
    <span class="relative pl-3.5">${value.substring(1)}</span>
  </span>`
}
