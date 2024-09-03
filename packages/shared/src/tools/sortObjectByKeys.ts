export function sortObjectByKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.keys(obj)
    .sort()
    .reduce((sortedObj: Record<string, T>, key) => {
      sortedObj[key] = obj[key]
      return sortedObj
    }, {})
}
