export const pluralize = (num: number, word: string, plural = word + 's') =>
  [1, -1].includes(Number(num)) ? word : plural
