export function getUrlWithParams(url: string, params: Record<string, string>) {
  const urlWithParams = new URL(url)
  Object.entries(params).forEach(([key, value]) => {
    urlWithParams.searchParams.set(key, value)
  })
  return urlWithParams.toString()
}
