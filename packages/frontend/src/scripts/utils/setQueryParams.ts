export function setQueryParams(urlParams: URLSearchParams) {
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}?${urlParams.toString()}`,
  )
}
