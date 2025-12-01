export function toggleInList(item: string, list: string[]): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}
