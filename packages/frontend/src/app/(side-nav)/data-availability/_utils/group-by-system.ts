export function groupBySystem<T extends { isPublic: boolean }>(entries: T[]) {
  return {
    publicSystems: entries.filter((x) => x.isPublic),
    customSystems: entries.filter((x) => !x.isPublic),
  }
}
