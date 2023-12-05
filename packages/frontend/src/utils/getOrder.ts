export function getSortingOrder<T extends { slug: string }>(
  items: T[],
  check: (a: T, b: T) => boolean | number,
) {
  const order = [...items]
  order.sort((a, b) => {
    const result = check(a, b)
    if (typeof result === 'boolean') {
      return result ? -1 : 1
    }
    return result
  })
  return order.map((item) => item.slug)
}
