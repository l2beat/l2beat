export function stripQueryParams(url: string) {
  const result = url.split('?')[0]
  if (!result) {
    throw new Error('Invalid URL')
  }
  return result
}
