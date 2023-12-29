export function setQueryParams(urlParams: URLSearchParams, hash?: string) {
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}?${urlParams.toString()}${
      hash ? `#${hash}` : window.location.hash
    }`,
  )
}
